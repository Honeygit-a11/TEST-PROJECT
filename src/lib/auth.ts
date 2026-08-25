import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'neo_archive_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Please define JWT_SECRET inside .env');
  return new TextEncoder().encode(secret);
}

export interface SessionUser {
  userId: string;
  email: string;
  role: string;
}

export async function signToken(session: SessionUser): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return null;
    }
    return { userId: payload.userId, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string): void {
  cookies().set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearAuthCookie(): void {
  cookies().set({
    name: AUTH_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  return verifySession(cookies().get(AUTH_COOKIE)?.value);
}
