'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'T-SHIRTS' | 'OUTERWEAR' | 'ACCESSORIES' | 'PANTS'>('ALL');

  const filteredProducts = selectedCategory === 'ALL'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full">
      {/* SECTION 1: HERO EDITORIAL DISPLAY */}
      <section className="relative w-full border-b border-[#1B1C1A] bg-[#F4F4F0] grid grid-cols-1 lg:grid-cols-12 min-h-[75vh] items-stretch">
        {/* Hero Left Content */}
        <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#1B1C1A] flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="inline-block font-mono text-xs bg-[#FCD400] text-[#1B1C1A] px-3 py-1 border border-[#1B1C1A] uppercase font-bold tracking-wider">
              // DROP #1 / VOL.001 / EST. 2024
            </div>
            <h1 className="font-headline text-6xl sm:text-8xl lg:text-9xl tracking-tighter leading-none text-[#1B1C1A]">
              WEAR THE<br />
              <span className="text-[#FF4500]">UNEXPECTED</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-[#5D4038] max-w-xl leading-relaxed">
              NEO-ARCHIVE exists at the intersection of raw brutalism and contemporary underground streetwear. Permanent garment drops curated for urban expression.
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
        <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full bg-stone-900 border-t lg:border-t-0 flex flex-col justify-between p-6 overflow-hidden">
          <Image
            src="/hero-streetwear.jpg"
            alt="NEO-ARCHIVE Hero Editorial"
            fill
            className="object-cover object-top opacity-95 hover:opacity-100 transition-opacity"
            priority
          />
          <div className="relative z-10 self-start font-mono text-xs bg-black text-white px-3 py-1.5 border border-white/20">
            VOL.001 // DROP HIGHLIGHT
          </div>
          <div className="relative z-10 bg-[#FAF9F5] p-4 border border-[#1B1C1A] max-w-xs self-end shadow-[4px_4px_0px_0px_#1B1C1A]">
            <span className="font-mono text-[10px] text-[#FF4500] font-bold block">// DROP 01 ARTIFACT</span>
            <span className="font-headline text-lg block">NX-001 OVERSIZED FACE TEE</span>
            <span className="font-mono text-xs text-[#5D4038]">$48.00 — 280 GSM VINTAGE COTTON</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: BRAND MANIFESTO SPLIT */}
      <section className="w-full border-b border-[#1B1C1A] grid grid-cols-1 md:grid-cols-12 bg-[#FAF9F5]">
        <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#1B1C1A] bg-[#FF4500] text-white flex flex-col justify-center">
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
            NEO-ARCHIVE is built on ruthless structural integrity and unapologetic graphic design. We reject disposable fast fashion cycles in favor of permanent curation. Every piece is an artifact.
          </p>
          <div className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest pt-2">
            DROP #1 // VOL.001 // BUENOS AIRES + WORLDWIDE
          </div>
        </div>
      </section>

      {/* SECTION 3: LATEST DROPS & CATALOG SHOWCASE */}
      <section className="w-full border-b border-[#1B1C1A] bg-[#FAF9F5]">
        {/* Section Header Bar */}
        <div className="p-6 md:p-8 border-b border-[#1B1C1A] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#EFEEEA]">
          <div>
            <span className="font-mono text-xs text-[#FF4500] font-bold tracking-widest block">// CATALOG</span>
            <h2 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">LATEST DROPS</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['ALL', 'T-SHIRTS', 'OUTERWEAR', 'ACCESSORIES', 'PANTS'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-headline text-xs px-4 py-2 border border-[#1B1C1A] transition-all uppercase tracking-wider ${
                  selectedCategory === cat
                    ? 'bg-[#FF4500] text-white shadow-[2px_2px_0px_0px_#1B1C1A]'
                    : 'bg-[#FAF9F5] hover:bg-[#1B1C1A] hover:text-white text-[#1B1C1A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid with Exact Brutalist Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 bg-[#FAF9F5]">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
          VIEW LOOKBOOK 2024
        </Link>
      </section>
    </div>
  );
}
