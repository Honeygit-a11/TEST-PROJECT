import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { PromoCodeModel } from '@/models/PromoCode';
import { requireAdmin } from '@/lib/auth';
import { validateBody } from '@/lib/validations/validate';
import { createPromoCodeSchema } from '@/lib/validations/promo.schema';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    await dbConnect();
    const promos = await PromoCodeModel.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      promos.map((p) => ({
        id: String(p._id),
        code: p.code,
        discountType: p.discountType,
        discountValue: p.discountValue,
        minSubtotal: p.minSubtotal,
        maxUses: p.maxUses,
        usedCount: p.usedCount,
        active: p.active,
        expiresAt: p.expiresAt,
        createdAt: p.createdAt,
      }))
    );
  } catch (error) {
    console.error('GET promos error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve promo codes' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => null);
    const validation = validateBody(createPromoCodeSchema, body);
    if (!validation.success) return validation.response;

    await dbConnect();
    const existing = await PromoCodeModel.findOne({ code: validation.data.code }).lean();
    if (existing) {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_PROMO_CODE', message: `Promo code "${validation.data.code}" already exists.` } },
        { status: 409 }
      );
    }

    const created = await PromoCodeModel.create({
      code: validation.data.code,
      discountType: validation.data.discountType,
      discountValue: validation.data.discountValue,
      minSubtotal: validation.data.minSubtotal || 0,
      maxUses: validation.data.maxUses ?? null,
      active: validation.data.active ?? true,
      expiresAt: validation.data.expiresAt ? new Date(validation.data.expiresAt) : null,
    });

    return NextResponse.json(
      {
        id: String(created._id),
        code: created.code,
        discountType: created.discountType,
        discountValue: created.discountValue,
        minSubtotal: created.minSubtotal,
        maxUses: created.maxUses,
        usedCount: created.usedCount,
        active: created.active,
        expiresAt: created.expiresAt,
        createdAt: created.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST promo error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create promo code' } },
      { status: 500 }
    );
  }
}
