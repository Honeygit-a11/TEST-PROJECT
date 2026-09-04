'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Plus, Bookmark } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  showQuickActions = true,
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    addToCart(product, defaultSize);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between bg-[#ECEAE4] border border-[#1B1C1A] transition-all hover:shadow-[4px_4px_0px_0px_#1B1C1A] ${className}`}
    >
      <Link href={`/product/${product.id}`} className="block flex-1 flex flex-col">
        {/* 1. PRODUCT IMAGE CONTAINER */}
        <div className="relative aspect-square w-full bg-[#111211] overflow-hidden border-b border-[#1B1C1A]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
          />

          {/* Top-Left Orange / Status Tag */}
          {(product.badgeJapanese || product.tag) && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
              <span className="bg-[#FF4500] text-white font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 border border-[#1B1C1A] tracking-wider uppercase shadow-sm">
                {product.badgeJapanese || product.tag}
              </span>
            </div>
          )}

          {/* Top-Right: Bookmark + Index Number */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`p-1.5 border border-[#1B1C1A] transition-colors shadow-sm ${
                wishlisted
                  ? 'bg-[#FF4500] text-white'
                  : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400]'
              }`}
              title={wishlisted ? 'Remove from Saved' : 'Save to Archive Wishlist'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${wishlisted ? 'fill-white' : ''}`} />
            </button>
            <span className="bg-[#FAF9F5] text-[#1B1C1A] font-mono text-[10px] sm:text-[11px] font-bold px-2.5 py-1 border border-[#1B1C1A] tracking-widest uppercase shadow-sm">
              / {product.index || '001'}
            </span>
          </div>

          {/* Quick Action Overlay On Hover */}
          {showQuickActions && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 gap-2 z-20">
              <span className="font-headline text-xs py-2 px-3.5 bg-white text-black border border-black hover:bg-[#FF4500] hover:text-white transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5" /> VIEW
              </span>
              <button
                onClick={handleQuickAdd}
                className="font-headline text-xs py-2 px-3.5 bg-[#FCD400] text-black border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider"
                title="Quick Add to Bag"
              >
                <Plus className="w-3.5 h-3.5" /> ADD
              </button>
            </div>
          )}
        </div>

        {/* 2. CARD MIDDLE: TITLE, PRICE & COLOR */}
        <div className="p-3.5 sm:p-4 bg-[#FAF9F5] flex-1 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-headline text-base sm:text-lg text-[#1B1C1A] group-hover:text-[#FF4500] transition-colors leading-tight uppercase tracking-tight">
              {product.name}
            </h3>
            <span className="font-headline text-base sm:text-lg text-[#1B1C1A] font-bold tracking-tight whitespace-nowrap">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="mt-1 font-body text-xs sm:text-sm text-stone-500 font-medium">
            {product.color}
          </div>
        </div>

        {/* 3. CARD BOTTOM BAR: SIZES & STOCK STATUS */}
        <div className="px-3.5 py-2.5 sm:px-4 bg-[#FAF9F5] border-t border-[#1B1C1A] flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-[#1B1C1A]">
          {/* Sizes list (e.g. S · M · L · XL or ONE SIZE) */}
          <div className="tracking-widest uppercase font-semibold text-stone-700">
            {product.sizes.length === 1 && product.sizes[0] === 'ONE SIZE'
              ? 'ONE SIZE'
              : product.sizes.join(' · ')}
          </div>

          {/* Stock Indicator */}
          <div className="tracking-wider uppercase font-bold text-stone-900 flex items-center gap-1">
            {product.inStock ? (
              <>
                <span
                  className="inline-block w-1.5 h-1.5 bg-emerald-600"
                  style={{ borderRadius: '50%' }}
                ></span>
                <span>IN STOCK</span>
              </>
            ) : (
              <span className="text-[#FF4500]">OUT OF STOCK</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
