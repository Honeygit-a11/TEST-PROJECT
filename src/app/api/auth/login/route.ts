import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { signToken, setAuthCookie, clearAuthCookie } from '@/lib/auth';
import { applyRateLimit } from '@/lib/rate-limit';
import { validateBody } from '@/lib/validations/validate';
import { loginSchema } from '@/lib/validations/auth.schema';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 login attempts per 60 seconds per IP
    const rateLimitResponse = applyRateLimit(req, 'auth_login', { limit: 5, windowMs: 60_000 });
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json().catch(() => null);
    const validation = validateBody(loginSchema, body);
    if (!validation.success) return validation.response;

    const { email, password } = validation.data;

    await dbConnect();
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    setAuthCookie(token);

    return NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('POST /api/auth/login failed:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Login service encountered an error' } },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  clearAuthCookie();
  return NextResponse.json({ ok: true });
}
