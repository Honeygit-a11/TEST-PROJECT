import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { PromoCodeModel } from '@/models/PromoCode';
import { requireAdmin } from '@/lib/auth';
import { validateBody } from '@/lib/validations/validate';
import { updatePromoCodeSchema } from '@/lib/validations/promo.schema';

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const id = params.id;
    const body = await req.json().catch(() => null);
    const validation = validateBody(updatePromoCodeSchema, body);
    if (!validation.success) return validation.response;

    await dbConnect();
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { code: id.toUpperCase() };

    let updated;
    try {
      updated = await PromoCodeModel.findOneAndUpdate(
        query,
        { $set: validation.data },
        { new: true }
      ).lean();
    } catch (error: any) {
      if (error?.code === 11000) {
        return NextResponse.json(
          { error: { code: 'DUPLICATE_PROMO_CODE', message: 'A promo code with this code already exists' } },
          { status: 409 }
        );
      }
      throw error;
    }

    if (!updated) {
      return NextResponse.json(
        { error: { code: 'PROMO_NOT_FOUND', message: 'Promo code not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: String(updated._id),
      code: updated.code,
      discountType: updated.discountType,
      discountValue: updated.discountValue,
      minSubtotal: updated.minSubtotal,
      maxUses: updated.maxUses,
      usedCount: updated.usedCount,
      active: updated.active,
      expiresAt: updated.expiresAt,
    });
  } catch (error) {
    console.error('PATCH promo error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update promo code' } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const id = params.id;
    await dbConnect();

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { code: id.toUpperCase() };
    const deleted = await PromoCodeModel.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { error: { code: 'PROMO_NOT_FOUND', message: 'Promo code not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, message: 'Promo code deleted' });
  } catch (error) {
    console.error('DELETE promo error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete promo code' } },
      { status: 500 }
    );
  }
}
