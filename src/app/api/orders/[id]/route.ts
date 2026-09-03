import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { OrderModel, ORDER_STATUSES } from '@/models/Order';
import { getSession, requireAdmin } from '@/lib/auth';

// Match an order by human-facing orderNumber, or by _id when the param is a valid ObjectId.
function idQuery(id: string): { $or: Record<string, unknown>[] } {
  const conditions: Record<string, unknown>[] = [{ orderNumber: id }];
  if (isValidObjectId(id)) conditions.push({ _id: id });
  return { $or: conditions };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const order = await OrderModel.findOne(idQuery(params.id)).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only allow the owner or an admin to view full order details
    const session = await getSession();
    const isOwner = session && order.userEmail && session.email === order.userEmail;
    const isAdmin = session?.role === 'admin';

    if (!isOwner && !isAdmin) {
      // Publicly expose only minimal tracking info
      return NextResponse.json({
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`GET /api/orders/${params.id} failed:`, error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// Admin-only: update an order's status.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => null);
    const status = body?.status;
    if (typeof status !== 'string' || !(ORDER_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${ORDER_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    await dbConnect();
    const order = await OrderModel.findOneAndUpdate(
      idQuery(params.id),
      { $set: { status } },
      { returnDocument: 'after' }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error(`PATCH /api/orders/${params.id} failed:`, error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
