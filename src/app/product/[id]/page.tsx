'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find((p) => p.id === params.id) || PRODUCTS[0];
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const { addToCart } = useCart();

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full">
      {/* Top Navigation Strip */}
      <div className="p-4 border-b-grid bg-[var(--bg-container)] flex items-center justify-between font-mono text-xs">
        <Link href="/shop" className="flex items-center gap-2 text-[var(--text-ink)] hover:text-[var(--brand-primary)]">
          <ArrowLeft className="w-4 h-4" /> BACK TO CATALOG
        </Link>
        <span className="hidden sm:inline text-[var(--brand-primary)]">
          SYSTEM SKU // {product.sku}
        </span>
      </div>

      {/* Main 50/50 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh]">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r-grid p-6 lg:p-12 bg-[var(--bg-surface-low)] flex flex-col justify-between space-y-6">
          {/* Main Display Image */}
          <div className="relative aspect-[4/5] w-full border-grid bg-[var(--bg-container)] overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 bg-black text-white font-mono text-xs px-3 py-1 border-grid">
              ARTIFACT: {product.sku}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 border-grid flex-shrink-0 ${
                    selectedImage === img ? 'ring-2 ring-[var(--brand-primary)]' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specifications & Purchase Box */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[var(--bg-surface)] space-y-8">
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-widest block mb-1">
                // {product.category}
              </span>
              <h1 className="font-headline text-4xl sm:text-5xl text-[var(--text-ink)] leading-none mb-2">
                {product.name}
              </h1>
              <div className="font-headline text-3xl text-[var(--brand-primary)]">
                ${product.price}
              </div>
            </div>

            <p className="font-body text-base text-[var(--text-muted)] leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-3 pt-4 border-t-grid">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="font-bold">// SELECT SIZE:</span>
                <span className="text-[var(--brand-primary)] cursor-pointer underline">SIZE SPECIFICATION CHART</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`font-headline text-lg py-3 border-grid transition-all ${
                      selectedSize === size
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'bg-[var(--bg-surface)] hover-invert text-[var(--text-ink)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bag CTA */}
            <button
              onClick={() => addToCart(product, selectedSize)}
              className="btn-brutalist-yellow w-full py-5 text-xl font-headline flex items-center justify-center gap-3 tracking-wider"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>ADD TO BAG — ${product.price}</span>
            </button>

            {/* Technical Specs Table */}
            <div className="border-grid bg-[var(--bg-container)] p-4 space-y-2 font-mono text-xs">
              <div className="text-[var(--brand-primary)] font-bold mb-2">// TECHNICAL GARMENT SPECIFICATIONS</div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">GSM DENSITY:</span>
                <span className="font-bold">{product.details.gsm}</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">COMPOSITION:</span>
                <span className="font-bold">{product.details.fabric}</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">SILHOUETTE:</span>
                <span className="font-bold">{product.details.fit}</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">ORIGIN:</span>
                <span className="font-bold">{product.details.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">CURATION:</span>
                <span className="font-bold text-[var(--brand-primary)]">{product.details.edition}</span>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 border-t-grid pt-4 font-mono text-[10px] text-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>FREE EXPRESS DISPATCH</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>PERMANENT QUALITY GUARANTEE</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>14-DAY RETURN PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
