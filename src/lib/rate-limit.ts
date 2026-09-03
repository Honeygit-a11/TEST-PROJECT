import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    store.forEach((record, key) => {
      if (now > record.resetTime) {
        store.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; limit: number; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + options.windowMs });
    return {
      allowed: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetMs: options.windowMs,
    };
  }

  if (record.count >= options.limit) {
    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      resetMs: Math.max(0, record.resetTime - now),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    limit: options.limit,
    remaining: options.limit - record.count,
    resetMs: Math.max(0, record.resetTime - now),
  };
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export function applyRateLimit(
  req: NextRequest,
  actionKey: string,
  options: RateLimitOptions
): NextResponse | null {
  const ip = getClientIp(req);
  const key = `${actionKey}:${ip}`;
  const result = checkRateLimit(key, options);

  if (!result.allowed) {
    const retrySeconds = Math.ceil(result.resetMs / 1000);
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Please try again in ${retrySeconds} seconds.`,
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retrySeconds),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return null;
}
