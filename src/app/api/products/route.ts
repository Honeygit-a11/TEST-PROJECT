import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';

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
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await ProductModel.find(filter).sort({ index: 1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products failed:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
