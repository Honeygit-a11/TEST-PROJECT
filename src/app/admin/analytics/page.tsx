'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Tag, 
  Package, 
  Loader2, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

interface AnalyticsData {
  metrics: {
    grossRevenue: number;
    netSubtotal: number;
    totalDiscounts: number;
    averageOrderValue: number;
    totalOrders: number;
    validOrdersCount: number;
    totalUnitsShipped: number;
  };
  statusCounts: Record<string, number>;
  categoryPerformance: Record<string, { units: number; revenue: number }>;
  topArtifacts: Array<{
    id: string;
    name: string;
    sku: string;
    image: string;
    unitsSold: number;
    revenue: number;
  }>;
  recentLedger: Array<{
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    discount: number;
    status: string;
    itemsCount: number;
    createdAt: string;
  }>;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FCD400] text-[#1B1C1A]',
  paid: 'bg-[#1B1C1A] text-white',
  shipped: 'bg-[#FF4500] text-white',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-stone-300 text-stone-600 line-through',
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-16 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A] flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#FF4500]" />
        <span>COMPUTING ARCHIVE REVENUE TELEMETRY...</span>
      </div>
    );
  }

  const { metrics, statusCounts, categoryPerformance, topArtifacts, recentLedger } = data;

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1B1C1A] pb-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // TELEMETRY REVENUE ENGINE
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">ANALYTICS & LEDGER</h1>
        </div>

        <button
          onClick={fetchAnalytics}
          className="font-mono text-xs border border-[#1B1C1A] bg-[#EFEEEA] px-4 py-2 font-bold hover:bg-[#1B1C1A] hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RECALCULATE TELEMETRY</span>
        </button>
      </div>

      {/* Primary Financial Metric Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">GROSS REVENUE</span>
            <DollarSign className="w-4 h-4 text-[#FF4500]" />
          </div>
          <div className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">
            ${metrics.grossRevenue.toFixed(2)}
          </div>
          <div className="font-mono text-[11px] text-stone-500">
            Across {metrics.validOrdersCount} fulfilled orders
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">AVERAGE ORDER (AOV)</span>
            <TrendingUp className="w-4 h-4 text-[#FCD400]" />
          </div>
          <div className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">
            ${metrics.averageOrderValue.toFixed(2)}
          </div>
          <div className="font-mono text-[11px] text-stone-500">Average ticket size per checkout</div>
        </div>

        {/* Promo Discounts Awarded */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">DISCOUNTS APPLIED</span>
            <Tag className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-headline text-4xl sm:text-5xl text-emerald-800">
            -${metrics.totalDiscounts.toFixed(2)}
          </div>
          <div className="font-mono text-[11px] text-stone-500">Total customer savings via codes</div>
        </div>

        {/* Total Units Shipped */}
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-2">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">UNITS DISPATCHED</span>
            <Package className="w-4 h-4 text-[#1B1C1A]" />
          </div>
          <div className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">
            {metrics.totalUnitsShipped}
          </div>
          <div className="font-mono text-[11px] text-stone-500">Total physical garments sold</div>
        </div>
      </div>

      {/* Middle Row: Fulfillment Pipeline & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fulfillment Status Matrix (5 Cols) */}
        <div className="lg:col-span-5 border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-4">
          <div className="flex justify-between items-center border-b border-[#1B1C1A] pb-3">
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // DISPATCH PIPELINE
            </span>
            <Link href="/admin/orders" className="font-mono text-xs font-bold text-[#1B1C1A] hover:underline">
              MANAGE ORDERS →
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { label: 'PENDING PROCESSING', key: 'pending', color: '#FCD400' },
              { label: 'PAYMENT VERIFIED', key: 'paid', color: '#1B1C1A' },
              { label: 'DISPATCHED IN TRANSIT', key: 'shipped', color: '#FF4500' },
              { label: 'DELIVERED TO BUYER', key: 'delivered', color: '#16a34a' },
              { label: 'TRANSACTIONS CANCELLED', key: 'cancelled', color: '#a8a29e' },
            ].map((st) => {
              const count = statusCounts[st.key] || 0;
              return (
                <div
                  key={st.key}
                  className="p-3 bg-[#FAF9F5] border border-[#1B1C1A] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-[#1B1C1A]" style={{ backgroundColor: st.color }} />
                    <span className="font-bold uppercase">{st.label}</span>
                  </div>
                  <span className="font-headline text-lg text-[#1B1C1A]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Performance & Revenue Volume (7 Cols) */}
        <div className="lg:col-span-7 border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-4">
          <div className="flex justify-between items-center border-b border-[#1B1C1A] pb-3">
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // CATEGORY SALES VELOCITY
            </span>
            <span className="font-mono text-[11px] text-stone-500">SHARE OF REVENUE</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {Object.entries(categoryPerformance).map(([cat, val]) => {
              const percent = metrics.grossRevenue > 0 ? Math.round((val.revenue / metrics.grossRevenue) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="uppercase">{cat}</span>
                    <span>
                      ${val.revenue.toFixed(2)} ({val.units} units · {percent}%)
                    </span>
                  </div>
                  <div className="bg-[#FAF9F5] border border-[#1B1C1A] h-4 overflow-hidden">
                    <div
                      className="bg-[#FF4500] h-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Best-Selling Artifacts Leaderboard */}
      {topArtifacts.length > 0 && (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A] p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#1B1C1A] pb-3">
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // BEST-SELLING ARTIFACTS LEADERBOARD
            </span>
            <Link href="/admin/products" className="font-mono text-xs font-bold text-[#1B1C1A] hover:underline">
              INVENTORY CONTROLS →
            </Link>
          </div>

          <div className="divide-y divide-[#1B1C1A] bg-[#FAF9F5] border border-[#1B1C1A] font-mono text-xs">
            {topArtifacts.map((art, idx) => (
              <div key={art.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-headline text-xl text-stone-400 w-6">0{idx + 1}</span>
                  {art.image && (
                    <div className="relative w-12 h-12 border border-[#1B1C1A] bg-[#111211] flex-shrink-0">
                      <Image src={art.image} alt={art.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-headline text-base text-[#1B1C1A] truncate">{art.name}</div>
                    <div className="font-mono text-[10px] text-stone-500">{art.sku}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="font-bold text-[#1B1C1A]">{art.unitsSold} UNITS SOLD</div>
                    <div className="text-[#FF4500] font-bold">${art.revenue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Ledger */}
      {recentLedger.length > 0 && (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A] p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#1B1C1A] pb-3">
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // FINANCIAL AUDIT LEDGER (RECENT 10)
            </span>
            <span className="font-mono text-[11px] text-stone-500">LIVE TRANSACTION RECORD</span>
          </div>

          <div className="border border-[#1B1C1A] bg-[#FAF9F5] overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1B1C1A] bg-[#1B1C1A] text-white">
                  <th className="p-3 uppercase">Order ID</th>
                  <th className="p-3 uppercase">Customer</th>
                  <th className="p-3 uppercase">Date</th>
                  <th className="p-3 uppercase">Items</th>
                  <th className="p-3 uppercase">Total Charged</th>
                  <th className="p-3 uppercase">Status</th>
                  <th className="p-3 uppercase text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1C1A]">
                {recentLedger.map((ord) => (
                  <tr key={ord.orderNumber} className="hover:bg-[#F4F4F0] transition-colors">
                    <td className="p-3 font-bold">{ord.orderNumber}</td>
                    <td className="p-3">{ord.customerName}</td>
                    <td className="p-3 text-stone-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3">{ord.itemsCount} units</td>
                    <td className="p-3 font-bold text-sm">${ord.total.toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 font-bold uppercase text-[10px] border border-[#1B1C1A] ${
                          STATUS_STYLES[ord.status.toLowerCase()] || 'bg-stone-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        className="p-1.5 border border-[#1B1C1A] bg-[#FAF9F5] hover:bg-[#FCD400] inline-flex items-center transition-colors"
                        title="View Public Order Receipt"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
