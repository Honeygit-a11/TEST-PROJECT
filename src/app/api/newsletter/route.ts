import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SubscriberModel } from '@/models/Subscriber';
import { applyRateLimit } from '@/lib/rate-limit';
import { validateBody } from '@/lib/validations/validate';
import { createSubscriberSchema } from '@/lib/validations/subscriber.schema';

export async function POST(req: NextRequest) {
  try {
    const rateLimitRes = applyRateLimit(req, 'newsletter_sub', { limit: 5, windowMs: 60 * 1000 });
    if (rateLimitRes) return rateLimitRes;

    const body = await req.json().catch(() => null);
    const validation = validateBody(createSubscriberSchema, body);
    if (!validation.success) return validation.response;

    const { email, source } = validation.data;
    await dbConnect();

    const existing = await SubscriberModel.findOne({ email });

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          {
            message: 'Identity confirmed. You are already on the VIP priority drop list.',
            alreadySubscribed: true,
          },
          { status: 200 }
        );
      } else {
        existing.status = 'active';
        await existing.save();
        return NextResponse.json(
          {
            message: 'Identity reactivated for priority drop announcements.',
            reactivated: true,
          },
          { status: 200 }
        );
      }
    }

    const created = await SubscriberModel.create({
      email,
      source: source || 'footer',
      status: 'active',
    });

    return NextResponse.json(
      {
        message: 'Access granted. Welcome to the underground archive priority list.',
        email: created.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/newsletter error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to process drop subscription' } },
      { status: 500 }
    );
  }
}
