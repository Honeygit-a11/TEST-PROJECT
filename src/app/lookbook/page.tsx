'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ShoppingBag, X, Check, Plus, Loader2, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/data/products';

interface LookbookCapsule {
  id: number;
  location: string;
  season: string;
  garmentSubtitle: string;
  image: string;
  span: string;
  productIds: string[];
}

const LOOKBOOK_CAPSULES: LookbookCapsule[] = [
  {
    id: 1,
    location: 'BERLIN // INDUSTRIAL SITE B',
    season: 'VOL. 001 // DROP 01',
    garmentSubtitle: 'OVERSIZED FACE TEE + WIDE-LEG CARGO PANT',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-8',
    productIds: ['nx-001', 'nx-006'],
  },
  {
    id: 2,
    location: 'TOKYO // SHIBUYA OVERPASS',
    season: 'VOL. 001 // DROP 01',
    garmentSubtitle: 'STENCIL HEAVY HOODIE + MURAL TAG SNAPBACK',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-4',
    productIds: ['nx-002', 'nx-003'],
  },
  {
    id: 3,
    location: 'LONDON // SOUTHBANK BRUTALIST COMPLEX',
    season: 'VOL. 001 // DROP 01',
    garmentSubtitle: 'TACTICAL SHELL JACKET + ABSTRACT CANVAS TOTE',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-4',
    productIds: ['nx-005', 'nx-004'],
  },
  {
    id: 4,
    location: 'PARIS // CONCRETE PLAZA',
    season: 'VOL. 001 // DROP 01',
    garmentSubtitle: 'STRUCTURAL MONO TEE + WIDE-LEG CARGO PANT',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-8',
    productIds: ['nx-007', 'nx-006'],
  },
];

export default function LookbookPage() {
  const { addToCart } = useCart();
  const [activeCapsule, setActiveCapsule] = useState<LookbookCapsule | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedSuccess, setAddedSuccess] = useState<string | null>(null);

  // Retrieve products for the active lookbook capsule
  const capsuleProducts: Product[] = activeCapsule
    ? activeCapsule.productIds
        .map((pid) => PRODUCTS.find((p) => p.id === pid))
        .filter((p): p is Product => Boolean(p))
    : [];

  const handleOpenCapsule = (capsule: LookbookCapsule) => {
    setActiveCapsule(capsule);
    setAddedSuccess(null);

    // Default sizes for products in this capsule
    const initialSizes: Record<string, string> = {};
    for (const pid of capsule.productIds) {
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

  const handleAddSingleItem = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'M';
    addToCart(product, size);
    setAddedSuccess(`✓ ${product.name} (${size}) ADDED TO BAG`);
    setTimeout(() => setAddedSuccess(null), 3000);
  };

  const handleAddEntireCapsule = () => {
    for (const prod of capsuleProducts) {
      const size = selectedSizes[prod.id] || prod.sizes[0] || 'M';
      addToCart(prod, size);
    }
    setAddedSuccess(`✓ FULL CAPSULE LOOK (${capsuleProducts.length} ITEMS) ADDED TO BAG!`);
    setTimeout(() => setAddedSuccess(null), 4000);
  };

  const totalCapsulePrice = capsuleProducts.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="w-full bg-[#FAF9F5]">
      {/* Header */}
      <div className="p-8 sm:p-12 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // VISUAL DOCUMENTATION & EDITORIAL
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl text-[#1B1C1A]">LOOKBOOK 2026</h1>
          <p className="font-body text-lg sm:text-xl text-[#5D4038] mt-2 max-w-2xl">
            &ldquo;THE STREET IS OUR CANVAS&rdquo; — FILMED ON LOCATION ACROSS BRUTALIST ARCHITECTURAL SITES. CLICK ANY LOOK TO SHOP THE CAPSULE OUTFIT.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="font-headline text-xs py-3.5 px-6 border border-[#1B1C1A] bg-[#FAF9F5] hover:bg-black hover:text-white transition-colors tracking-wider"
          >
            CATALOGUE
          </Link>
          <div className="font-mono text-xs bg-[#FCD400] text-[#1B1C1A] px-4 py-3.5 border border-[#1B1C1A] font-bold">
            DROP 01 // VOL. 001
          </div>
        </div>
      </div>

      {/* Editorial Masonry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#1B1C1A] divide-y lg:divide-y-0 divide-[#1B1C1A]">
        {LOOKBOOK_CAPSULES.map((entry) => (
          <div
            key={entry.id}
            className={`${entry.span} border-r-0 lg:border-r border-b lg:border-b-0 border-[#1B1C1A] group relative overflow-hidden flex flex-col justify-between`}
          >
            {/* Top Telemetry Overlay */}
            <div className="p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white w-full">
              <div>
                <span className="font-mono text-xs text-[#FCD400] tracking-widest block font-bold">
                  {entry.location}
                </span>
                <span className="font-mono text-[10px] text-stone-300 block">
                  {entry.season}
                </span>
                <h3 className="font-headline text-xl sm:text-2xl mt-1 tracking-wider text-white">
                  {entry.garmentSubtitle}
                </h3>
              </div>
              <button
                onClick={() => handleOpenCapsule(entry)}
                className="w-10 h-10 border border-white bg-black/60 hover:bg-[#FF4500] hover:border-[#FF4500] text-white flex items-center justify-center transition-colors flex-shrink-0"
                title="Shop This Look"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] bg-[#111211] overflow-hidden">
              <Image
                src={entry.image}
                alt={entry.garmentSubtitle}
                fill
                className="object-cover object-center grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Bottom Interactive Bar */}
            <div className="p-4 sm:p-6 bg-[#EFEEEA] border-t border-[#1B1C1A] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="font-mono text-xs text-stone-600 font-bold">
                LOOK 0{entry.id} // {entry.productIds.length} ARCHIVE ARTIFACTS
              </span>
              <button
                onClick={() => handleOpenCapsule(entry)}
                className="btn-brutalist-yellow text-xs py-2.5 px-5 font-headline tracking-wider flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>SHOP THIS CAPSULE LOOK</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive "Shop the Capsule Look" Slide-Out Drawer / Modal */}
      {activeCapsule && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full border-2 border-[#1B1C1A] bg-[#FAF9F5] shadow-[8px_8px_0px_0px_#1B1C1A] my-8 space-y-6">
            {/* Modal Top Bar */}
            <div className="p-6 border-b border-[#1B1C1A] bg-[#EFEEEA] flex justify-between items-start">
              <div>
                <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
                  // EDITORIAL CAPSULE {activeCapsule.location}
                </span>
                <h2 className="font-headline text-3xl sm:text-4xl text-[#1B1C1A] mt-1">
                  SHOP THE ARCHIVE LOOK
                </h2>
                <div className="font-mono text-xs text-stone-600 mt-1">
                  {activeCapsule.garmentSubtitle}
                </div>
              </div>

              <button
                onClick={() => setActiveCapsule(null)}
                className="p-2 border border-[#1B1C1A] bg-[#FAF9F5] hover:bg-[#FF4500] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Toast */}
            {addedSuccess && (
              <div className="mx-6 p-3 bg-emerald-100 border border-emerald-600 text-emerald-800 font-mono text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{addedSuccess}</span>
                </div>
                <Link href="/bag" className="underline hover:text-black">
                  VIEW BAG →
                </Link>
              </div>
            )}

            {/* Products in this Capsule Look */}
            <div className="px-6 space-y-4 max-h-[50vh] overflow-y-auto">
              {capsuleProducts.map((product) => {
                const currentSize = selectedSizes[product.id] || product.sizes[0] || 'M';

                return (
                  <div
                    key={product.id}
                    className="p-4 border border-[#1B1C1A] bg-[#EFEEEA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-20 h-20 border border-[#1B1C1A] bg-[#111211] flex-shrink-0 overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] text-[#FF4500] font-bold uppercase">
                          {product.sku} // {product.color}
                        </div>
                        <h4 className="font-headline text-xl text-[#1B1C1A] truncate">{product.name}</h4>
                        <div className="font-headline text-lg text-[#1B1C1A]">${product.price.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Size Selector + Individual Add */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end">
                      {product.sizes && product.sizes.length > 1 && (
                        <div className="flex items-center gap-1 font-mono text-xs">
                          {product.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSelectSize(product.id, sz)}
                              className={`px-2.5 py-1.5 border border-[#1B1C1A] font-bold text-[11px] transition-colors ${
                                currentSize === sz
                                  ? 'bg-[#1B1C1A] text-white'
                                  : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-stone-200'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => handleAddSingleItem(product)}
                        className="font-headline text-xs py-2 px-4 border border-[#1B1C1A] bg-[#FAF9F5] hover:bg-[#FF4500] hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD ITEM</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-6 border-t border-[#1B1C1A] bg-[#EFEEEA] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="font-mono text-xs text-center sm:text-left">
                <span className="text-stone-500 uppercase block">TOTAL CAPSULE VALUE:</span>
                <span className="font-headline text-2xl text-[#1B1C1A]">
                  ${totalCapsulePrice.toFixed(2)}
                </span>
                <span className="text-stone-500 text-[10px] ml-2">({capsuleProducts.length} PIECES)</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveCapsule(null)}
                  className="font-headline text-xs px-5 py-3.5 border border-[#1B1C1A] bg-[#FAF9F5] hover:bg-black hover:text-white transition-colors"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleAddEntireCapsule}
                  className="btn-brutalist-yellow text-xs px-6 py-3.5 font-headline tracking-wider flex items-center justify-center gap-2 flex-1 sm:flex-none shadow-[3px_3px_0px_0px_#1B1C1A]"
                >
                  <Sparkles className="w-4 h-4 text-[#FF4500]" />
                  <span>ADD FULL LOOK TO BAG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
