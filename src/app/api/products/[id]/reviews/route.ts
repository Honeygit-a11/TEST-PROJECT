import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ReviewModel } from '@/models/Review';
import { ProductModel } from '@/models/Product';
import { OrderModel } from '@/models/Order';
import { UserModel } from '@/models/User';
import { requireUser } from '@/lib/auth';
import { applyRateLimit } from '@/lib/rate-limit';
import { validateBody } from '@/lib/validations/validate';
import { createReviewSchema } from '@/lib/validations/review.schema';

interface RouteContext {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const productId = params.id;
    await dbConnect();

    const [reviews, stats] = await Promise.all([
      ReviewModel.find({ productId }).sort({ createdAt: -1 }).limit(50).lean(),
      ReviewModel.aggregate([
        { $match: { productId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            ratingSum: { $sum: '$rating' },
            dist: { $push: '$rating' },
          },
        },
      ]),
    ]);

    // Stats are computed over ALL reviews, not just the 50 most recent shown.
    const agg = stats[0];
    const total = agg ? agg.total : 0;
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (agg) {
      for (const rating of agg.dist) {
        if (distribution[rating] !== undefined) distribution[rating]++;
      }
    }
    const averageRating = total > 0 ? Math.round((agg.ratingSum / total) * 10) / 10 : 0;

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: String(r._id),
        userName: r.userName,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        verifiedBuyer: r.verifiedBuyer,
        createdAt: r.createdAt,
      })),
      meta: {
        total,
        averageRating,
        distribution,
      },
    });
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve reviews' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const rateLimitRes = applyRateLimit(req, 'product_review', { limit: 5, windowMs: 60 * 1000 });
    if (rateLimitRes) return rateLimitRes;

    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => null);
    const validation = validateBody(createReviewSchema, body);
    if (!validation.success) return validation.response;

    const productId = params.id;
    await dbConnect();

    const product = await ProductModel.findOne({ id: productId }).lean();
    if (!product) {
      return NextResponse.json(
        { error: { code: 'PRODUCT_NOT_FOUND', message: `No product found with id "${productId}"` } },
        { status: 404 }
      );
    }

    const user = await UserModel.findById(auth.session.userId).lean();
    const userName = user?.name || auth.session.email.split('@')[0];

    // Check if user has purchased this product previously
    const existingOrder = await OrderModel.findOne({
      $or: [
        { userEmail: auth.session.email.toLowerCase() },
        { 'customer.email': auth.session.email.toLowerCase() },
      ],
      'items.productId': productId,
      status: { $in: ['paid', 'shipped', 'delivered'] },
    }).lean();

    const review = await ReviewModel.create({
      productId,
      userId: auth.session.userId,
      userName,
      rating: validation.data.rating,
      title: validation.data.title,
      comment: validation.data.comment,
      verifiedBuyer: Boolean(existingOrder),
    });

    return NextResponse.json(
      {
        review: {
          id: String(review._id),
          userName: review.userName,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          verifiedBuyer: review.verifiedBuyer,
          createdAt: review.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST review error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to submit review' } },
      { status: 500 }
    );
  }
}

