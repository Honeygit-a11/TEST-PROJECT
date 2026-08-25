import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
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
