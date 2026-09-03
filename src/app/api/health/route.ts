import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { OrderModel } from '@/models/Order';
import { UserModel } from '@/models/User';
import { PromoCodeModel } from '@/models/PromoCode';
import { ReviewModel } from '@/models/Review';
import { SubscriberModel } from '@/models/Subscriber';

export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    await dbConnect();

    let dbConnected = false;
    let latencyMs = 0;

    // Benchmark database roundtrip latency
    if (mongoose.connection.db) {
      const pingStart = performance.now();
      await mongoose.connection.db.admin().ping();
      latencyMs = Math.round((performance.now() - pingStart) * 10) / 10;
      dbConnected = true;
    }

    // Count entities across all collections
    const [
      productsCount,
      ordersCount,
      usersCount,
      promosCount,
      reviewsCount,
      subscribersCount,
    ] = await Promise.all([
      ProductModel.countDocuments().catch(() => 0),
      OrderModel.countDocuments().catch(() => 0),
      UserModel.countDocuments().catch(() => 0),
      PromoCodeModel.countDocuments().catch(() => 0),
      ReviewModel.countDocuments().catch(() => 0),
      SubscriberModel.countDocuments().catch(() => 0),
    ]);

    const totalEntities =
      productsCount +
      ordersCount +
      usersCount +
      promosCount +
      reviewsCount +
      subscribersCount;

    const mem = process.memoryUsage();
    const uptimeSeconds = Math.floor(process.uptime());

    const isHealthy = dbConnected;
    const statusCode = isHealthy ? 200 : 503;

    return NextResponse.json(
      {
        status: isHealthy ? 'HEALTHY' : 'DEGRADED',
        timestamp,
        database: {
          connected: dbConnected,
          latencyMs,
          collections: {
            products: productsCount,
            orders: ordersCount,
            users: usersCount,
            promoCodes: promosCount,
            reviews: reviewsCount,
            subscribers: subscribersCount,
            totalEntities,
          },
        },
        runtime: {
          uptimeSeconds,
          nodeVersion: process.version,
          memory: {
            rssMb: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
            heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
            heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 10) / 10,
          },
          environment: process.env.NODE_ENV || 'development',
        },
      },
      { status: statusCode }
    );
  } catch (error) {
    console.error('Healthcheck diagnostic error:', error);
    return NextResponse.json(
      {
        status: 'UNHEALTHY',
        timestamp,
        error: {
          code: 'DATABASE_OFFLINE',
          message: error instanceof Error ? error.message : 'Database connectivity failed',
        },
      },
      { status: 503 }
    );
  }
}
