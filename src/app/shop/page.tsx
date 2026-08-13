'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Eye, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { PRODUCTS, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

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
          <span className="font-mono text-xs text-[#AD2C00] font-bold uppercase tracking-widest block">
            // PERMANENT ARCHIVE CATALOGUE
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl tracking-tight text-[#1B1C1A] leading-none">
            LATEST DROPS.
          </h1>
          <p className="font-body text-base sm:text-lg text-[#5D4038] leading-relaxed">
            Exploring the intersection of raw utility and refined tailoring. New arrivals from the SS24 tactical collection.
          </p>
        </div>

        <div className="font-mono text-xs bg-[#1B1C1A] text-white px-3 py-1.5 border border-[#1B1C1A] font-bold tracking-widest self-start md:self-end">
          TOTAL ITEMS: [ {PRODUCTS.length} ]
        </div>
      </div>

      {/* 2. FIGMA EXACT FULL-WIDTH CONNECTED TOOLBAR STRIP (IMAGE 1 SPACING) */}
      <div className="w-full border-b border-[#1B1C1A] bg-[#FAF9F5] flex flex-wrap lg:flex-nowrap items-stretch text-xs font-mono">
        {/* Category Tabs: ALL | OUTERWEAR | TOPS | BOTTOMS | ACCESSORIES */}
        <div className="flex flex-wrap lg:flex-nowrap flex-1 items-stretch">
          {['ALL', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'ACCESSORIES'].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 min-w-[120px] px-6 py-4 border-r border-[#1B1C1A] font-bold uppercase tracking-widest transition-colors text-center ${
                  isSelected
                    ? 'bg-[#FF4500] text-white' // Signal Red/Orange vibrant background
                    : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FF4500] hover:text-white' // Vibrant Orange hover
                }`}
              >
                {cat}
              </button>
            );
          })}

          {/* Connected Sort Dropdown Cell */}
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

        {/* View Mode Toggle Buttons (Far Right End) */}
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

      {/* 3. PRODUCT CATALOG DISPLAY (GRID or LIST MODE) */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1B1C1A] border-b border-[#1B1C1A]">
          {visibleProducts.map((product) => (
            <div key={product.id} className="group relative border-b border-[#1B1C1A] flex flex-col justify-between bg-[#FAF9F5] hover:bg-[#F4F4F0] transition-colors">
              {/* Image Box - Compact Square */}
              <div className="relative aspect-square w-full border-b border-[#1B1C1A] bg-[#EFEEEA] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top-Left Badge (NEW, LOW STOCK, CORE) */}
                {product.tag && (
                  <div className={`absolute top-2.5 left-2.5 font-mono text-[10px] px-2 py-0.5 font-bold border border-[#1B1C1A] uppercase ${
                    product.tag === 'NEW'
                      ? 'bg-[#FCD400] text-[#1B1C1A]'
                      : product.tag === 'LOW STOCK'
                      ? 'bg-[#AD2C00] text-white'
                      : 'bg-[#1B1C1A] text-white'
                  }`}>
                    {product.tag}
                  </div>
                )}

                {/* Top-Right Season Tag */}
                <div className="absolute top-2.5 right-2.5 font-mono text-[10px] bg-[#1B1C1A] text-white px-2 py-0.5 border border-black">
                  {product.season}
                </div>

                {/* Hover Overlay Buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 gap-2">
                  <Link
                    href={`/product/${product.id}`}
                    className="font-headline text-xs py-2 px-3 bg-white text-black border border-black hover:bg-[#AD2C00] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> VIEW
                  </Link>
                  <button
                    onClick={() => addToCart(product, 'M')}
                    className="font-headline text-xs py-2 px-3 bg-[#FCD400] text-black border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD BAG
                  </button>
                </div>
              </div>

              {/* Product Meta Info */}
              <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[10px] text-[#AD2C00] font-bold">{product.sku}</span>
                  <span className="font-headline text-2xl text-[#AD2C00]">${product.price}</span>
                </div>

                <h3 className="font-headline text-lg tracking-tight text-[#1B1C1A] group-hover:text-[#AD2C00] transition-colors leading-tight">
                  {product.name}
                </h3>

                <div className="pt-2 border-t border-[#1B1C1A]/20 flex justify-between items-center font-mono text-[10px] text-stone-600">
                  <span>SIZES: S-XL</span>
                  <span className="text-emerald-700 font-bold">● IN STOCK</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View Mode */
        <div className="divide-y divide-[#1B1C1A] border-b border-[#1B1C1A] bg-[#FAF9F5]">
          {visibleProducts.map((product) => (
            <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-[#F4F4F0] transition-colors">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 border border-[#1B1C1A] bg-[#EFEEEA] flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#AD2C00] font-bold">
                    <span>{product.sku}</span>
                    <span>//</span>
                    <span>{product.category}</span>
                  </div>
                  <h3 className="font-headline text-2xl text-[#1B1C1A] mt-1">{product.name}</h3>
                  <p className="font-body text-sm text-[#5D4038] max-w-lg mt-1 line-clamp-1">{product.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-center">
                <span className="font-headline text-3xl text-[#AD2C00]">${product.price}</span>
                <button
                  onClick={() => addToCart(product, 'M')}
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
      <div className="p-8 text-center border-b border-[#1B1C1A] bg-[#EFEEEA]">
        <button
          onClick={() => setVisibleCount((prev) => prev + 4)}
          className="font-headline text-lg px-8 py-4 bg-[#FAF9F5] text-[#1B1C1A] border border-[#1B1C1A] hover:bg-[#FF4500] hover:text-white transition-colors uppercase tracking-wider inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>LOAD MORE ARCHIVE DATA</span>
        </button>
      </div>

      {/* 5. FOOTER ARCHIVE INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#1B1C1A] bg-[#1B1C1A] text-white">
        <div className="md:col-span-6 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-stone-800 space-y-4">
          <h2 className="font-headline text-4xl text-[#FCD400]">NEO-ARCHIVE UNLTD.</h2>
          <p className="font-body text-base text-stone-300 max-w-md leading-relaxed">
            Brutalist design systems for the modern wasteland. Engineering garments for urban survival and permanent curation.
          </p>
          <div className="font-mono text-xs text-stone-400">
            ©2026 NEO-ARCHIVE. ALL RIGHTS RESERVED.
          </div>
        </div>

        <div className="md:col-span-6 p-8 sm:p-12 grid grid-cols-3 gap-6 font-mono text-xs">
          <div>
            <span className="text-[#AD2C00] font-bold block mb-3">// INDEX</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li><Link href="/shop" className="hover:text-[#FCD400]">SHOP</Link></li>
              <li><Link href="/collections" className="hover:text-[#FCD400]">COLLECTIONS</Link></li>
              <li><Link href="/lookbook" className="hover:text-[#FCD400]">LOOKBOOK</Link></li>
            </ul>
          </div>
          <div>
            <span className="text-[#AD2C00] font-bold block mb-3">// INFO</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li><Link href="/about" className="hover:text-[#FCD400]">ABOUT</Link></li>
              <li><Link href="/journal" className="hover:text-[#FCD400]">JOURNAL</Link></li>
              <li><Link href="/about" className="hover:text-[#FCD400]">CONTACT</Link></li>
            </ul>
          </div>
          <div>
            <span className="text-[#AD2C00] font-bold block mb-3">// NETWORK</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li className="hover:text-[#FCD400] cursor-pointer">INSTAGRAM</li>
              <li className="hover:text-[#FCD400] cursor-pointer">TIKTOK</li>
              <li className="hover:text-[#FCD400] cursor-pointer">PINTEREST</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
