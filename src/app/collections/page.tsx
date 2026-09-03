'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, X, Check, Plus, Sparkles, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/data/products';

interface CollectionItem {
  id: string;
  title: string;
  season: string;
  itemsCount: number;
  description: string;
  image: string;
  color: string;
  productIds: string[];
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: 'archive-v1',
    title: 'ARCHIVE V1 // SYSTEM CORE',
    season: 'SPRING/SUMMER 2026',
    itemsCount: 3,
    description: 'Our foundational release centered on raw cotton weights, geometric panel cuts, and high-density monochrome prints.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-[#FCD400] text-[#1B1C1A]',
    productIds: ['nx-001', 'nx-006', 'nx-007'],
  },
  {
    id: 'system-02',
    title: 'SYSTEM-02 // TECHNICAL RIPSTOP',
    season: 'AUTUMN/WINTER 2026',
    itemsCount: 2,
    description: 'Modular outer shells built with Cordura fabrics, tactical Cobra buckles, and weather-resistant sealed seams.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-[#FF4500] text-white',
    productIds: ['nx-005', 'nx-004'],
  },
  {
    id: 'brutal-line',
    title: 'BRUTAL-LINE // HEAVY FLEECE',
    season: 'PERMANENT CURATION',
    itemsCount: 2,
    description: '500 GSM loopback French terry sweats engineered for maximum drop-shoulder drape and structural stability.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-[#1B1C1A] text-white',
    productIds: ['nx-002', 'nx-003'],
  },
];

export default function CollectionsPage() {
  const { addToCart } = useCart();
  const [activeCollection, setActiveCollection] = useState<CollectionItem | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedSuccess, setAddedSuccess] = useState<string | null>(null);

  const collectionProducts: Product[] = activeCollection
    ? activeCollection.productIds
        .map((pid) => PRODUCTS.find((p) => p.id === pid))
        .filter((p): p is Product => Boolean(p))
    : [];

  const handleOpenCollection = (col: CollectionItem) => {
    setActiveCollection(col);
    setAddedSuccess(null);

    const initialSizes: Record<string, string> = {};
    for (const pid of col.productIds) {
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
    for (const prod of collectionProducts) {
      const size = selectedSizes[prod.id] || prod.sizes[0] || 'M';
      addToCart(prod, size);
    }
    setAddedSuccess(`✓ ALL ${collectionProducts.length} CAPSULE ARTIFACTS ADDED TO BAG!`);
    setTimeout(() => setAddedSuccess(null), 4000);
  };

  const totalCapsuleValue = collectionProducts.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="w-full bg-[#FAF9F5]">
      {/* Banner */}
      <div className="p-8 sm:p-12 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // CAPSULE CATALOGUE & RELEASES
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl text-[#1B1C1A]">COLLECTIONS OVERVIEW</h1>
          <p className="font-body text-lg text-[#5D4038] mt-2 max-w-xl">
            Explore curated design capsules engineered for utility, raw form, and timeless underground brutalism.
          </p>
        </div>
        <div className="font-mono text-xs bg-[#1B1C1A] text-white px-4 py-3 border border-[#1B1C1A] font-bold">
          {COLLECTIONS.length} ACTIVE CAPSULES
        </div>
      </div>

      {/* Collection Cards List */}
      <div className="divide-y divide-[#1B1C1A]">
        {COLLECTIONS.map((col, idx) => (
          <div
            key={col.id}
            className="grid grid-cols-1 lg:grid-cols-12 min-h-[55vh] bg-[#FAF9F5] items-stretch"
          >
            {/* Image (Alternating Left/Right) */}
            <div
              className={`lg:col-span-6 relative aspect-[16/9] lg:aspect-auto border-b lg:border-b-0 ${
                idx % 2 === 0
                  ? 'lg:border-r border-[#1B1C1A] lg:order-1'
                  : 'lg:border-l border-[#1B1C1A] lg:order-2'
              }`}
            >
              <Image src={col.image} alt={col.title} fill className="object-cover" />
              <div className="absolute top-4 left-4 font-mono text-xs bg-black text-white px-3 py-1 border border-white/20 font-bold">
                CAPSULE 0{idx + 1}
              </div>
            </div>

            {/* Content */}
            <div
              className={`lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6 ${
                idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[#FF4500] font-bold">// {col.season}</span>
                  <span className="text-stone-500 font-bold uppercase">{col.itemsCount} PIECES INCLUDED</span>
                </div>

                <h2 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A] leading-tight">
                  {col.title}
                </h2>

                <p className="font-body text-base sm:text-lg text-[#5D4038] leading-relaxed max-w-xl">
                  {col.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1B1C1A]">
                <button
                  onClick={() => handleOpenCollection(col)}
                  className="btn-brutalist-yellow text-xs py-4 px-6 font-headline tracking-wider flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>EXPLORE CAPSULE ({col.itemsCount} ITEMS)</span>
                </button>

                <Link
                  href={`/shop?collection=${col.id}`}
                  className="font-headline text-xs py-4 px-6 border border-[#1B1C1A] bg-[#EFEEEA] hover:bg-black hover:text-white transition-colors tracking-wider inline-flex items-center gap-2"
                >
                  <span>VIEW IN CATALOGUE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Capsule Showcase Modal / Drawer */}
      {activeCollection && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full border-2 border-[#1B1C1A] bg-[#FAF9F5] shadow-[8px_8px_0px_0px_#1B1C1A] my-8 space-y-6">
            {/* Modal Top Bar */}
            <div className="p-6 border-b border-[#1B1C1A] bg-[#EFEEEA] flex justify-between items-start">
              <div>
                <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
                  // CAPSULE RELEASE {activeCollection.season}
                </span>
                <h2 className="font-headline text-3xl sm:text-4xl text-[#1B1C1A] mt-1">
                  {activeCollection.title}
                </h2>
                <div className="font-mono text-xs text-stone-600 mt-1 max-w-md">
                  {activeCollection.description}
                </div>
              </div>

              <button
                onClick={() => setActiveCollection(null)}
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

            {/* Products in this Capsule */}
            <div className="px-6 space-y-4 max-h-[50vh] overflow-y-auto">
              {collectionProducts.map((product) => {
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

                    {/* Sizing & Add Button */}
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
                  ${totalCapsuleValue.toFixed(2)}
                </span>
                <span className="text-stone-500 text-[10px] ml-2">
                  ({collectionProducts.length} PIECES)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  href={`/shop?collection=${activeCollection.id}`}
                  className="font-headline text-xs py-3.5 px-5 border border-[#1B1C1A] bg-[#FAF9F5] hover:bg-black hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>OPEN IN CATALOGUE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={handleAddEntireCapsule}
                  className="btn-brutalist-yellow text-xs px-6 py-3.5 font-headline tracking-wider flex items-center justify-center gap-2 flex-1 sm:flex-none shadow-[3px_3px_0px_0px_#1B1C1A]"
                >
                  <Sparkles className="w-4 h-4 text-[#FF4500]" />
                  <span>ADD ENTIRE CAPSULE TO BAG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
