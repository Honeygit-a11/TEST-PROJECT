'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, X, ShoppingBag, Check, Plus, BookOpen, ExternalLink } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/data/products';

interface ArticleItem {
  id: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  category: 'MATERIALS' | 'MANIFESTO' | 'DESIGN SPECS';
  excerpt: string;
  image: string;
  pullQuote: string;
  body: string[];
  productIds: string[];
}

const ARTICLES: ArticleItem[] = [
  {
    id: 'brutalism-garments',
    title: 'THE ARCHITECTURE OF HEAVYWEIGHT COTTON: WHY 300 GSM MATTERS',
    date: 'AUG 12, 2026',
    readTime: '6 MIN READ',
    author: 'MATERIALS DIVISION',
    category: 'MATERIALS',
    excerpt: 'An investigation into fabric density, structural drape, and why light cottons fail to hold form in modern brutalist streetwear silhouettes.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    pullQuote: 'A garment without density collapses into the body. Heavy cotton holds its own structural volume against gravity.',
    body: [
      'In conventional apparel manufacturing, fabrics are engineered for cost minimization and thin drape, typically hovering around 140 to 180 grams per square meter (GSM). At these low densities, a t-shirt clings to the contours of the wearer, surrendering its independence to external posture.',
      'NEO-ARCHIVE rejects this paradigm entirely. By utilizing dense 280 to 300 GSM pre-shrunk organic combed cotton, our t-shirts achieve a freestanding rigidity. The drop-shoulder boxy cut does not merely drape; it sculpts an architectural silhouette reminiscent of raw monolithic concrete slabs.',
      'Furthermore, the heavyweight gauge resists surface degradation, distortion from industrial washing, and edge curl. The structural ribbing around the collar is reinforced with twin-needle stitching to preserve neckline geometry through thousands of wear hours.',
    ],
    productIds: ['nx-001', 'nx-007'],
  },
  {
    id: 'permanent-curation',
    title: 'REJECTING FAST CYCLES: THE PERMANENT ARCHIVE MANIFESTO',
    date: 'JUL 28, 2026',
    readTime: '8 MIN READ',
    author: 'CURATOR 01',
    category: 'MANIFESTO',
    excerpt: 'Why seasonal drops are obsolete and how permanent design tokens guarantee timeless garment longevity.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
    pullQuote: 'We design for preservation, not liquidation. True integrity is the permanent availability of uncompromised work.',
    body: [
      'The modern fashion cycle has devolved into an endless treadmill of false obsolescence. Garments are manufactured with built-in decay, intended to be discarded after four months to justify the arrival of the next arbitrary season.',
      'NEO-ARCHIVE operates on the counter-principle of the Permanent Archive. We do not discount our pieces at the end of a calendar quarter, nor do we purge our warehouse inventory to generate artificial panic.',
      'When an artifact is introduced into Drop #1, it is engineered to be permanently valid. The silhouettes are stripped of fleeting decorative gimmicks in favor of clean mathematical proportion, tactical functionality, and modular utility.',
    ],
    productIds: ['nx-002', 'nx-006'],
  },
  {
    id: 'concrete-spaces',
    title: 'CONCRETE & COTTON: INDUSTRIAL SPACES THAT INSPIRED DROP 01',
    date: 'JUL 14, 2026',
    readTime: '4 MIN READ',
    author: 'ARCHITECTURAL DIVISION',
    category: 'DESIGN SPECS',
    excerpt: 'A photo essay pairing brutalist architecture landmarks across Europe with cut and sew patterns.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    pullQuote: 'Our utility jackets mirror the brutalist facades of Berlin and London: raw, unpolished, and built to withstand environmental decay.',
    body: [
      'The geometric panel cuts across our technical shells directly trace the ventilation shafts and exposed exterior load-bearing beams of London’s Southbank and Berlin’s industrial complexes.',
      'Brutalism celebrates the material as it is: unpainted concrete, visible rebar, and functional seams. In our garments, we translate this philosophy into exposed topstitching, industrial magnetic hardware, and raw-edged Cordura nylon.',
      'Wearers navigate the modern metropolis as urban survivalists. The clothing should serve as an external protective envelope that harmonizes with the pavement, glass, and steel of the modern city.',
    ],
    productIds: ['nx-005', 'nx-004'],
  },
];

export default function JournalPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredArticles =
    selectedCategory === 'ALL'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  const featuredArticle = filteredArticles[0] || ARTICLES[0];
  const secondaryArticles = filteredArticles.slice(1);

  const handleOpenArticle = (article: ArticleItem) => {
    setActiveArticle(article);
    setToastMessage(null);

    // Initial sizes
    const initialSizes: Record<string, string> = {};
    for (const pid of article.productIds) {
      const prod = PRODUCTS.find((p) => p.id === pid);
      if (prod && prod.sizes && prod.sizes.length > 0) {
        initialSizes[prod.id] = prod.sizes[0];
      }
    }
    setSelectedSizes(initialSizes);
  };

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddArtifact = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'M';
    addToCart(product, size);
    setToastMessage(`✓ ${product.name} (${size}) ADDED TO BAG`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const referencedProducts: Product[] = activeArticle
    ? activeArticle.productIds
        .map((pid) => PRODUCTS.find((p) => p.id === pid))
        .filter((p): p is Product => Boolean(p))
    : [];

  return (
    <div className="w-full bg-[#FAF9F5]">
      {/* Header */}
      <div className="p-8 sm:p-12 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // UNDERGROUND PUBLICATION & ESSAYS
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl text-[#1B1C1A]">NEO-ARCHIVE JOURNAL</h1>
          <p className="font-body text-lg text-[#5D4038] mt-2 max-w-xl">
            Critical essays on fabric density, brutalist architectural heritage, and our rejection of disposable fashion cycles.
          </p>
        </div>

        <div className="font-mono text-xs bg-[#1B1C1A] text-white px-4 py-3 border border-[#1B1C1A] font-bold">
          ISSUE 01 // 2026 ARCHIVE
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="border-b border-[#1B1C1A] bg-[#FAF9F5] flex flex-wrap items-stretch font-mono text-xs">
        {['ALL', 'MATERIALS', 'MANIFESTO', 'DESIGN SPECS'].map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3.5 border-r border-[#1B1C1A] font-bold uppercase tracking-wider transition-colors ${
                isSelected
                  ? 'bg-[#FF4500] text-white'
                  : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#EFEEEA]'
              }`}
            >
              {cat === 'ALL' ? 'ALL ESSAYS' : `// ${cat}`}
            </button>
          );
        })}
      </div>

      {/* Main Featured Article */}
      {featuredArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#1B1C1A] bg-[#FAF9F5] items-stretch">
          <div className="lg:col-span-7 relative min-h-[450px] border-b lg:border-b-0 lg:border-r border-[#1B1C1A] bg-[#111211]">
            <Image
              src={featuredArticle.image}
              alt={featuredArticle.title}
              fill
              className="object-cover contrast-125"
            />
            <div className="absolute top-4 left-4 bg-[#FCD400] text-black font-mono text-xs px-3 py-1 border border-[#1B1C1A] font-bold">
              FEATURED ESSAY
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between font-mono text-xs text-[#FF4500] font-bold">
                <span>// {featuredArticle.category}</span>
                <span className="flex items-center gap-1 text-stone-500">
                  <Clock className="w-3 h-3" /> {featuredArticle.readTime}
                </span>
              </div>

              <h2 className="font-headline text-3xl sm:text-4xl text-[#1B1C1A] leading-tight">
                {featuredArticle.title}
              </h2>

              <p className="font-body text-base text-[#5D4038] leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="font-mono text-[11px] text-stone-500 uppercase">
                BY {featuredArticle.author} · {featuredArticle.date}
              </div>
            </div>

            <button
              onClick={() => handleOpenArticle(featuredArticle)}
              className="btn-brutalist-yellow text-sm py-4 px-6 font-headline tracking-wider flex items-center justify-between shadow-[3px_3px_0px_0px_#1B1C1A]"
            >
              <span>READ FULL TECHNICAL ESSAY</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Secondary Articles Grid */}
      {secondaryArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1B1C1A] border-b border-[#1B1C1A]">
          {secondaryArticles.map((article) => (
            <div
              key={article.id}
              className="p-8 bg-[#FAF9F5] flex flex-col justify-between space-y-6 hover:bg-[#F4F4F0] transition-colors"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/9] w-full border border-[#1B1C1A] bg-[#111211] overflow-hidden">
                  <Image src={article.image} alt={article.title} fill className="object-cover" />
                </div>

                <div className="flex justify-between font-mono text-xs text-[#FF4500] font-bold">
                  <span>// {article.category}</span>
                  <span className="text-stone-500">{article.date}</span>
                </div>

                <h3 className="font-headline text-2xl sm:text-3xl text-[#1B1C1A]">
                  {article.title}
                </h3>

                <p className="font-body text-sm text-[#5D4038] leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <button
                onClick={() => handleOpenArticle(article)}
                className="btn-brutalist text-xs py-3.5 px-5 font-headline tracking-wider flex items-center justify-between"
              >
                <span>READ ESSAY ({article.readTime})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Full-Essay Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full border-2 border-[#1B1C1A] bg-[#FAF9F5] shadow-[8px_8px_0px_0px_#1B1C1A] my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 p-6 border-b border-[#1B1C1A] bg-[#EFEEEA] flex justify-between items-start">
              <div>
                <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
                  // {activeArticle.category} · {activeArticle.readTime}
                </span>
                <h2 className="font-headline text-2xl sm:text-3xl text-[#1B1C1A] mt-1">
                  {activeArticle.title}
                </h2>
                <div className="font-mono text-[11px] text-stone-500 mt-1">
                  BY {activeArticle.author} · PUBLISHED {activeArticle.date}
                </div>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 border border-[#1B1C1A] bg-[#FAF9F5] hover:bg-[#FF4500] hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Toast */}
            {toastMessage && (
              <div className="mx-6 p-3 bg-emerald-100 border border-emerald-600 text-emerald-800 font-mono text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{toastMessage}</span>
                </div>
                <Link href="/bag" className="underline hover:text-black">
                  VIEW BAG →
                </Link>
              </div>
            )}

            {/* Editorial Image & Text */}
            <div className="px-6 space-y-6">
              <div className="relative w-full h-[300px] border border-[#1B1C1A] bg-[#111211] overflow-hidden">
                <Image
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Pull Quote */}
              <div className="p-6 border-l-4 border-[#FF4500] bg-[#EFEEEA] font-headline text-xl sm:text-2xl text-[#1B1C1A] italic leading-snug">
                &ldquo;{activeArticle.pullQuote}&rdquo;
              </div>

              {/* Essay Body Paragraphs */}
              <div className="space-y-4 font-body text-base text-[#1B1C1A] leading-relaxed">
                {activeArticle.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Referenced Artifacts Section */}
            {referencedProducts.length > 0 && (
              <div className="p-6 border-t border-[#1B1C1A] bg-[#EFEEEA] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
                    // ARTIFACTS REFERENCED IN THIS ESSAY ({referencedProducts.length})
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">AUTHENTIC DESIGN TOKENS</span>
                </div>

                <div className="space-y-3">
                  {referencedProducts.map((product) => {
                    const currentSize = selectedSizes[product.id] || product.sizes[0] || 'M';

                    return (
                      <div
                        key={product.id}
                        className="p-4 border border-[#1B1C1A] bg-[#FAF9F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative w-16 h-16 border border-[#1B1C1A] bg-[#111211] flex-shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-mono text-[10px] text-[#FF4500] font-bold uppercase">
                              {product.sku} // {product.color}
                            </div>
                            <h4 className="font-headline text-lg text-[#1B1C1A] truncate">{product.name}</h4>
                            <div className="font-headline text-base text-[#1B1C1A]">${product.price.toFixed(2)}</div>
                          </div>
                        </div>

                        {/* Size Picker & Add Button */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          {product.sizes && product.sizes.length > 1 && (
                            <div className="flex items-center gap-1 font-mono text-xs">
                              {product.sizes.map((sz) => (
                                <button
                                  key={sz}
                                  onClick={() => handleSelectSize(product.id, sz)}
                                  className={`px-2 py-1 border border-[#1B1C1A] font-bold text-[10px] transition-colors ${
                                    currentSize === sz
                                      ? 'bg-[#1B1C1A] text-white'
                                      : 'bg-[#EFEEEA] text-[#1B1C1A] hover:bg-stone-200'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => handleAddArtifact(product)}
                            className="btn-brutalist-yellow text-xs py-2 px-3.5 font-headline tracking-wider flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ADD TO BAG</span>
                          </button>

                          <Link
                            href={`/product/${product.id}`}
                            className="p-2 border border-[#1B1C1A] bg-[#EFEEEA] hover:bg-black hover:text-white transition-colors"
                            title="View Full Product Specs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#1B1C1A] bg-[#FAF9F5] flex justify-between items-center">
              <span className="font-mono text-xs text-stone-500">
                END OF PUBLICATION // VOL. 001
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="font-headline text-xs px-5 py-2.5 border border-[#1B1C1A] bg-[#EFEEEA] hover:bg-black hover:text-white transition-colors"
              >
                CLOSE ESSAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
