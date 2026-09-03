import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const filter: Record<string, unknown> = {};
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('q');

    if (category) filter.category = category.toUpperCase();
    if (featured === 'true') filter.featured = true;
    if (search) {
      // Search across the fields the header search box exposes (name, sku, color)
      const rx = { $regex: search, $options: 'i' };
      filter.$or = [{ name: rx }, { sku: rx }, { color: rx }];
    }

    const products = await ProductModel.find(filter).sort({ index: 1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products failed:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Admin-only: create a product. Field-level validation is enforced by the Mongoose schema.
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'A product body is required' }, { status: 400 });
    }

    await dbConnect();

    // Pre-check uniqueness so the client gets a clear 409 rather than a raw duplicate-key error.
    const or: Record<string, unknown>[] = [];
    if (typeof body.id === 'string') or.push({ id: body.id });
    if (typeof body.sku === 'string') or.push({ sku: body.sku });
    if (or.length) {
      const clash = await ProductModel.findOne({ $or: or }).lean();
      if (clash) {
        return NextResponse.json({ error: 'A product with this id or sku already exists' }, { status: 409 });
      }
    }

    const product = await ProductModel.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const err = error as { name?: string; code?: number; message?: string };
    if (err?.name === 'ValidationError') {
      return NextResponse.json({ error: err.message ?? 'Invalid product data' }, { status: 400 });
    }
    if (err?.code === 11000) {
      return NextResponse.json({ error: 'A product with this id or sku already exists' }, { status: 409 });
    }
    console.error('POST /api/products failed:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
