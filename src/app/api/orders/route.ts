import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { OrderModel, OrderItem, ORDER_STATUSES } from '@/models/Order';
import { ProductModel } from '@/models/Product';
import { getSession, requireUser } from '@/lib/auth';
import { applyRateLimit } from '@/lib/rate-limit';
import { validateBody } from '@/lib/validations/validate';
import { createOrderSchema } from '@/lib/validations/order.schema';

const SHIPPING_FLAT = 8.0;
const FREE_SHIPPING_THRESHOLD = 120.0;
const VALID_PROMOS: Record<string, number> = { ARCHIVE10: 0.1, NEO2026: 0.1 };

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NX-${stamp}-${rand}`;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};

    if (auth.session.role === 'admin') {
      // Admins may list every order, optionally filtered by status.
      const status = searchParams.get('status');
      if (status) {
        if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
          return NextResponse.json(
            { error: { code: 'INVALID_STATUS', message: `Invalid status: ${status}` } },
            { status: 400 }
          );
        }
        filter.status = status;
      }
    } else {
      // Customers only see their own orders.
      filter.userEmail = auth.session.email;
    }

    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .select('_id orderNumber status total createdAt items customer promoCode shipping discount subtotal userEmail')
      .lean();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/orders failed:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch orders' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit checkout: 10 requests per 60 seconds per IP
    const rateLimitResponse = applyRateLimit(req, 'create_order', { limit: 10, windowMs: 60_000 });
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json().catch(() => null);
    const validation = validateBody(createOrderSchema, body);
    if (!validation.success) return validation.response;

    const { items: incomingItems, customer, promoCode } = validation.data;

    await dbConnect();

    // 1. Initial product verification and stock availability check
    const verifiedProducts: { product: any; item: typeof incomingItems[0] }[] = [];

    for (const raw of incomingItems) {
      const product = await ProductModel.findOne({ id: raw.productId }).lean();
      if (!product) {
        return NextResponse.json(
          { error: { code: 'PRODUCT_NOT_FOUND', message: `Product not found: ${raw.productId}` } },
          { status: 404 }
        );
      }

      const availableStock = typeof product.stock === 'number' ? product.stock : 25;
      if (availableStock < raw.quantity || product.inStock === false) {
        return NextResponse.json(
          {
            error: {
              code: 'OUT_OF_STOCK',
              message: `Insufficient stock for product "${product.name}". Requested: ${raw.quantity}, Available: ${availableStock}.`,
              details: [
                {
                  field: `items.${raw.productId}`,
                  issue: `Requested quantity (${raw.quantity}) exceeds available stock (${availableStock})`,
                },
              ],
            },
          },
          { status: 422 }
        );
      }

      verifiedProducts.push({ product, item: raw });
    }

    // 2. Concurrency-safe atomic stock decrement with rollback
    const decremented: { productId: string; quantity: number }[] = [];

    for (const { product, item } of verifiedProducts) {
      const updated = await ProductModel.findOneAndUpdate(
        { id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        // Race condition: another request purchased the stock between check and decrement.
        // Roll back previously decremented products
        for (const dec of decremented) {
          await ProductModel.updateOne({ id: dec.productId }, { $inc: { stock: dec.quantity } });
        }

        return NextResponse.json(
          {
            error: {
              code: 'STOCK_CONFLICT',
              message: `Stock for product "${product.name}" changed during checkout. Please review your bag and try again.`,
            },
          },
          { status: 409 }
        );
      }

      // Synchronize inStock boolean flag if stock is exhausted
      if (updated.stock <= 0) {
        await ProductModel.updateOne({ id: item.productId }, { $set: { inStock: false } });
      }

      decremented.push({ productId: item.productId, quantity: item.quantity });
    }

    // 3. Build order items and re-price server-side
    const items: OrderItem[] = verifiedProducts.map(({ product, item }) => ({
      productId: product.id,
      name: product.name,
      image: product.image,
      size: item.size,
      price: product.price,
      quantity: item.quantity,
    }));

    const subtotal = Number(items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2));

    let discount = 0;
    let appliedPromo: string | undefined;
    if (promoCode) {
      const rate = VALID_PROMOS[promoCode.toUpperCase()];
      if (!rate) {
        // If promo is invalid, roll back the stock decrements!
        for (const dec of decremented) {
          await ProductModel.updateOne({ id: dec.productId }, { $inc: { stock: dec.quantity } });
        }
        return NextResponse.json(
          { error: { code: 'INVALID_PROMO', message: `Invalid promo code: ${promoCode}` } },
          { status: 400 }
        );
      }
      discount = Number((subtotal * rate).toFixed(2));
      appliedPromo = promoCode.toUpperCase();
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const total = Number((subtotal - discount + shipping).toFixed(2));

    const session = await getSession();
    const order = await OrderModel.create({
      orderNumber: generateOrderNumber(),
      userEmail: session?.email,
      customer,
      items,
      subtotal,
      discount,
      promoCode: appliedPromo,
      shipping,
      total,
      status: 'pending',
    });

    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        status: order.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders failed:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create order' } },
      { status: 500 }
    );
  }
}
