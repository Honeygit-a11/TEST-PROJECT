'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function BagPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 20;
  const grandTotal = subtotal - discount + shipping;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ARCHIVE10' || promoCode.trim().toUpperCase() === 'NEO2026') {
      setDiscountApplied(true);
    } else {
      alert('INVALID PROMO CODE. TRY "ARCHIVE10" OR "NEO2026"');
    }
  };

  const handleCheckout = () => {
    setCheckoutComplete(true);
    clearCart();
  };

  if (checkoutComplete) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <CheckCircle2 className="w-20 h-20 text-[var(--brand-primary)] animate-bounce" />
        <div className="space-y-2">
          <span className="font-mono text-xs text-[var(--brand-primary)] tracking-widest">// ORDER CONFIRMED</span>
          <h1 className="font-headline text-5xl sm:text-7xl">TRANSACTION COMPLETE</h1>
          <p className="font-body text-lg text-[var(--text-muted)] max-w-md mx-auto">
            Your order has been logged into the system. Dispatch tracking number will be emitted shortly.
          </p>
        </div>

        <div className="font-mono text-xs bg-[var(--brand-yellow)] p-4 border-grid max-w-sm w-full">
          ORDER ID: NEO-2026-ARCHIVE-8849<br />
          ESTIMATED DELIVERY: 2-4 BUSINESS DAYS
        </div>

        <Link href="/shop" className="btn-brutalist text-lg py-4 px-8">
          RETURN TO CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-8 sm:p-12 border-b-grid bg-[var(--bg-container)] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-widest block">
            // ORDER SUMMARY
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl">YOUR BAG</h1>
        </div>

        <div className="font-mono text-xs bg-[var(--text-ink)] text-white px-3 py-1.5 border-grid">
          {totalItems} ITEMS IN BAG
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center justify-center min-h-[50vh] space-y-6">
          <span className="font-mono text-xs text-[var(--brand-primary)]">// BAG IS EMPTY</span>
          <h2 className="font-headline text-4xl">NO ARTIFACTS SELECTED</h2>
          <p className="font-body text-lg text-[var(--text-muted)] max-w-md">
            Explore our permanent streetwear catalog and select garments for your bag.
          </p>
          <Link href="/shop" className="btn-brutalist-yellow text-lg py-4 px-8 flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>GO TO SHOP</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[70vh]">
          {/* Left Column: Item List */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r-grid divide-y divide-[var(--brand-border)] bg-[var(--bg-surface)]">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-6 items-center">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-28 border-grid bg-[var(--bg-container)] flex-shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-[var(--brand-primary)] block">
                      {item.product.sku}
                    </span>
                    <h3 className="font-headline text-2xl text-[var(--text-ink)]">
                      {item.product.name}
                    </h3>
                    <div className="font-mono text-xs text-[var(--text-muted)]">
                      SIZE: <span className="font-bold text-[var(--text-ink)]">{item.selectedSize}</span> | CATEGORY: {item.product.category}
                    </div>
                    <div className="font-headline text-xl text-[var(--brand-primary)] pt-1">
                      ${item.product.price} EACH
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex items-center border-grid bg-[var(--bg-surface)]">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                      className="p-2 hover-invert"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-sm font-bold px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                      className="p-2 hover-invert"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    className="p-2 border-grid hover-brand text-red-600 hover:text-white"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Checkout Breakdown */}
          <div className="lg:col-span-5 p-8 sm:p-12 bg-[var(--bg-surface-low)] flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h2 className="font-headline text-3xl border-b-grid pb-4">ORDER BREAKDOWN</h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="font-mono text-xs font-bold text-[var(--brand-primary)] block">
                  // PROMO CODE (TRY "ARCHIVE10"):
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="ENTER CODE..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-[var(--bg-surface)] font-mono text-xs p-3 border-grid outline-none uppercase"
                  />
                  <button type="submit" className="btn-brutalist text-xs px-4">
                    APPLY
                  </button>
                </div>
                {discountApplied && (
                  <span className="font-mono text-xs text-emerald-700 font-bold block">
                    ✓ 10% ARCHIVE DISCOUNT APPLIED!
                  </span>
                )}
              </form>

              {/* Cost Lines */}
              <div className="space-y-3 font-mono text-sm border-t-grid pt-4">
                <div className="flex justify-between">
                  <span>BAG SUBTOTAL:</span>
                  <span className="font-bold">${subtotal}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>DISCOUNT (10%):</span>
                    <span>-${discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>EXPRESS DISPATCH:</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                </div>

                <div className="flex justify-between text-xl font-headline font-bold text-[var(--brand-primary)] border-t border-stone-300 pt-3">
                  <span>GRAND TOTAL:</span>
                  <span>${grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="btn-brutalist-yellow w-full py-5 text-xl font-headline flex items-center justify-center gap-3 tracking-wider"
              >
                <span>COMPLETE ORDER — ${grandTotal}</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <div className="font-mono text-[10px] text-center text-stone-500">
                ENCRYPTED CHECKOUT PROTOCOL // SECURE SYSTEM
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
