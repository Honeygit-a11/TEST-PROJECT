'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ShoppingBag, Search, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, Product } from '@/data/products';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { name: 'SHOP', href: '/shop' },
    { name: 'COLLECTIONS', href: '/collections' },
    { name: 'LOOKBOOK', href: '/lookbook' },
    { name: 'ABOUT', href: '/about' },
    { name: 'JOURNAL', href: '/journal' },
  ];

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on path change or Escape key
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults: Product[] = searchQuery.trim() === ''
    ? []
    : PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.color.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(`/product/${searchResults[0].id}`);
      setSearchOpen(false);
    } else if (searchQuery.trim()) {
      router.push(`/shop`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-[#FAF9F5] border-b border-[#1B1C1A] sticky top-0 z-50">
      {/* Top Streetwear Brutalist Ticker Bar */}
      <div className="w-full bg-[#1B1C1A] text-[#FAF9F5] px-4 py-1.5 border-b border-[#1B1C1A] font-mono text-[10px] sm:text-xs flex items-center justify-between tracking-widest uppercase select-none">
        <div className="hidden sm:flex items-center gap-2 text-stone-300">
          <span className="text-[#FCD400] font-bold">//</span> FREE SHIP OVER $150
        </div>
        <div className="flex-1 sm:flex-none text-center flex items-center justify-center gap-2">
          <span>DROP #1 /</span>
          <span className="bg-[#FCD400] text-[#1B1C1A] font-bold px-2 py-0.5 border border-black">
            VOL. 001
          </span>
          <span>/ EST. 2024</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-stone-300">
          <span>BUENOS AIRES + WORLDWIDE</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-black hover:text-[#FF4500]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* 1. LEFT / START: Brand Logo (NEO-ARCHIVE) */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center">
            <span className="font-headline text-2xl sm:text-3xl tracking-tight text-[#1B1C1A] group-hover:text-[#FF4500] transition-colors">
              NEO-ARCHIVE
            </span>
          </Link>
        </div>

        {/* 2. CENTER: Main Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-headline text-base lg:text-lg tracking-wider transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#FF4500] font-bold border-b-2 border-[#FF4500]'
                    : 'text-[#1B1C1A] hover:text-[#FF4500]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* 3. RIGHT / END: SEARCH -> ACCOUNT -> BAG */}
        <div className="flex items-center space-x-4 sm:space-x-6 font-headline text-base lg:text-lg tracking-wider">
          {/* SEARCH Button (Before Account and Bag) */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`flex items-center space-x-1.5 transition-colors cursor-pointer py-1 px-2 border ${
              searchOpen
                ? 'bg-[#1B1C1A] text-[#FCD400] border-[#1B1C1A]'
                : 'bg-transparent text-[#1B1C1A] border-transparent hover:border-[#1B1C1A] hover:text-[#FF4500]'
            }`}
            aria-label="Toggle search"
            title="Search products"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline-block">SEARCH</span>
          </button>

          {/* ACCOUNT */}
          <Link
            href="/about"
            className="hidden sm:inline-block text-[#1B1C1A] hover:text-[#FF4500] transition-colors py-1"
          >
            ACCOUNT
          </Link>

          {/* BAG */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 text-[#1B1C1A] hover:text-[#FF4500] transition-colors cursor-pointer group py-1"
          >
            <ShoppingBag className="w-5 h-5 text-[#1B1C1A] group-hover:text-[#FF4500] transition-colors" />
            <span>BAG</span>
            <span className="bg-[#1B1C1A] text-[#FAF9F5] group-hover:bg-[#FF4500] font-mono text-xs px-2 py-0.5 transition-colors border border-black">
              {totalItems}
            </span>
          </button>
        </div>
      </div>

      {/* 4. EXPANDABLE SEARCH BAR AT THE BOTTOM OF HEADER */}
      {searchOpen && (
        <div className="w-full border-t border-[#1B1C1A] bg-[#EFEEEA] shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <div className="relative flex-1 flex items-center bg-[#FAF9F5] border border-[#1B1C1A]">
                <Search className="w-5 h-5 text-stone-500 ml-4 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH ARTIFACTS, STYLES, SKUS, DROP #1..."
                  className="w-full bg-transparent font-mono text-xs sm:text-sm py-3.5 px-3 text-[#1B1C1A] outline-none uppercase placeholder:text-stone-400 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-stone-500 hover:text-black mr-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="btn-brutalist-yellow text-sm py-3.5 px-6 font-headline tracking-wider hidden sm:flex items-center gap-2"
              >
                <span>SEARCH</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-3 border border-[#1B1C1A] bg-[#FAF9F5] text-black hover:bg-[#FF4500] hover:text-white transition-colors"
                title="Close Search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {searchQuery.trim() !== '' && (
              <div className="mt-3 bg-[#FAF9F5] border border-[#1B1C1A] divide-y divide-[#1B1C1A]">
                <div className="p-2.5 bg-[#FAF9F5] font-mono text-[11px] text-stone-500 flex justify-between uppercase">
                  <span>SEARCH RESULTS ({searchResults.length})</span>
                  <span>PRESS ESC TO CLOSE</span>
                </div>

                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="p-3 flex items-center justify-between hover:bg-[#F4F4F0] transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 border border-[#1B1C1A] bg-[#111211] flex-shrink-0 overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] text-[#FF4500] font-bold">
                            {item.sku} // {item.color}
                          </div>
                          <div className="font-headline text-base text-[#1B1C1A] group-hover:text-[#FF4500] transition-colors">
                            {item.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-headline text-lg text-[#1B1C1A]">${item.price.toFixed(2)}</span>
                        <span className="font-mono text-xs text-stone-400 group-hover:text-[#FF4500] group-hover:translate-x-1 transition-all">
                          →
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center font-mono text-xs text-stone-500">
                    NO ARTIFACTS MATCHING &quot;{searchQuery.toUpperCase()}&quot;. TRY BROWSING OUR{' '}
                    <Link href="/shop" onClick={() => setSearchOpen(false)} className="text-[#FF4500] underline font-bold">
                      COLLECTION
                    </Link>
                    .
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1B1C1A] bg-[#FAF9F5] px-6 py-4 flex flex-col space-y-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
            className="font-headline text-xl text-[#1B1C1A] hover:text-[#FF4500] transition-colors flex items-center justify-between py-2 border-b border-stone-200"
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              <span>SEARCH</span>
            </div>
            <span className="font-mono text-sm">→</span>
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-headline text-2xl text-[#1B1C1A] hover:text-[#FF4500] transition-colors flex justify-between items-center py-1 border-b border-stone-200"
            >
              <span>{link.name}</span>
              <span className="font-mono text-sm">→</span>
            </Link>
          ))}
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-headline text-2xl text-[#1B1C1A] hover:text-[#FF4500] transition-colors py-1"
          >
            ACCOUNT
          </Link>
        </div>
      )}
    </header>
  );
};
