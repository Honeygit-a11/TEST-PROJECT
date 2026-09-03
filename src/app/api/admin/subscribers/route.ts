import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SubscriberModel } from '@/models/Subscriber';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    await dbConnect();

    const filter: any = {};
    if (query) {
      filter.email = { $regex: query.trim(), $options: 'i' };
    }

    const [subscribers, total, activeCount] = await Promise.all([
      SubscriberModel.find(filter).sort({ createdAt: -1 }).limit(100).lean(),
      SubscriberModel.countDocuments(filter),
      SubscriberModel.countDocuments({ status: 'active' }),
    ]);

    return NextResponse.json({
      subscribers: subscribers.map((s) => ({
        id: String(s._id),
        email: s.email,
        status: s.status,
        source: s.source,
        createdAt: s.createdAt,
      })),
      meta: {
        total,
        activeCount,
      },
    });
  } catch (error) {
    console.error('GET /api/admin/subscribers error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve subscribers' } },
      { status: 500 }
    );
  }
}
