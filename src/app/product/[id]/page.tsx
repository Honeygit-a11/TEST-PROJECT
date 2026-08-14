'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, Plus, Minus, Check } from 'lucide-react';
import { PRODUCTS, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = typeof params?.id === 'string' ? params.id : (Array.isArray(params?.id) ? params.id[0] : 'nx-001');
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);
  const { addToCart } = useCart();

  // Reset state when product changes (e.g. clicked on related product)
  useEffect(() => {
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedImage(product.image);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, product.image, product.sizes]);

  // Find related products (excluding current product)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize as any);
    }
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="w-full bg-[#FAF9F5]">
      {/* 1. TOP BREADCRUMB & SKU BAR */}
      <div className="p-4 sm:px-8 border-b border-[#1B1C1A] bg-[#EFEEEA] flex items-center justify-between font-mono text-xs">
        <Link
          href="/shop"
          className="flex items-center gap-2 text-[#1B1C1A] hover:text-[#FF4500] font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> <span>BACK TO CATALOG</span>
        </Link>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="bg-[#FAF9F5] text-[#1B1C1A] px-2 py-0.5 border border-[#1B1C1A] font-bold">
            / {product.index}
          </span>
          <span className="hidden sm:inline text-[#FF4500] font-bold">
            SYSTEM SKU // {product.sku}
          </span>
        </div>
      </div>

      {/* 2. MAIN 50/50 PRODUCT DETAIL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh] border-b border-[#1B1C1A]">
        {/* Left Column: Interactive Image Gallery */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#1B1C1A] p-6 lg:p-12 bg-[#F4F4F0] flex flex-col justify-between space-y-6">
          {/* Main Display Image */}
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[4/3] w-full border border-[#1B1C1A] bg-[#111211] overflow-hidden shadow-[4px_4px_0px_0px_#1B1C1A]">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {/* Top-left Japanese / Status Tag */}
            {product.badgeJapanese && (
              <div className="absolute top-4 left-4 bg-[#FF4500] text-white font-mono text-xs px-3 py-1 border border-[#1B1C1A] font-bold uppercase">
                {product.badgeJapanese}
              </div>
            )}
            {/* Top-right Index Pill */}
            <div className="absolute top-4 right-4 bg-[#FAF9F5] text-[#1B1C1A] font-mono text-xs px-3 py-1 border border-[#1B1C1A] font-bold">
              / {product.index}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 border border-[#1B1C1A] flex-shrink-0 bg-[#111211] overflow-hidden transition-all ${
                    selectedImage === img
                      ? 'ring-2 ring-[#FF4500] shadow-[2px_2px_0px_0px_#1B1C1A]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specifications & Purchase Box */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[#FAF9F5] space-y-8">
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#FF4500] uppercase font-bold tracking-widest mb-1">
                <span>// {product.category}</span>
                <span>•</span>
                <span>{product.season}</span>
              </div>
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-[#1B1C1A] leading-none mb-2 uppercase">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 mt-2">
                <span className="font-headline text-3xl sm:text-4xl text-[#1B1C1A] font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="font-body text-base text-stone-500 font-medium">
                  Color: <strong className="text-[#1B1C1A]">{product.color}</strong>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="font-body text-base sm:text-lg text-[#5D4038] leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-3 pt-4 border-t border-[#1B1C1A]">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="font-bold">// SELECT SIZE:</span>
                <span className="text-[#FF4500] font-bold uppercase tracking-wider">
                  {product.inStock ? '● IN STOCK & READY TO SHIP' : 'OUT OF STOCK'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`font-headline text-lg py-3 border border-[#1B1C1A] transition-all uppercase tracking-wider ${
                      selectedSize === size
                        ? 'bg-[#FF4500] text-white shadow-[2px_2px_0px_0px_#1B1C1A]'
                        : 'bg-[#FAF9F5] hover:bg-[#1B1C1A] hover:text-white text-[#1B1C1A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Bag */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3 items-stretch">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-[#1B1C1A] bg-[#FAF9F5]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-3 hover:bg-stone-200 transition-colors text-black"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-bold text-base px-4 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-3 hover:bg-stone-200 transition-colors text-black"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 text-xl font-headline flex items-center justify-center gap-3 tracking-wider border border-[#1B1C1A] transition-all ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FCD400] text-[#1B1C1A] hover:bg-[#1B1C1A] hover:text-[#FCD400] shadow-[3px_3px_0px_0px_#1B1C1A]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-6 h-6" />
                      <span>ADDED TO BAG!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-6 h-6" />
                      <span>ADD TO BAG — ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Technical Garment Specs Sheet */}
            <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-4 space-y-2 font-mono text-xs">
              <div className="text-[#FF4500] font-bold mb-2">// TECHNICAL GARMENT SPECIFICATIONS</div>
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
                <span className="text-stone-600">EDITION:</span>
                <span className="font-bold text-[#FF4500]">{product.details.edition}</span>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 border-t border-[#1B1C1A] pt-4 font-mono text-[10px] text-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#FF4500]" />
              <span className="font-bold">EXPRESS DISPATCH</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#FF4500]" />
              <span className="font-bold">QUALITY GUARANTEE</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-[#FF4500]" />
              <span className="font-bold">14-DAY RETURNS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DEDICATED RELATED PRODUCTS SECTION (MATCHING REFERENCE DESIGN) */}
      <section className="w-full bg-[#FAF9F5] border-b border-[#1B1C1A]">
        {/* Section Header */}
        <div className="p-6 md:p-8 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // ARCHIVE CURATION
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl text-[#1B1C1A]">
              RELATED PRODUCTS & COMPLETE THE LOOK
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-mono text-xs text-[#1B1C1A] hover:text-[#FF4500] font-bold uppercase tracking-wider flex items-center gap-1 underline"
          >
            VIEW FULL COLLECTION →
          </Link>
        </div>

        {/* Product Cards Grid using exact same card design */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FAF9F5]">
          {relatedProducts.map((relProduct) => (
            <ProductCard key={relProduct.id} product={relProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}
