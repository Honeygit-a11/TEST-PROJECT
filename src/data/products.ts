export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'T-SHIRTS' | 'OUTERWEAR' | 'ACCESSORIES' | 'PANTS';
  price: number;
  image: string;
  images: string[];
  description: string;
  tag?: 'NEW' | 'LOW STOCK' | 'CORE' | 'LIMITED';
  season: string;
  details: {
    gsm: string;
    fabric: string;
    fit: string;
    origin: string;
    edition: string;
  };
  sizes: ('S' | 'M' | 'L' | 'XL')[];
  inStock: boolean;
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'nx-001',
    sku: 'SKU: NX-001',
    name: 'TACTICAL SHELL JACKET',
    category: 'OUTERWEAR',
    price: 450,
    tag: 'NEW',
    season: 'SS24',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Exploring the intersection of raw utility and refined tailoring. High-density water-resistant technical shell built with 6 modular utility pockets and magnetic Cobra buckles.',
    details: {
      gsm: '380 GSM Technical Cordura',
      fabric: '100% Water-Resistant Ripstop Nylon',
      fit: 'Relaxed Tactical Fit',
      origin: 'Made in Germany',
      edition: 'SS24 Tactical Collection'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true
  },
  {
    id: 'nx-042',
    sku: 'SKU: NX-042',
    name: 'WIDE-LEG CARGO PANT',
    category: 'PANTS',
    price: 280,
    tag: 'NEW',
    season: 'SS24',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Heavyweight articulated cargo pants featuring 3D expandable bellows pockets, ankle drawstring cinches, and reinforced knee paneling.',
    details: {
      gsm: '320 GSM Cotton Twill',
      fabric: '100% Heavy Organic Twill',
      fit: 'Wide Articulated Cut',
      origin: 'Made in Portugal',
      edition: 'SS24 Core Bottoms'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true
  },
  {
    id: 'nx-118',
    sku: 'SKU: NX-118',
    name: 'MESH COMBAT LAYER',
    category: 'T-SHIRTS',
    price: 120,
    tag: 'LOW STOCK',
    season: 'CORE',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Breathable dual-layer mesh top with exposed structural seams, thumbhole cuffs, and rubberized silicone logo chest badge.',
    details: {
      gsm: '240 GSM Technical Mesh',
      fabric: '85% Poly / 15% Elastane',
      fit: 'Athletic Layering Fit',
      origin: 'Made in Japan',
      edition: 'Core Tactical Drop'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true
  },
  {
    id: 'nx-880',
    sku: 'SKU: NX-880',
    name: 'INDUSTRIAL HARNESS BAG',
    category: 'ACCESSORIES',
    price: 350,
    tag: 'NEW',
    season: 'SS24',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Modular chest harness bag made from 1050D ballistic nylon canvas with quick-release tactical buckles and weatherproof YKK zippers.',
    details: {
      gsm: '1050D Ballistic Nylon',
      fabric: 'Heavy Technical Cordura',
      fit: 'One Size / Fully Adjustable',
      origin: 'Made in Germany',
      edition: 'SS24 Hardware Series'
    },
    sizes: ['M'],
    inStock: true,
    featured: true
  },
  {
    id: 'ts-001',
    sku: 'SKU: TS-001',
    name: 'STRUCTURAL TEE',
    category: 'T-SHIRTS',
    price: 85,
    tag: 'CORE',
    season: 'SS24',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Ultra-heavyweight 300 GSM organic cotton drop-shoulder silhouette built with exposed raw coverstitch seams and structured collar.',
    details: {
      gsm: '300 GSM Organic Cotton',
      fabric: '100% Combed Cotton',
      fit: 'Boxy Drop-Shoulder',
      origin: 'Made in Portugal',
      edition: 'Core Basics'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false
  },
  {
    id: 'hd-042',
    sku: 'SKU: HD-042',
    name: 'ASYMMETRIC HOODIE',
    category: 'OUTERWEAR',
    price: 190,
    tag: 'NEW',
    season: 'SS24',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Double-walled 500 GSM French Terry hoodie with offset diagonal heavy-duty zipper and crossover hood.',
    details: {
      gsm: '500 GSM Heavy Loopback Fleece',
      fabric: '100% Cotton',
      fit: 'Asymmetric Fit',
      origin: 'Made in Japan',
      edition: 'SS24 Fleece'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false
  },
  {
    id: 'ts-009',
    sku: 'SKU: TS-009',
    name: 'OVERSIZED GRAPHIC TEE',
    category: 'T-SHIRTS',
    price: 95,
    tag: 'CORE',
    season: 'SS24',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'High-density rubberized screenprint on vintage-washed 280 GSM cotton with serialized cuff tag.',
    details: {
      gsm: '280 GSM Vintage Cotton',
      fabric: '100% Pre-shrunk Cotton',
      fit: 'Oversized Fit',
      origin: 'Printed in Germany',
      edition: 'Graphic Series 01'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false
  },
  {
    id: 'ac-012',
    sku: 'SKU: AC-012',
    name: 'BRUTALIST BEANIE',
    category: 'ACCESSORIES',
    price: 55,
    tag: 'LIMITED',
    season: 'CORE',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Heavy gauge ribbed merino wool beanie featuring woven white-on-black industrial barcode label.',
    details: {
      gsm: 'Heavy Rib Knit',
      fabric: '100% Merino Wool',
      fit: 'One Size',
      origin: 'Made in Italy',
      edition: 'Core Accessories'
    },
    sizes: ['M'],
    inStock: true,
    featured: false
  }
];
