'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'LOW_HIGH' | 'HIGH_LOW'>('NEWEST');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const { addToCart } = useCart();

  let displayedProducts = [...PRODUCTS];

  if (selectedCategory !== 'ALL') {
    if (selectedCategory === 'TOPS') {
      displayedProducts = displayedProducts.filter((p) => p.category === 'T-SHIRTS');
    } else if (selectedCategory === 'BOTTOMS') {
      displayedProducts = displayedProducts.filter((p) => p.category === 'PANTS');
    } else {
      displayedProducts = displayedProducts.filter((p) => p.category === selectedCategory);
    }
  }

  if (sortBy === 'LOW_HIGH') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'HIGH_LOW') {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  const visibleProducts = displayedProducts.slice(0, visibleCount);

  return (
    <div className="w-full bg-[#FAF9F5]">
      {/* 1. SHOP HEADER SECTION */}
      <div className="p-6 sm:p-10 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // PERMANENT ARCHIVE CATALOGUE
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl tracking-tight text-[#1B1C1A] leading-none">
            SHOP COLLECTION.
          </h1>
          <p className="font-body text-base sm:text-lg text-[#5D4038] leading-relaxed">
            Exploring the intersection of raw utility, brutalist architecture, and underground streetwear. Drop #1 / Vol. 001 Archive.
          </p>
        </div>

        <div className="font-mono text-xs bg-[#1B1C1A] text-white px-3 py-1.5 border border-[#1B1C1A] font-bold tracking-widest self-start md:self-end">
          TOTAL ITEMS: [ {displayedProducts.length} ]
        </div>
      </div>

      {/* 2. FULL-WIDTH CONNECTED TOOLBAR STRIP */}
      <div className="w-full border-b border-[#1B1C1A] bg-[#FAF9F5] flex flex-wrap lg:flex-nowrap items-stretch text-xs font-mono">
        {/* Category Tabs */}
        <div className="flex flex-wrap lg:flex-nowrap flex-1 items-stretch">
          {['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'ACCESSORIES'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 min-w-[120px] px-6 py-4 border-r border-[#1B1C1A] font-bold uppercase tracking-widest transition-colors text-center ${
                  isSelected
                    ? 'bg-[#FF4500] text-white'
                    : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FF4500] hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {/* Connected Sort Dropdown */}
          <div className="flex-1 min-w-[200px] border-r border-[#1B1C1A] bg-[#FAF9F5] px-6 py-4 flex items-center justify-between font-bold text-[#1B1C1A]">
            <span className="uppercase tracking-wider">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none font-mono font-bold text-xs p-0 text-[#1B1C1A] outline-none cursor-pointer uppercase tracking-wider text-right"
            >
              <option value="NEWEST">NEWEST</option>
              <option value="LOW_HIGH">PRICE: LOW TO HIGH</option>
              <option value="HIGH_LOW">PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-stretch flex-shrink-0">
          <button
            onClick={() => setViewMode('GRID')}
            className={`w-14 py-4 border-r border-[#1B1C1A] transition-colors flex items-center justify-center ${
              viewMode === 'GRID'
                ? 'bg-[#1B1C1A] text-white'
                : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FF4500] hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('LIST')}
            className={`w-14 py-4 border-r lg:border-r-0 border-[#1B1C1A] transition-colors flex items-center justify-center ${
              viewMode === 'LIST'
                ? 'bg-[#1B1C1A] text-white'
                : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FF4500] hover:text-white'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. PRODUCT CATALOG DISPLAY */}
      {viewMode === 'GRID' ? (
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FAF9F5] border-b border-[#1B1C1A]">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* List View Mode */
        <div className="divide-y divide-[#1B1C1A] border-b border-[#1B1C1A] bg-[#FAF9F5]">
          {visibleProducts.map((product) => (
            <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-[#F4F4F0] transition-colors">
              <Link href={`/product/${product.id}`} className="flex items-center gap-6 group flex-1">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 border border-[#1B1C1A] bg-[#111211] flex-shrink-0 overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-1 right-1 bg-[#FAF9F5] text-[#1B1C1A] font-mono text-[9px] font-bold px-1.5 py-0.5 border border-[#1B1C1A]">
                    / {product.index}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#FF4500] font-bold">
                    <span>{product.sku}</span>
                    <span>//</span>
                    <span>{product.color}</span>
                    {product.badgeJapanese && (
                      <span className="bg-[#FF4500] text-white px-1.5 py-0.2 border border-[#1B1C1A]">
                        {product.badgeJapanese}
                      </span>
                    )}
                  </div>
                  <h3 className="font-headline text-2xl text-[#1B1C1A] group-hover:text-[#FF4500] transition-colors mt-1">{product.name}</h3>
                  <p className="font-body text-sm text-[#5D4038] max-w-lg mt-1 line-clamp-1">{product.description}</p>
                  <div className="font-mono text-[10px] text-stone-500 mt-1">
                    SIZES: {product.sizes.join(' · ')}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-6 self-end sm:self-center">
                <span className="font-headline text-3xl text-[#1B1C1A]">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(product, product.sizes[0] || 'M')}
                  className="font-headline text-sm py-3 px-6 bg-[#FCD400] text-black border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> ADD BAG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. LOAD MORE BUTTON */}
      {visibleProducts.length < displayedProducts.length && (
        <div className="p-8 text-center border-b border-[#1B1C1A] bg-[#EFEEEA]">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="font-headline text-lg px-8 py-4 bg-[#FAF9F5] text-[#1B1C1A] border border-[#1B1C1A] hover:bg-[#FF4500] hover:text-white transition-colors uppercase tracking-wider inline-flex items-center gap-2 shadow-[3px_3px_0px_0px_#1B1C1A]"
          >
            <Plus className="w-5 h-5" />
            <span>LOAD MORE ARCHIVE DATA</span>
          </button>
        </div>
      )}

      {/* 5. FOOTER ARCHIVE INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#1B1C1A] bg-[#1B1C1A] text-white">
        <div className="md:col-span-6 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-stone-800 space-y-4">
          <h2 className="font-headline text-4xl text-[#FCD400]">NEO-ARCHIVE UNLTD.</h2>
          <p className="font-body text-base text-stone-300 max-w-md leading-relaxed">
            Brutalist design systems for the modern wasteland. Engineering garments for urban survival and permanent curation.
          </p>
          <div className="font-mono text-xs text-stone-400">
            ©2024 NEO-ARCHIVE. DROP #1 / VOL. 001. ALL RIGHTS RESERVED.
          </div>
        </div>

        <div className="md:col-span-6 p-8 sm:p-12 grid grid-cols-3 gap-6 font-mono text-xs">
          <div>
            <span className="text-[#FF4500] font-bold block mb-3">// INDEX</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li><Link href="/shop" className="hover:text-[#FCD400]">SHOP</Link></li>
              <li><Link href="/collections" className="hover:text-[#FCD400]">COLLECTIONS</Link></li>
              <li><Link href="/lookbook" className="hover:text-[#FCD400]">LOOKBOOK</Link></li>
            </ul>
          </div>
          <div>
            <span className="text-[#FF4500] font-bold block mb-3">// INFO</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li><Link href="/about" className="hover:text-[#FCD400]">ABOUT</Link></li>
              <li><Link href="/journal" className="hover:text-[#FCD400]">JOURNAL</Link></li>
              <li><Link href="/about" className="hover:text-[#FCD400]">CONTACT</Link></li>
            </ul>
          </div>
          <div>
            <span className="text-[#FF4500] font-bold block mb-3">// NETWORK</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li className="hover:text-[#FCD400] cursor-pointer">INSTAGRAM</li>
              <li className="hover:text-[#FCD400] cursor-pointer">TIKTOK</li>
              <li className="hover:text-[#FCD400] cursor-pointer">DISCORD</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
