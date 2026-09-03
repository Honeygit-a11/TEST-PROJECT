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

    if (order.status === 'cancelled') {
      return NextResponse.json(
        { error: { code: 'ALREADY_CANCELLED', message: 'Order has already been cancelled.' } },
        { status: 400 }
      );
    }

    // Can only cancel if still in pending or paid status
    if (order.status !== 'pending' && order.status !== 'paid') {
      return NextResponse.json(
        {
          error: {
            code: 'CANNOT_CANCEL_DISPATCHED_ORDER',
            message: `Order status is "${order.status.toUpperCase()}". It has already been dispatched and cannot be cancelled.`,
          },
        },
        { status: 422 }
      );
    }

    // 1. Update order status
    order.status = 'cancelled';
    await order.save();

    // 2. Atomically restore inventory stock for all products
    for (const item of order.items) {
      if (item.productId) {
        await ProductModel.updateOne(
          { id: item.productId },
          { $inc: { stock: item.quantity }, $set: { inStock: true } }
        );
      }
    }

    // 3. Roll back promo code redemption counter if applied
    if (order.promoCode) {
      await PromoCodeModel.updateOne(
        { code: order.promoCode.toUpperCase() },
        { $inc: { usedCount: -1 } }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Order cancelled successfully. Items have been restored to available inventory.',
      status: 'cancelled',
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('POST /api/orders/[id]/cancel error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to process order cancellation' } },
      { status: 500 }
    );
  }
}
