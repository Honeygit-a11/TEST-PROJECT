import { z } from 'zod';

const CATEGORIES = ['T-SHIRTS', 'OUTERWEAR', 'ACCESSORIES', 'PANTS'] as const;
const TAGS = ['NEW', 'HOT', 'CORE', 'LIMITED', 'LOW STOCK'] as const;

export const createProductSchema = z.object({
  id: z.string().trim().min(1, 'Product id is required'),
  index: z.string().trim().min(1, 'Product index is required'),
  sku: z.string().trim().min(1, 'SKU is required'),
  name: z.string().trim().min(1, 'Name is required'),
  color: z.string().trim().min(1, 'Color is required'),
  category: z.enum(CATEGORIES, {
    message: `Category must be one of: ${CATEGORIES.join(', ')}`,
  }),
  price: z.number().min(0, 'Price must be 0 or greater'),
  stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative').default(25),
  image: z.string().min(1, 'Primary image is required'),
  images: z.array(z.string()).default([]),
  description: z.string().min(1, 'Description is required'),
  tag: z.enum(TAGS).optional(),
  badgeJapanese: z.string().optional(),
  season: z.string().min(1, 'Season is required'),
  details: z.object({
    gsm: z.string().default(''),
    fabric: z.string().default(''),
    fit: z.string().default(''),
    origin: z.string().default(''),
    edition: z.string().default(''),
  }),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial().omit({ id: true });
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
