import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { PRODUCTS } from '@/data/products';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const product = await ProductModel.findOne({ id: params.id }).lean();

    if (!product) {
      // Fallback to static data when DB has no entry yet
      const fallback = PRODUCTS.find((p) => p.id === params.id);
      if (!fallback) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(fallback);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`GET /api/products/${params.id} failed:`, error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// Admin-only: partially update a product by its business id.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'An update body is required' }, { status: 400 });
    }
    // The business id and Mongo _id are immutable via PATCH.
    delete body.id;
    delete body._id;

    await dbConnect();
    const product = await ProductModel.findOneAndUpdate(
      { id: params.id },
      { $set: body },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    const err = error as { name?: string; code?: number; message?: string };
    if (err?.name === 'ValidationError') {
      return NextResponse.json({ error: err.message ?? 'Invalid product data' }, { status: 400 });
    }
    if (err?.code === 11000) {
      return NextResponse.json({ error: 'That sku is already in use' }, { status: 409 });
    }
    console.error(`PATCH /api/products/${params.id} failed:`, error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Admin-only: delete a product by its business id.
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    await dbConnect();
    const deleted = await ProductModel.findOneAndDelete({ id: params.id }).lean();
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id: params.id });
  } catch (error) {
    console.error(`DELETE /api/products/${params.id} failed:`, error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
