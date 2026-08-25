import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { signToken, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => null);
    const { email, password } = body ?? {};

    if (!email || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

export async function DELETE() {
  clearAuthCookie();
  return NextResponse.json({ ok: true });
}
