import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { getSession, clearAuthCookie } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await dbConnect();
    const user = await UserModel.findById(session.userId).lean();
    if (!user) {
      clearAuthCookie();
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('GET /api/auth/me failed:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
