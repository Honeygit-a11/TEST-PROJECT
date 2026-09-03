'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Loader2, RefreshCw, CheckCircle, Clock } from 'lucide-react';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;

interface OrderItem {
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

interface AdminOrder {
  _id: string;
  orderNumber: string;
  userEmail?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FCD400] text-[#1B1C1A]',
  paid: 'bg-[#1B1C1A] text-white',
  shipped: 'bg-[#FF4500] text-white',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-stone-300 text-stone-600 line-through',
};

function formatDate(str: string): string {
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'ALL' ? '/api/orders' : `/api/orders?status=${statusFilter.toLowerCase()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusUpdate = async (orderNumber: string, newStatus: string) => {
    setUpdatingId(orderNumber);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o))
        );
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1B1C1A] pb-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // DISPATCH PIPELINE
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">ORDERS & FULFILLMENT</h1>
        </div>

        <button
          onClick={fetchOrders}
          className="font-mono text-xs border border-[#1B1C1A] bg-[#EFEEEA] px-4 py-2 font-bold hover:bg-[#1B1C1A] hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH ORDERS</span>
        </button>
      </div>

      {/* Filter Tabs Strip */}
      <div className="border border-[#1B1C1A] bg-[#FAF9F5] flex flex-wrap items-stretch text-xs font-mono">
        {['ALL', ...ORDER_STATUSES.map((s) => s.toUpperCase())].map((st) => {
          const isSelected = statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-5 py-3 border-r border-[#1B1C1A] font-bold uppercase tracking-wider transition-colors ${
                isSelected
                  ? 'bg-[#1B1C1A] text-white'
                  : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400]'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="p-16 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF4500]" />
          <span>LOADING DISPATCH QUEUE...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-12 text-center space-y-2">
          <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
          <div className="font-headline text-2xl text-[#1B1C1A]">NO ORDERS IN THIS QUEUE</div>
          <p className="font-mono text-xs text-stone-500">
            No orders match the current status filter ({statusFilter}).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isUpdating = updatingId === order.orderNumber;

            return (
              <div
                key={order._id || order.orderNumber}
                className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A]"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-5 border-b border-[#1B1C1A] flex flex-wrap items-center justify-between gap-4 bg-[#EFEEEA]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-[#1B1C1A]">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#1B1C1A] ${
                          STATUS_STYLES[order.status.toLowerCase()] || 'bg-stone-200 text-black'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-stone-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Status Advance Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-600">CHANGE STATUS:</span>
                    <select
                      disabled={isUpdating}
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.orderNumber, e.target.value)}
                      className="bg-[#FAF9F5] border border-[#1B1C1A] font-mono text-xs font-bold px-3 py-1.5 outline-none uppercase cursor-pointer"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-[#FF4500]" />}
                  </div>
                </div>

                {/* Details Grid: Customer & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#1B1C1A] text-xs font-mono bg-[#FAF9F5]">
                  <div className="md:col-span-6 p-4 border-b md:border-b-0 md:border-r border-[#1B1C1A] space-y-1">
                    <span className="font-bold text-[#FF4500] uppercase block">// CUSTOMER IDENTITY</span>
                    <div className="font-headline text-base text-[#1B1C1A]">{order.customer?.name}</div>
                    <div className="text-stone-600">{order.customer?.email}</div>
                    {order.userEmail && order.userEmail !== order.customer?.email && (
                      <div className="text-stone-500 text-[11px]">ACCOUNT: {order.userEmail}</div>
                    )}
                  </div>

                  <div className="md:col-span-6 p-4 space-y-1">
                    <span className="font-bold text-[#FF4500] uppercase block">// DESTINATION ADDRESS</span>
                    <div className="text-[#1B1C1A]">{order.customer?.address}</div>
                    <div className="text-stone-600">
                      {order.customer?.city}, {order.customer?.postalCode} · {order.customer?.country}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-[#1B1C1A] bg-[#FAF9F5]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-12 border border-[#1B1C1A] bg-[#111211] flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline text-base text-[#1B1C1A] truncate">{item.name}</div>
                          <div className="font-mono text-xs text-stone-500">
                            SIZE: <span className="font-bold text-[#1B1C1A]">{item.size}</span> · ×{item.quantity} · ${item.price} each
                          </div>
                        </div>
                      </div>

                      <div className="font-headline text-base text-[#1B1C1A] font-bold flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer Totals */}
                <div className="p-4 border-t border-[#1B1C1A] bg-[#EFEEEA] flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <div className="flex items-center gap-4 text-stone-600">
                    <span>SUBTOTAL: ${order.subtotal?.toFixed(2) || '0.00'}</span>
                    {order.discount > 0 && (
                      <span className="text-emerald-700 font-bold">
                        DISCOUNT: -${order.discount.toFixed(2)} ({order.promoCode})
                      </span>
                    )}
                    <span>SHIPPING: ${order.shipping?.toFixed(2) || '0.00'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-stone-600 font-bold uppercase">TOTAL CHARGED:</span>
                    <span className="font-headline text-lg text-[#1B1C1A] font-bold">
                      ${order.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
