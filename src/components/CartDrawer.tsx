'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Box */}
      <div className="relative w-full max-w-md bg-[var(--bg-surface)] h-full border-l-grid flex flex-col justify-between z-10">
        {/* Header */}
        <div className="p-4 border-b-grid flex items-center justify-between bg-[var(--brand-yellow)]">
          <div className="flex items-center space-x-2">
            <h2 className="font-headline text-xl text-[var(--text-ink)]">YOUR BAG</h2>
            <span className="font-mono text-xs bg-[var(--text-ink)] text-white px-2 py-0.5 font-bold">
              {totalItems} ITEMS
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 border-grid hover-invert bg-[var(--bg-surface)] text-[var(--text-ink)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--brand-border)]">
          {cart.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center h-full space-y-4">
              <span className="font-mono text-xs text-[var(--brand-primary)]">// SYSTEM EMPTY</span>
              <h3 className="font-headline text-2xl">YOUR BAG IS EMPTY</h3>
              <p className="font-body text-sm text-[var(--text-muted)] max-w-xs">
                Browse our permanent archive collection and add garments to your bag.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-brutalist mt-4"
              >
                EXPLORE SHOP
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="p-4 flex gap-4 bg-[var(--bg-surface)]">
                {/* Product Image */}
                <div className="relative w-20 h-24 border-grid bg-[var(--bg-container)] flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] text-[var(--brand-primary)]">
                        {item.product.sku}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-[var(--text-muted)] hover:text-[var(--brand-primary)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-headline text-base leading-tight">
                      {item.product.name}
                    </h4>
                    <span className="font-mono text-xs text-[var(--text-muted)] block mt-1">
                      SIZE: <span className="font-bold text-[var(--text-ink)]">{item.selectedSize}</span>
                    </span>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--brand-border)]/20">
                    <div className="flex items-center border-grid">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                        className="p-1 hover-invert"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs px-2 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                        className="p-1 hover-invert"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-headline text-lg text-[var(--brand-primary)]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t-grid bg-[var(--bg-surface-low)] space-y-3">
            <div className="flex justify-between items-center font-mono text-xs">
              <span>SHIPPING:</span>
              <span className="text-[var(--brand-primary)]">CALCULATED AT CHECKOUT</span>
            </div>

            <div className="flex justify-between items-baseline border-t border-[var(--brand-border)]/20 pt-2">
              <span className="font-headline text-xl">SUBTOTAL</span>
              <span className="font-headline text-2xl text-[var(--brand-primary)]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <Link
              href="/bag"
              onClick={() => setIsCartOpen(false)}
              className="btn-brutalist-yellow w-full py-4 text-center font-headline text-lg tracking-wider flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
