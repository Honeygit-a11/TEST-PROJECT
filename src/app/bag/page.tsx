'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const SHIPPING_FLAT = 8;
const FREE_SHIPPING_THRESHOLD = 120;

const EMPTY_CUSTOMER = {
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

export default function BagPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [customer, setCustomer] = useState({ ...EMPTY_CUSTOMER });
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  // Auto-fill logged in customer details
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          const addr = data.user.shippingAddress;
          const hasAddr = Boolean(addr?.address && addr?.city);
          if (hasAddr) setHasSavedAddress(true);

          setCustomer((prev) => ({
            ...prev,
            name: prev.name || data.user.name || '',
            email: prev.email || data.user.email || '',
            address: prev.address || addr?.address || '',
            city: prev.city || addr?.city || '',
            postalCode: prev.postalCode || addr?.postalCode || '',
            country: prev.country || addr?.country || '',
          }));
        }
      })
      .catch(() => {});
  }, []);

  const [promoMessage, setPromoMessage] = useState('');
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);
  const [validatingPromo, setValidatingPromo] = useState(false);

  const discount = discountApplied ? promoDiscountAmount : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const grandTotal = Math.max(0, Math.round((subtotal - discount + shipping) * 100) / 100);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMessage('');
    if (!promoCode.trim()) return;

    setValidatingPromo(true);
    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscountApplied(true);
        setPromoDiscountAmount(data.discount);
        setPromoMessage(`✓ ${data.code} APPLIED (-$${data.discount.toFixed(2)})`);
      } else {
        setDiscountApplied(false);
        setPromoDiscountAmount(0);
        setPromoMessage(`// ${data.error?.message || 'INVALID PROMO CODE'}`);
      }
    } catch {
      setPromoMessage('// ERROR VALIDATING CODE');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleCustomerChange = (field: keyof typeof customer) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckout = async () => {
    setCheckoutError('');
    if ((Object.keys(customer) as (keyof typeof customer)[]).some((k) => !customer[k].trim())) {
      setCheckoutError('// ERROR: COMPLETE ALL SHIPPING FIELDS');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.product.id,
            size: i.selectedSize,
            quantity: i.quantity,
          })),
          customer,
          ...(discountApplied ? { promoCode: promoCode.trim().toUpperCase() } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof data?.error === 'object' && data.error ? data.error.message : (data?.error || 'CHECKOUT FAILED');
        throw new Error(msg);
      }
      setOrderNumber(data.orderNumber);
      setCheckoutComplete(true);
      clearCart();
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message.toUpperCase() : '// CHECKOUT FAILED');
    } finally {
      setSubmitting(false);
    }
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
          ORDER ID: {orderNumber}<br />
          ESTIMATED DELIVERY: 2-4 BUSINESS DAYS
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/orders/${orderNumber}`}
            className="btn-brutalist-yellow text-base sm:text-lg py-4 px-8 flex items-center justify-center gap-2"
          >
            <span>TRACK ORDER // RECEIPT</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/shop" className="btn-brutalist text-base sm:text-lg py-4 px-8 text-center">
            RETURN TO CATALOG
          </Link>
        </div>
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
                  <button type="submit" disabled={validatingPromo} className="btn-brutalist text-xs px-4">
                    {validatingPromo ? 'CHECKING...' : 'APPLY'}
                  </button>
                </div>
                {promoMessage && (
                  <span
                    className={`font-mono text-xs font-bold block ${
                      discountApplied ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {promoMessage}
                  </span>
                )}
              </form>

              {/* Shipping Details Form */}
              <div className="space-y-2 border-t-grid pt-4">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-xs font-bold text-[var(--brand-primary)] block">
                    // SHIPPING DETAILS:
                  </label>
                  {hasSavedAddress && (
                    <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-500 font-bold px-2 py-0.5">
                      ✓ PROFILE ADDRESS LOADED
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    value={customer.name}
                    onChange={handleCustomerChange('name')}
                    className="bg-[var(--bg-surface)] font-mono text-xs p-3 border-grid outline-none sm:col-span-1"
                  />
                  <input
                    type="email"
                    placeholder="EMAIL"
                    value={customer.email}
                    onChange={handleCustomerChange('email')}
                    className="bg-[var(--bg-surface)] font-mono text-xs p-3 border-grid outline-none sm:col-span-1"
                  />
                  <input
                    type="text"
                    placeholder="STREET ADDRESS"
                    value={customer.address}
                    onChange={handleCustomerChange('address')}
                    className="bg-[var(--bg-surface)] font-mono text-xs p-3 border-grid outline-none sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="CITY"
                    value={customer.city}
                    onChange={handleCustomerChange('city')}
                    className="bg-[var(--bg-surface)] font-mono text-xs p-3 border-grid outline-none"
                  />
                  <input
                    type="text"
                    placeholder="POSTAL CODE"
                    value={customer.postalCode}
                    onChange={handleCustomerChange('postalCode')}
                    className="bg-[var(--bg-surface)] font-mono text-xs p-3 border-grid outline-none"
                  />
                  <input
                    type="text"
                    placeholder="COUNTRY"
                    value={customer.country}
                    onChange={handleCustomerChange('country')}
                    className="bg-[var(--bg-surface)] font-mono text-xs p-3 border-grid outline-none sm:col-span-2"
                  />
                </div>
              </div>

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
              {checkoutError && (
                <div className="font-mono text-xs font-bold text-red-600 bg-red-50 border border-red-600 p-3">
                  {checkoutError}
                </div>
              )}
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="btn-brutalist-yellow w-full py-5 text-xl font-headline flex items-center justify-center gap-3 tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{submitting ? 'PROCESSING...' : `COMPLETE ORDER — $${grandTotal}`}</span>
                {!submitting && <ArrowRight className="w-6 h-6" />}
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
