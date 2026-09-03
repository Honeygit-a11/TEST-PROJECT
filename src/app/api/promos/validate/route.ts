import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { PromoCodeModel } from '@/models/PromoCode';
import { validateBody } from '@/lib/validations/validate';
import { validatePromoSchema } from '@/lib/validations/promo.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const validation = validateBody(validatePromoSchema, body);
    if (!validation.success) return validation.response;

    const { code, subtotal } = validation.data;
    const normalizedCode = code.trim().toUpperCase();

    await dbConnect();

    // Check DB for promo code
    let promo = await PromoCodeModel.findOne({ code: normalizedCode }).lean();

    // Seed default archive promo codes if DB doesn't have them yet
    if (!promo && (normalizedCode === 'ARCHIVE10' || normalizedCode === 'NEO2026')) {
      const created = await PromoCodeModel.create({
        code: normalizedCode,
        discountType: 'percentage',
        discountValue: 10,
        minSubtotal: 0,
        active: true,
      });
      promo = created.toObject();
    }

    if (!promo) {
      return NextResponse.json(
        { error: { code: 'INVALID_PROMO_CODE', message: `Promo code "${normalizedCode}" is invalid.` } },
        { status: 404 }
      );
    }

    if (!promo.active) {
      return NextResponse.json(
        { error: { code: 'PROMO_CODE_DISABLED', message: `Promo code "${normalizedCode}" is no longer active.` } },
        { status: 422 }
      );
    }

    if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { error: { code: 'PROMO_CODE_EXPIRED', message: `Promo code "${normalizedCode}" has expired.` } },
        { status: 422 }
      );
    }

    if (typeof promo.maxUses === 'number' && promo.usedCount >= promo.maxUses) {
      return NextResponse.json(
        { error: { code: 'PROMO_LIMIT_REACHED', message: `Promo code "${normalizedCode}" redemption limit reached.` } },
        { status: 422 }
      );
    }

    if (subtotal < (promo.minSubtotal || 0)) {
      return NextResponse.json(
        {
          error: {
            code: 'MINIMUM_ORDER_UNMET',
            message: `Promo code "${normalizedCode}" requires a minimum subtotal of $${promo.minSubtotal.toFixed(2)}.`,
          },
        },
        { status: 422 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = Math.round(subtotal * (promo.discountValue / 100) * 100) / 100;
    } else {
      discount = Math.min(subtotal, promo.discountValue);
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discount,
      minSubtotal: promo.minSubtotal,
    });
  } catch (error) {
    console.error('Validate promo error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to validate promo code' } },
      { status: 500 }
    );
  }
}
