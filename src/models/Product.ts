import { Schema, model, models } from 'mongoose';

export interface ProductDoc {
  id: string;
  index: string;
  sku: string;
  name: string;
  color: string;
  category: 'T-SHIRTS' | 'OUTERWEAR' | 'ACCESSORIES' | 'PANTS';
  price: number;
  image: string;
  images: string[];
  description: string;
  tag?: 'NEW' | 'HOT' | 'CORE' | 'LIMITED' | 'LOW STOCK';
  badgeJapanese?: string;
  season: string;
  details: {
    gsm: string;
    fabric: string;
    fit: string;
    origin: string;
    edition: string;
  };
  sizes: string[];
  inStock: boolean;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDoc>(
  {
    id: { type: String, required: true, unique: true },
    index: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    category: {
      type: String,
      enum: ['T-SHIRTS', 'OUTERWEAR', 'ACCESSORIES', 'PANTS'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    images: { type: [String], required: true },
    description: { type: String, required: true },
    tag: { type: String, enum: ['NEW', 'HOT', 'CORE', 'LIMITED', 'LOW STOCK'] },
    badgeJapanese: { type: String },
    season: { type: String, required: true },
    details: {
      gsm: { type: String, required: true },
      fabric: { type: String, required: true },
      fit: { type: String, required: true },
      origin: { type: String, required: true },
      edition: { type: String, required: true },
    },
    sizes: { type: [String], required: true },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'products' }
);

export const ProductModel = models.Product || model('Product', productSchema);
