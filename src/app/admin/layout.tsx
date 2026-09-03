'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Package, ShoppingCart, LayoutDashboard, ArrowLeft, Loader2, Tag, TrendingUp } from 'lucide-react';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[85vh] bg-[#FAF9F5] flex flex-col items-center justify-center space-y-4 p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4500]" />
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A]">
          // VERIFYING ADMIN PRIVILEGES...
        </div>
      </div>
    );
  }

  // Access denied for guests or non-admin accounts
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[85vh] bg-[#FAF9F5] flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full border border-[#1B1C1A] bg-[#EFEEEA] p-8 sm:p-10 shadow-[6px_6px_0px_0px_#1B1C1A] space-y-6 text-center">
          <div className="w-16 h-16 bg-[#FF4500] text-white flex items-center justify-center border border-[#1B1C1A] mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // SECURITY PROTOCOL 403
            </span>
            <h1 className="font-headline text-4xl text-[#1B1C1A]">ACCESS RESTRICTED</h1>
            <p className="font-body text-sm text-[#5D4038]">
              You must be authenticated with an administrative archive identity to access this terminal.
            </p>
          </div>
          <div className="font-mono text-xs bg-[#FAF9F5] border border-[#1B1C1A] p-3 text-stone-600">
            CURRENT IDENTITY: {user ? `${user.email} [${user.role.toUpperCase()}]` : 'GUEST // UNAUTHENTICATED'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/account"
              className="btn-brutalist-yellow text-xs py-3.5 px-4 font-headline tracking-wider text-center"
            >
              AUTHENTICATE ACCOUNT
            </Link>
            <Link
              href="/shop"
              className="font-headline text-xs py-3.5 px-4 border border-[#1B1C1A] bg-[#FAF9F5] text-[#1B1C1A] hover:bg-black hover:text-white transition-colors text-center tracking-wider"
            >
              RETURN TO SHOP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'OVERVIEW', href: '/admin', icon: LayoutDashboard },
    { label: 'PRODUCTS & INVENTORY', href: '/admin/products', icon: Package },
    { label: 'ORDERS & FULFILLMENT', href: '/admin/orders', icon: ShoppingCart },
    { label: 'PROMO CODES', href: '/admin/promos', icon: Tag },
    { label: 'ANALYTICS', href: '/admin/analytics', icon: TrendingUp },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] min-h-[90vh]">
      {/* Admin Top Status Bar */}
      <div className="w-full bg-[#1B1C1A] text-white border-b border-[#1B1C1A] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="bg-[#FF4500] text-white font-bold px-2 py-0.5 border border-white/20 uppercase tracking-widest">
            ROOT // ADMIN
          </span>
          <span className="hidden sm:inline text-stone-300">
            OPERATOR: <span className="font-bold text-white">{user.name}</span> ({user.email})
          </span>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-stone-300 hover:text-[#FCD400] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>EXIT TO STOREFRONT</span>
        </Link>
      </div>

      {/* Admin Navigation Strip */}
      <div className="w-full border-b border-[#1B1C1A] bg-[#EFEEEA] px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-stretch">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`py-4 px-5 border-r border-[#1B1C1A] font-headline text-sm tracking-wider flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'bg-[#FF4500] text-white font-bold'
                    : 'bg-transparent text-[#1B1C1A] hover:bg-[#FAF9F5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block font-mono text-xs text-stone-500 py-2">
          SYSTEM HEALTH: <span className="text-emerald-700 font-bold">ONLINE</span> // MONGO ACTIVE
        </div>
      </div>

      {/* Main Admin View Content */}
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
