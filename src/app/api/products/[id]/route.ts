import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { PRODUCTS } from '@/data/products';
import { validateBody } from '@/lib/validations/validate';
import { updateProductSchema } from '@/lib/validations/product.schema';

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
        return NextResponse.json(
          { error: { code: 'PRODUCT_NOT_FOUND', message: `Product ${params.id} not found` } },
          { status: 404 }
        );
      }
      return NextResponse.json(fallback);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`GET /api/products/${params.id} failed:`, error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch product' } },
      { status: 500 }
    );
  }
}

// Admin-only: partially update a product by its business id with Zod validation.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json().catch(() => null);
    const validation = validateBody(updateProductSchema, body);
    if (!validation.success) return validation.response;

    const updateData = { ...validation.data };

    // Keep the denormalized inStock flag in sync whenever stock is changed.
    if (typeof updateData.stock === 'number') {
      updateData.inStock = updateData.stock > 0;
    }

    await dbConnect();
    const product = await ProductModel.findOneAndUpdate(
      { id: params.id },
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json(
        { error: { code: 'PRODUCT_NOT_FOUND', message: `Product ${params.id} not found` } },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    const err = error as { name?: string; code?: number; message?: string };
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_SKU', message: 'That SKU is already in use by another product' } },
        { status: 409 }
      );
    }
    console.error(`PATCH /api/products/${params.id} failed:`, error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update product' } },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: { code: 'PRODUCT_NOT_FOUND', message: `Product ${params.id} not found` } },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, id: params.id });
  } catch (error) {
    console.error(`DELETE /api/products/${params.id} failed:`, error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete product' } },
      { status: 500 }
    );
  }
}
