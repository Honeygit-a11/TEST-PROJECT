import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { OrderModel, OrderItem } from '@/models/Order';
import { ProductModel } from '@/models/Product';
import { getSession } from '@/lib/auth';

interface IncomingItem {
  productId?: unknown;
  size?: unknown;
  quantity?: unknown;
}

const SHIPPING_FLAT = 8.0;
const FREE_SHIPPING_THRESHOLD = 120.0;
const VALID_PROMOS: Record<string, number> = { ARCHIVE10: 0.1, NEO2026: 0.1 };

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NX-${stamp}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => null);
    const incomingItems: IncomingItem[] | undefined = body?.items;
    const customer = body?.customer;

    if (!Array.isArray(incomingItems) || incomingItems.length === 0) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 });
    }
    if (
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.postalCode ||
      !customer.country
    ) {
      return NextResponse.json(
        { error: 'customer must include name, email, address, city, postalCode, country' },
        { status: 400 }
      );
    }

    // Re-price every line server-side so totals cannot be tampered with
    const items: OrderItem[] = [];
    for (const raw of incomingItems) {
      const { productId, size, quantity } = raw;
      if (
        typeof productId !== 'string' ||
        typeof size !== 'string' ||
        typeof quantity !== 'number' ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return NextResponse.json(
          { error: 'each item needs productId (string), size (string), quantity (int >= 1)' },
          { status: 400 }
        );
      }

      const product = await ProductModel.findOne({ id: productId }).lean();
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 404 });
      }

      items.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        size,
        price: product.price,
        quantity,
      });
    }

    const subtotal = Number(items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2));

    let discount = 0;
    let appliedPromo: string | undefined;
    if (typeof body?.promoCode === 'string' && body.promoCode.trim()) {
      const rate = VALID_PROMOS[body.promoCode.trim().toUpperCase()];
      if (!rate) {
        return NextResponse.json({ error: `Invalid promo code: ${body.promoCode}` }, { status: 400 });
      }
      discount = Number((subtotal * rate).toFixed(2));
      appliedPromo = body.promoCode.trim().toUpperCase();
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
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
