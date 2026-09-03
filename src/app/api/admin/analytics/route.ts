import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { OrderModel } from '@/models/Order';
import { ProductModel } from '@/models/Product';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    await dbConnect();

    const [orders, products] = await Promise.all([
      OrderModel.find({}).sort({ createdAt: -1 }).lean(),
      ProductModel.find({}).lean(),
    ]);

    // Map productId -> Category
    const productCategoryMap = new Map<string, string>();
    const productDetailMap = new Map<string, { name: string; sku: string; image: string }>();
    for (const p of products) {
      productCategoryMap.set(p.id, p.category);
      productDetailMap.set(p.id, { name: p.name, sku: p.sku, image: p.image });
    }

    const validOrders = orders.filter((o) => o.status !== 'cancelled');
    const totalOrders = orders.length;

    let grossRevenue = 0;
    let netSubtotal = 0;
    let totalDiscounts = 0;
    let totalUnitsShipped = 0;

    const statusCounts: Record<string, number> = {
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    for (const o of orders) {
      const st = o.status.toLowerCase();
      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      } else {
        statusCounts[st] = 1;
      }
    }

    const categoryPerformance: Record<string, { units: number; revenue: number }> = {
      'T-SHIRTS': { units: 0, revenue: 0 },
      OUTERWEAR: { units: 0, revenue: 0 },
      PANTS: { units: 0, revenue: 0 },
      ACCESSORIES: { units: 0, revenue: 0 },
    };

    const productVelocityMap = new Map<
      string,
      { id: string; name: string; sku: string; image: string; unitsSold: number; revenue: number }
    >();

    for (const o of validOrders) {
      grossRevenue += o.total || 0;
      netSubtotal += o.subtotal || 0;
      totalDiscounts += o.discount || 0;

      for (const item of o.items) {
        totalUnitsShipped += item.quantity || 1;
        const cat = productCategoryMap.get(item.productId) || 'T-SHIRTS';
        if (!categoryPerformance[cat]) {
          categoryPerformance[cat] = { units: 0, revenue: 0 };
        }
        categoryPerformance[cat].units += item.quantity || 1;
        categoryPerformance[cat].revenue += (item.price || 0) * (item.quantity || 1);

        // Product velocity
        const existing = productVelocityMap.get(item.productId);
        const details = productDetailMap.get(item.productId);
        if (existing) {
          existing.unitsSold += item.quantity || 1;
          existing.revenue += (item.price || 0) * (item.quantity || 1);
        } else {
          productVelocityMap.set(item.productId, {
            id: item.productId,
            name: item.name || details?.name || 'Archive Product',
            sku: details?.sku || 'NX-PROD',
            image: item.image || details?.image || '',
            unitsSold: item.quantity || 1,
            revenue: (item.price || 0) * (item.quantity || 1),
          });
        }
      }
    }

    const aov = validOrders.length > 0 ? grossRevenue / validOrders.length : 0;

    const topArtifacts = Array.from(productVelocityMap.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    const recentLedger = orders.slice(0, 10).map((o) => ({
      orderNumber: o.orderNumber,
      customerName: o.customer?.name || 'Guest User',
      customerEmail: o.customer?.email || o.userEmail || '',
      total: o.total,
      discount: o.discount,
      status: o.status,
      itemsCount: (o.items || []).reduce((acc: number, i: any) => acc + (i.quantity || 1), 0),
      createdAt: o.createdAt,
    }));

    return NextResponse.json({
      metrics: {
        grossRevenue: Math.round(grossRevenue * 100) / 100,
        netSubtotal: Math.round(netSubtotal * 100) / 100,
        totalDiscounts: Math.round(totalDiscounts * 100) / 100,
        averageOrderValue: Math.round(aov * 100) / 100,
        totalOrders,
        validOrdersCount: validOrders.length,
        totalUnitsShipped,
      },
      statusCounts,
      categoryPerformance,
      topArtifacts,
      recentLedger,
    });
  } catch (error) {
    console.error('GET /api/admin/analytics error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to compute analytics telemetry' } },
      { status: 500 }
    );
  }
}
