import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => null);
    const { name, email, password } = body ?? {};

    if (!name || !email || !password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'name, email and a password of at least 6 characters are required' },
        { status: 400 }
      );
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
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
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
