import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { getSession, requireUser, clearAuthCookie } from '@/lib/auth';
import { validateBody } from '@/lib/validations/validate';
import { updateProfileSchema } from '@/lib/validations/user.schema';

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
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        shippingAddress: user.shippingAddress || { address: '', city: '', postalCode: '', country: '' },
        wishlist: user.wishlist || [],
      },
    });
  } catch (error) {
    console.error('GET /api/auth/me failed:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch session' } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => null);
    const validation = validateBody(updateProfileSchema, body);
    if (!validation.success) return validation.response;

    await dbConnect();
    const updated = await UserModel.findByIdAndUpdate(
      auth.session.userId,
      { $set: validation.data },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: { code: 'USER_NOT_FOUND', message: 'User identity not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: String(updated._id),
        name: updated.name,
        email: updated.email,
        role: updated.role,
        shippingAddress: updated.shippingAddress || { address: '', city: '', postalCode: '', country: '' },
        wishlist: updated.wishlist || [],
      },
    });
  } catch (error) {
    console.error('PATCH /api/auth/me failed:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update user profile' } },
      { status: 500 }
    );
  }
}
