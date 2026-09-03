import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';
import { applyRateLimit } from '@/lib/rate-limit';
import { validateBody } from '@/lib/validations/validate';
import { registerSchema } from '@/lib/validations/auth.schema';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 registration attempts per 60 seconds per IP
    const rateLimitResponse = applyRateLimit(req, 'auth_register', { limit: 5, windowMs: 60_000 });
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json().catch(() => null);
    const validation = validateBody(registerSchema, body);
    if (!validation.success) return validation.response;

    const { name, email, password } = validation.data;

    await dbConnect();
    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: { code: 'EMAIL_ALREADY_EXISTS', message: 'An account with this email already exists' } },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, passwordHash });

    const token = await signToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
    await setAuthCookie(token);

    return NextResponse.json(
      { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/auth/register failed:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Registration service encountered an error' } },
      { status: 500 }
    );
  }
}
