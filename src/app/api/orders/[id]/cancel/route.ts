import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { OrderModel } from '@/models/Order';
import { ProductModel } from '@/models/Product';
import { PromoCodeModel } from '@/models/PromoCode';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const id = params.id;
    await dbConnect();

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { orderNumber: id };
    const order = await OrderModel.findOne(query);

    if (!order) {
      return NextResponse.json(
        { error: { code: 'ORDER_NOT_FOUND', message: `No order found with identifier "${id}"` } },
        { status: 404 }
      );
    }

    // Check authorization: logged-in user, admin, or guest email verification
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    const providedEmail = (body?.email || '').trim().toLowerCase();

    const orderEmail = (order.customer?.email || order.userEmail || '').toLowerCase();
    const isOwner =
      (session && session.email.toLowerCase() === orderEmail) ||
      (providedEmail && providedEmail === orderEmail) ||
      session?.role === 'admin';

    if (!isOwner) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'You are not authorized to cancel this order. Verification email mismatch.',
          },
        },
        { status: 403 }
      );
    }

    // 1. Atomically transition status to cancelled (only pending/paid can cancel).
    // The conditional update ensures a concurrent request cannot double-cancel:
    // only the first request that flips the status proceeds to restore stock.
    const cancelled = await OrderModel.findOneAndUpdate(
      { _id: order._id, status: { $in: ['pending', 'paid'] } },
      { $set: { status: 'cancelled' } },
      { new: true }
    );

    if (!cancelled) {
      const current = await OrderModel.findById(order._id);
      if (current?.status === 'cancelled') {
        return NextResponse.json(
          { error: { code: 'ALREADY_CANCELLED', message: 'Order has already been cancelled.' } },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          error: {
            code: 'CANNOT_CANCEL_DISPATCHED_ORDER',
            message: `Order status is "${(current?.status || 'unknown').toUpperCase()}". It has already been dispatched and cannot be cancelled.`,
          },
        },
        { status: 422 }
      );
    }

    // 2. Atomically restore inventory stock for all products.
    // inStock is derived from the post-increment stock, so a product that
    // remains at 0 (sold out elsewhere concurrently) is not incorrectly
    // marked as back in stock.
    for (const item of cancelled.items) {
      if (item.productId) {
        await ProductModel.updateOne(
          { id: item.productId },
          [
            { $set: { stock: { $add: ['$stock', item.quantity] } } },
            { $set: { inStock: { $gt: ['$stock', 0] } } },
          ],
          { updatePipeline: true }
        );
      }
    }

    // 3. Roll back promo code redemption counter if applied, guarding against
    // decrementing below zero.
    if (cancelled.promoCode) {
      await PromoCodeModel.updateOne(
        { code: cancelled.promoCode.toUpperCase(), usedCount: { $gt: 0 } },
        { $inc: { usedCount: -1 } }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Order cancelled successfully. Items have been restored to available inventory.',
      status: 'cancelled',
      orderNumber: cancelled.orderNumber,
    });
  } catch (error) {
    console.error('POST /api/orders/[id]/cancel error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to process order cancellation' } },
      { status: 500 }
    );
  }
}
