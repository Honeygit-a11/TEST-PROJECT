'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, Eye } from 'lucide-react';
import { PRODUCTS, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'T-SHIRTS' | 'OUTERWEAR' | 'ACCESSORIES'>('ALL');
  const { addToCart } = useCart();

  const filteredProducts = selectedCategory === 'ALL'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full">
      {/* SECTION 1: HERO DISPLAY (Figma Frame "WEAR THE UNEXPECTED") */}
      <section className="relative w-full border-b border-[#1B1C1A] bg-[#F4F4F0] grid grid-cols-1 lg:grid-cols-12 min-h-[75vh] items-stretch">
        {/* Hero Left Content */}
        <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#1B1C1A] flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="inline-block font-mono text-xs bg-[#FCD400] text-[#1B1C1A] px-3 py-1 border border-[#1B1C1A] uppercase font-bold">
              // ARCHIVE DROP 01 / EST. 2026
            </div>
            <h1 className="font-headline text-6xl sm:text-8xl lg:text-9xl tracking-tighter leading-none text-[#1B1C1A]">
              WEAR THE<br />
              <span className="text-[#AD2C00]">UNEXPECTED</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-[#5D4038] max-w-xl leading-relaxed">
              NEO-ARCHIVE exists at the intersection of brutalist architecture and contemporary garment design. We reject traditional fashion cycles in favor of permanent curation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/shop" className="btn-brutalist-yellow text-lg py-4 px-8 flex items-center justify-center gap-3">
              <span>EXPLORE ALL DROPS</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/about" className="btn-brutalist text-lg py-4 px-8 flex items-center justify-center gap-2">
              <span>READ MANIFESTO</span>
            </Link>
          </div>
        </div>

        {/* Hero Right Visual Banner */}
        <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full bg-stone-900 border-t lg:border-t-0 flex flex-col justify-between p-6">
          <Image
            src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop"
            alt="NEO-ARCHIVE Hero Editorial"
            fill
            className="object-cover opacity-80 hover:opacity-100 transition-opacity"
            priority
          />
          <div className="relative z-10 self-start font-mono text-xs bg-black text-white px-3 py-1.5 border border-black">
            FIGMA NODE 30:2 // HERO VISUAL
          </div>
          <div className="relative z-10 bg-[#FAF9F5] p-4 border border-[#1B1C1A] max-w-xs self-end">
            <span className="font-mono text-[10px] text-[#AD2C00] font-bold block">FEATURED ARTIFACT</span>
            <span className="font-headline text-lg block">TS-001 STRUCTURAL TEE</span>
            <span className="font-mono text-xs text-[#5D4038]">$85 — 300 GSM COTTON</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: BRAND MANIFESTO SPLIT */}
      <section className="w-full border-b border-[#1B1C1A] grid grid-cols-1 md:grid-cols-12 bg-[#FAF9F5]">
        <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#1B1C1A] bg-[#AD2C00] text-white flex flex-col justify-center">
          <span className="font-mono text-xs text-[#FCD400] uppercase tracking-widest mb-2 font-bold">
            // PHILOSOPHY
          </span>
          <h2 className="font-headline text-4xl sm:text-6xl leading-tight">
            NOT A BRAND.<br />
            A STATEMENT.
          </h2>
        </div>
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-4">
          <p className="font-body text-xl text-[#1B1C1A] leading-relaxed">
            NEO-ARCHIVE exists at the intersection of brutalist architecture and contemporary garment design. We reject traditional fashion cycles in favor of permanent curation. Every piece is an artifact, designed with uncompromising structural integrity.
          </p>
          <div className="font-mono text-xs text-[#AD2C00] font-bold uppercase tracking-widest pt-2">
            EST. 2026 // SYSTEM V.1.0 // PERMANENT CURATION
          </div>
        </div>
      </section>

      {/* SECTION 3: LATEST DROPS & CATEGORY FILTER */}
      <section className="w-full border-b border-[#1B1C1A] bg-[#FAF9F5]">
        {/* Section Header Bar */}
        <div className="p-6 md:p-8 border-b border-[#1B1C1A] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#EFEEEA]">
          <div>
            <span className="font-mono text-xs text-[#AD2C00] font-bold tracking-widest block">// CATALOG</span>
            <h2 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">LATEST DROPS</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['ALL', 'T-SHIRTS', 'OUTERWEAR', 'ACCESSORIES'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-headline text-xs px-3.5 py-1.5 border border-[#1B1C1A] transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#AD2C00] text-white'
                    : 'bg-[#FAF9F5] hover:bg-[#1B1C1A] hover:text-white text-[#1B1C1A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid (Matching Node 30:206 Compact Height) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1B1C1A]">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative border-b border-[#1B1C1A] flex flex-col justify-between bg-[#FAF9F5] hover:bg-[#F4F4F0] transition-colors">
              {/* Image Box - Compact Square */}
              <div className="relative aspect-square w-full border-b border-[#1B1C1A] bg-[#EFEEEA] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top-Left Status Badge */}
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

                {/* Quick Add Overlay */}
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

              {/* Product Info */}
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
      </section>

      {/* SECTION 4: EDITORIAL BANNER */}
      <section className="w-full bg-[#FCD400] p-8 sm:p-16 border-b border-[#1B1C1A] text-center flex flex-col items-center space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest bg-[#1B1C1A] text-white px-4 py-1 font-bold">
          LIMITED PRODUCTION ARCHIVE
        </span>
        <h2 className="font-headline text-5xl sm:text-7xl lg:text-8xl tracking-tight max-w-4xl text-[#1B1C1A]">
          DISCOVER THE LOOKBOOK
        </h2>
        <p className="font-body text-xl max-w-xl text-[#1B1C1A]">
          Explore our seasonal visual documentation filmed on location in industrial brutalist structures.
        </p>
        <Link href="/lookbook" className="btn-brutalist-dark text-lg px-10 py-4">
          VIEW LOOKBOOK 2026
        </Link>
      </section>
    </div>
  );
}
