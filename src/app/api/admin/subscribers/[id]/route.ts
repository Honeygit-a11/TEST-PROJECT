import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SubscriberModel } from '@/models/Subscriber';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: { id: string };
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const id = params.id;
    await dbConnect();

    const deleted = await SubscriberModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: { code: 'SUBSCRIBER_NOT_FOUND', message: 'Subscriber record not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, message: 'Subscriber removed from priority list' });
  } catch (error) {
    console.error('DELETE /api/admin/subscribers/[id] error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete subscriber' } },
      { status: 500 }
    );
  }
}
