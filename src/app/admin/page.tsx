'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ShoppingBag, AlertTriangle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
  image: string;
}

interface OrderItem {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(Array.isArray(prodData) ? prodData : []);
      }

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(Array.isArray(orderData) ? orderData : []);
      }
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockProducts = products.filter((p) => (p.stock ?? 25) < 5 || !p.inStock);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const paidOrders = orders.filter((o) => o.status === 'paid');

  if (loading) {
    return (
      <div className="p-16 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A] flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#FF4500]" />
        <span>CALCULATING TELEMETRY & INVENTORY...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1B1C1A] pb-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // COMMAND TELEMETRY
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">ADMIN OVERVIEW</h1>
        </div>
        <button
          onClick={fetchData}
          className="font-mono text-xs border border-[#1B1C1A] bg-[#EFEEEA] px-4 py-2 font-bold hover:bg-[#1B1C1A] hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH DATA</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">CATALOG ITEMS</span>
            <Package className="w-4 h-4 text-[#FF4500]" />
          </div>
          <div className="font-headline text-4xl text-[#1B1C1A]">{products.length}</div>
          <div className="font-mono text-[11px] text-stone-500">Live products in database</div>
        </div>

        {/* Total Warehouse Units */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">TOTAL UNITS</span>
            <span className="font-mono text-xs font-bold text-[#FF4500]">QTY</span>
          </div>
          <div className="font-headline text-4xl text-[#1B1C1A]">{totalStock}</div>
          <div className="font-mono text-[11px] text-stone-500">Warehouse inventory count</div>
        </div>

        {/* Low Stock Alert */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">LOW STOCK ALERTS</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-red-600 animate-pulse' : 'text-stone-400'}`} />
          </div>
          <div className={`font-headline text-4xl ${lowStockProducts.length > 0 ? 'text-red-600' : 'text-[#1B1C1A]'}`}>
            {lowStockProducts.length}
          </div>
          <div className="font-mono text-[11px] text-stone-500">Items below 5 units threshold</div>
        </div>

        {/* Active Orders */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">PENDING FULFILLMENT</span>
            <ShoppingBag className="w-4 h-4 text-[#FCD400]" />
          </div>
          <div className="font-headline text-4xl text-[#1B1C1A]">{pendingOrders.length + paidOrders.length}</div>
          <div className="font-mono text-[11px] text-stone-500">
            {pendingOrders.length} Pending / {paidOrders.length} Paid
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/products"
          className="border border-[#1B1C1A] bg-[#FAF9F5] p-6 sm:p-8 hover:bg-[#FCD400] transition-colors group shadow-[4px_4px_0px_0px_#1B1C1A] flex justify-between items-center"
        >
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#FF4500] font-bold block">// INVENTORY TERMINAL</span>
            <h2 className="font-headline text-3xl text-[#1B1C1A]">MANAGE PRODUCTS & STOCK</h2>
            <p className="font-body text-sm text-[#5D4038]">
              Create new artifacts, update stock counts, and edit product pricing.
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-[#1B1C1A] group-hover:translate-x-2 transition-transform flex-shrink-0 ml-4" />
        </Link>

        <Link
          href="/admin/orders"
          className="border border-[#1B1C1A] bg-[#FAF9F5] p-6 sm:p-8 hover:bg-[#FCD400] transition-colors group shadow-[4px_4px_0px_0px_#1B1C1A] flex justify-between items-center"
        >
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#FF4500] font-bold block">// DISPATCH TERMINAL</span>
            <h2 className="font-headline text-3xl text-[#1B1C1A]">ORDER FULFILLMENT</h2>
            <p className="font-body text-sm text-[#5D4038]">
              Inspect customer orders, view shipping addresses, and advance fulfillment statuses.
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-[#1B1C1A] group-hover:translate-x-2 transition-transform flex-shrink-0 ml-4" />
        </Link>
      </div>

      {/* Low Stock Items Attention Table */}
      {lowStockProducts.length > 0 && (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A] space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-[#1B1C1A] pb-3">
            <div className="flex items-center gap-2 text-red-600 font-mono text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>CRITICAL INVENTORY ALERT: LOW STOCK ({lowStockProducts.length})</span>
            </div>
            <Link
              href="/admin/products"
              className="font-mono text-xs text-[#FF4500] underline font-bold"
            >
              RESOLVE IN INVENTORY →
            </Link>
          </div>

          <div className="divide-y divide-[#1B1C1A] bg-[#FAF9F5] border border-[#1B1C1A]">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-12 h-12 border border-[#1B1C1A] bg-[#111211] flex-shrink-0">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-[#FF4500] font-bold">{p.sku}</div>
                    <div className="font-headline text-base text-[#1B1C1A] truncate">{p.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs bg-red-100 text-red-700 px-2.5 py-1 border border-red-400 font-bold">
                    REMAINING: {p.stock ?? 0} UNITS
                  </span>
                  <Link
                    href="/admin/products"
                    className="font-headline text-xs px-3 py-1.5 border border-[#1B1C1A] bg-[#FCD400] text-[#1B1C1A] hover:bg-black hover:text-white transition-colors"
                  >
                    RESTOCK
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
