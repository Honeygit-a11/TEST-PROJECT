import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { OrderModel } from '@/models/Order';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const order = await OrderModel.findOne({
      $or: [{ orderNumber: params.id }],
    }).lean();

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
