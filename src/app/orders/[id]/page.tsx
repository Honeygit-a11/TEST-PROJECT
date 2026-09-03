'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft, 
  Printer, 
  MapPin, 
  Loader2 
} from 'lucide-react';

interface OrderItem {
  productId?: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface OrderData {
  _id?: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal?: number;
  discount?: number;
  promoCode?: string;
  shipping?: number;
  customer?: CustomerInfo;
  items?: OrderItem[];
  createdAt: string;
}

const STATUS_STEPS = [
  { key: 'pending', label: 'ORDER PLACED', desc: 'Order logged into archive', icon: Clock },
  { key: 'paid', label: 'PAYMENT VERIFIED', desc: 'Authorized for dispatch', icon: CheckCircle2 },
  { key: 'shipped', label: 'IN TRANSIT', desc: 'Dispatched from warehouse', icon: Truck },
  { key: 'delivered', label: 'DELIVERED', desc: 'Handed over to recipient', icon: Check },
];

const STATUS_ORDER_INDEX: Record<string, number> = {
  pending: 0,
  paid: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FCD400] text-[#1B1C1A]',
  paid: 'bg-[#1B1C1A] text-white',
  shipped: 'bg-[#FF4500] text-white',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-stone-300 text-stone-600 line-through',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === 'object' && data.error?.message ? data.error.message : (data.error || 'Failed to locate order');
        throw new Error(msg);
      }
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching order details');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full bg-[#FAF9F5] min-h-[80vh] flex flex-col items-center justify-center space-y-4 p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4500]" />
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A]">
          // LOCATING ARTIFACT MANIFEST {params.id}...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full bg-[#FAF9F5] min-h-[80vh] flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full border border-[#1B1C1A] bg-[#EFEEEA] p-8 text-center space-y-6 shadow-[6px_6px_0px_0px_#1B1C1A]">
          <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center border border-[#1B1C1A] mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs text-red-600 font-bold uppercase tracking-widest block">
              // ERROR: MANIFEST NOT FOUND
            </span>
            <h1 className="font-headline text-3xl text-[#1B1C1A]">ORDER LOOKUP FAILED</h1>
            <p className="font-body text-sm text-stone-600">
              No tracking manifest was found for identifier <span className="font-mono font-bold text-black">{params.id}</span>.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="btn-brutalist-yellow text-xs py-3.5 px-4 font-headline tracking-wider text-center flex-1"
            >
              RETURN TO SHOP
            </Link>
            <Link
              href="/account"
              className="font-headline text-xs py-3.5 px-4 border border-[#1B1C1A] bg-[#FAF9F5] text-[#1B1C1A] hover:bg-black hover:text-white transition-colors text-center tracking-wider flex-1"
            >
              VIEW ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIdx = STATUS_ORDER_INDEX[order.status.toLowerCase()] ?? 0;
  const isCancelled = order.status.toLowerCase() === 'cancelled';

  return (
    <div className="w-full bg-[#FAF9F5] min-h-[85vh]">
      {/* Top Header Strip */}
      <div className="p-6 sm:p-10 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="font-mono text-xs text-stone-600 hover:text-[#FF4500] flex items-center gap-1 font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>MY ORDERS</span>
            </Link>
            <span className="text-stone-400">/</span>
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest">
              // LIVE FULFILLMENT TRACKER
            </span>
          </div>
          <h1 className="font-headline text-4xl sm:text-6xl tracking-tight text-[#1B1C1A] leading-none">
            {order.orderNumber}
          </h1>
          <div className="font-mono text-xs text-stone-500">
            TRANSACTION LOGGED: {formatDate(order.createdAt)}
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-end">
          <button
            onClick={() => fetchOrder(true)}
            disabled={refreshing}
            className="font-mono text-xs border border-[#1B1C1A] bg-[#FAF9F5] px-3.5 py-2 font-bold hover:bg-[#1B1C1A] hover:text-white transition-colors inline-flex items-center gap-2"
            title="Refresh status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#FF4500]' : ''}`} />
            <span>{refreshing ? 'POLLING...' : 'REFRESH STATUS'}</span>
          </button>

          <span
            className={`font-mono text-xs font-bold uppercase px-3 py-2 border border-[#1B1C1A] tracking-wider ${
              STATUS_STYLES[order.status.toLowerCase()] || 'bg-stone-200 text-black'
            }`}
          >
            STATUS: {order.status}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8">
        {/* 1. Fulfillment Progress Stepper */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-6">
          <div className="flex justify-between items-center border-b border-[#1B1C1A] pb-3">
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // FULFILLMENT TIMELINE
            </span>
            <span className="font-mono text-[11px] text-stone-500 uppercase">
              CARRIER: EXPRESS DISPATCH PROTOCOL
            </span>
          </div>

          {isCancelled ? (
            <div className="p-6 bg-stone-200 border border-[#1B1C1A] text-center space-y-2">
              <div className="font-headline text-2xl text-stone-700">TRANSACTION VOIDED // CANCELLED</div>
              <p className="font-mono text-xs text-stone-500">
                This order was cancelled. Any authorized payments have been reversed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.key}
                    className={`border border-[#1B1C1A] p-4 transition-all ${
                      isCurrent
                        ? 'bg-[#FCD400] text-[#1B1C1A] shadow-[3px_3px_0px_0px_#1B1C1A]'
                        : isPassed
                        ? 'bg-[#1B1C1A] text-white'
                        : 'bg-[#FAF9F5] text-stone-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] font-bold tracking-widest">
                        0{idx + 1} //
                      </span>
                      <div
                        className={`w-7 h-7 rounded-none border border-[#1B1C1A] flex items-center justify-center ${
                          isCurrent
                            ? 'bg-[#1B1C1A] text-[#FCD400]'
                            : isPassed
                            ? 'bg-[#FF4500] text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        <StepIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="font-headline text-lg leading-tight">{step.label}</div>
                    <div
                      className={`font-mono text-[11px] mt-1 ${
                        isCurrent
                          ? 'text-[#1B1C1A] font-semibold'
                          : isPassed
                          ? 'text-stone-300'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Destination & Shipping Details */}
        {order.customer && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#FF4500] font-bold">
                <MapPin className="w-4 h-4" />
                <span className="uppercase tracking-wider">// DISPATCH DESTINATION</span>
              </div>
              <div className="font-headline text-xl text-[#1B1C1A]">{order.customer.name}</div>
              <div className="text-stone-600 leading-relaxed">
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.postalCode}
                <br />
                {order.customer.country}
              </div>
            </div>

            <div className="md:col-span-6 border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-3 font-mono text-xs">
              <span className="text-[#FF4500] font-bold uppercase tracking-wider block">
                // COMMUNICATION CHANNELS
              </span>
              <div className="space-y-1">
                <div className="text-stone-600">CONFIRMATION NOTIFIED TO:</div>
                <div className="font-headline text-lg text-[#1B1C1A]">{order.customer.email}</div>
              </div>
              <div className="pt-2 text-[11px] text-stone-500">
                DISPATCH TIME: 2-4 BUSINESS DAYS · SIGNATURE REQUIRED AT DELIVERY
              </div>
            </div>
          </div>
        )}

        {/* 3. Items Manifest Breakdown */}
        {order.items && order.items.length > 0 && (
          <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A] space-y-4 p-6">
            <div className="flex justify-between items-center border-b border-[#1B1C1A] pb-3 font-mono text-xs">
              <span className="text-[#FF4500] font-bold uppercase tracking-wider block">
                // ARTIFACTS INCLUDED ({order.items.length})
              </span>
              <span className="text-stone-500">CURATED STREETWEAR DROP</span>
            </div>

            <div className="divide-y divide-[#1B1C1A] bg-[#FAF9F5] border border-[#1B1C1A]">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-14 h-14 border border-[#1B1C1A] bg-[#111211] flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-headline text-lg text-[#1B1C1A] truncate">{item.name}</div>
                      <div className="font-mono text-xs text-stone-500">
                        SIZE: <span className="font-bold text-[#1B1C1A]">{item.size}</span> · QTY: {item.quantity} · ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  <div className="font-headline text-lg text-[#1B1C1A] font-bold flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals Strip */}
            <div className="bg-[#FAF9F5] border border-[#1B1C1A] p-4 space-y-2 font-mono text-xs">
              {typeof order.subtotal === 'number' && (
                <div className="flex justify-between text-stone-600">
                  <span>SUBTOTAL:</span>
                  <span className="font-bold">${order.subtotal.toFixed(2)}</span>
                </div>
              )}
              {typeof order.discount === 'number' && order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>PROMO DISCOUNT ({order.promoCode}):</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {typeof order.shipping === 'number' && (
                <div className="flex justify-between text-stone-600">
                  <span>EXPRESS DISPATCH:</span>
                  <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-headline font-bold text-[#1B1C1A] border-t border-stone-300 pt-3">
                <span>TOTAL CHARGED:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1B1C1A]">
          <Link
            href="/shop"
            className="font-headline text-xs py-4 px-6 border border-[#1B1C1A] bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FF4500] hover:text-white transition-colors tracking-wider"
          >
            ← BACK TO ARCHIVE CATALOG
          </Link>

          <button
            onClick={() => window.print()}
            className="font-headline text-xs py-4 px-6 border border-[#1B1C1A] bg-[#EFEEEA] hover:bg-black hover:text-white transition-colors inline-flex items-center gap-2 tracking-wider"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT MANIFEST RECEIPT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
