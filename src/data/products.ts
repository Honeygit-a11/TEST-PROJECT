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
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'nx-001',
    index: '001',
    sku: 'SKU: NX-001',
    name: 'OVERSIZED FACE TEE',
    color: 'Black',
    category: 'T-SHIRTS',
    price: 48.00,
    tag: 'NEW',
    badgeJapanese: '男と女',
    season: 'VOL. 001',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Heavyweight oversized graphic tee with high-density dripping demon visage screenprint on vintage-washed 280 GSM combed cotton. Reinforced ribbed collar and raw double-needle hems.',
    details: {
      gsm: '280 GSM Heavy Combed Cotton',
      fabric: '100% Pre-Shrunk Organic Cotton',
      fit: 'Boxy Drop-Shoulder Oversized',
      origin: 'Made in Portugal',
      edition: 'Drop #1 / Vol. 001 Archive'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true
  },
  {
    id: 'nx-002',
    index: '002',
    sku: 'SKU: NX-002',
    name: 'STENCIL HEAVY HOODIE',
    color: 'Brick Red',
    category: 'OUTERWEAR',
    price: 85.00,
    tag: 'HOT',
    badgeJapanese: '男と女',
    season: 'VOL. 001',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Custom-dyed 500 GSM loopback French Terry fleece hoodie featuring cracked barbed-wire chest stencil graphic, structured crossover double-layer hood, and oversized pouch pocket.',
    details: {
      gsm: '500 GSM Loopback French Terry',
      fabric: '100% Heavyweight Cotton Fleece',
      fit: 'Relaxed Brutalist Silhouette',
      origin: 'Made in Japan',
      edition: 'Drop #1 / Vol. 001 Archive'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true
  },
  {
    id: 'nx-003',
    index: '003',
    sku: 'SKU: NX-003',
    name: 'MURAL TAG SNAPBACK',
    color: 'Black',
    category: 'ACCESSORIES',
    price: 38.00,
    tag: 'CORE',
    badgeJapanese: '限定',
    season: 'VOL. 001',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop'
    ],
    description: '6-panel structured flat-brim snapback constructed from heavy wool blend canvas with high-relief 3D gothic mural embroidery and tonal side branding.',
    details: {
      gsm: 'Heavy Gauge Wool/Cotton Blend',
      fabric: '80% Wool / 20% Acrylic Twill',
      fit: 'Structured Flat Brim / Adjustable',
      origin: 'Made in Germany',
      edition: 'Hardware Series 01'
    },
    sizes: ['ONE SIZE'],
    inStock: true,
    featured: true
  },
  {
    id: 'nx-004',
    index: '004',
    sku: 'SKU: NX-004',
    name: 'ABSTRACT CANVAS TOTE',
    color: 'Natural',
    category: 'ACCESSORIES',
    price: 28.00,
    tag: 'HOT',
    badgeJapanese: '男と女',
    season: 'VOL. 001',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Ultra-durable 16oz unbleached raw organic duck canvas tote with vibrant multi-color bubble graffiti lettering screenprint and reinforced cross-stitched handles.',
    details: {
      gsm: '16oz (480 GSM) Heavy Duck Canvas',
      fabric: '100% Raw Unbleached Cotton',
      fit: 'Spacious Gusseted Construction',
      origin: 'Made in USA',
      edition: 'Graffiti Drop 01'
    },
    sizes: ['ONE SIZE'],
    inStock: true,
    featured: true
  },
  {
    id: 'nx-005',
    index: '005',
    sku: 'SKU: NX-005',
    name: 'TACTICAL SHELL JACKET',
    color: 'Obsidian Black',
    category: 'OUTERWEAR',
    price: 150.00,
    tag: 'NEW',
    badgeJapanese: '耐水',
    season: 'VOL. 001',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'High-density water-resistant technical shell built with 6 modular utility pockets, weatherproof sealed seams, and industrial magnetic Cobra buckles.',
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
    id: 'nx-006',
    index: '006',
    sku: 'SKU: NX-006',
    name: 'WIDE-LEG CARGO PANT',
    color: 'Washed Olive',
    category: 'PANTS',
    price: 92.00,
    tag: 'NEW',
    badgeJapanese: '新作',
    season: 'VOL. 001',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Heavyweight articulated cargo pants featuring 3D expandable bellows pockets, ankle drawstring cinches, and reinforced knee paneling for brutalist streetwear aesthetics.',
    details: {
      gsm: '320 GSM Cotton Twill',
      fabric: '100% Heavy Organic Twill',
      fit: 'Wide Articulated Cut',
      origin: 'Made in Portugal',
      edition: 'Core Bottoms Drop'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: true
  },
  {
    id: 'nx-007',
    index: '007',
    sku: 'SKU: NX-007',
    name: 'STRUCTURAL MONO TEE',
    color: 'Bone White',
    category: 'T-SHIRTS',
    price: 45.00,
    tag: 'CORE',
    badgeJapanese: '定番',
    season: 'VOL. 001',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Ultra-heavyweight 300 GSM organic combed cotton boxy tee with subtle silicone chest typography and raw edge hem detail.',
    details: {
      gsm: '300 GSM Combed Cotton',
      fabric: '100% Organic Cotton',
      fit: 'Boxy Drop-Shoulder',
      origin: 'Made in Portugal',
      edition: 'Core Basics'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false
  },
  {
    id: 'nx-008',
    index: '008',
    sku: 'SKU: NX-008',
    name: 'BRUTALIST BEANIE',
    color: 'Matte Charcoal',
    category: 'ACCESSORIES',
    price: 32.00,
    tag: 'LIMITED',
    badgeJapanese: '限定',
    season: 'VOL. 001',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop'
    ],
    description: 'Heavy gauge ribbed merino wool beanie featuring woven white-on-black industrial barcode label and folded turn-up brim.',
    details: {
      gsm: 'Heavy Rib Knit',
      fabric: '100% Merino Wool',
      fit: 'One Size Deep Fit',
      origin: 'Made in Italy',
      edition: 'Core Accessories'
    },
    sizes: ['ONE SIZE'],
    inStock: true,
    featured: false
  }
];
