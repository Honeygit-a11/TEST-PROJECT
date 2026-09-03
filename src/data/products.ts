import productsData from './products.json';

export interface Product {
  id: string;
  index: string; // e.g. "001", "002"
  sku: string;
  name: string;
  color: string; // e.g. "Black", "Brick Red", "Natural"
  category: 'T-SHIRTS' | 'OUTERWEAR' | 'ACCESSORIES' | 'PANTS';
  price: number;
  image: string;
  images: string[];
  description: string;
  tag?: 'NEW' | 'HOT' | 'CORE' | 'LIMITED' | 'LOW STOCK';
  badgeJapanese?: string; // e.g. "男と女"
  season: string;
  details: {
    gsm: string;
    fabric: string;
    fit: string;
    origin: string;
    edition: string;
  };
  sizes: ('S' | 'M' | 'L' | 'XL' | 'ONE SIZE')[];
  inStock: boolean;
  stock?: number;
  featured?: boolean;
}

export const PRODUCTS: Product[] = productsData as Product[];
