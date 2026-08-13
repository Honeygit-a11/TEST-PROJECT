'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'SHOP', href: '/shop' },
    { name: 'COLLECTIONS', href: '/collections' },
    { name: 'LOOKBOOK', href: '/lookbook' },
    { name: 'ABOUT', href: '/about' },
    { name: 'JOURNAL', href: '/journal' },
  ];

  return (
    <header className="w-full bg-[#FAF9F5] border-b border-[#1B1C1A] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-black hover:text-[#AD2C00]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Left: Brand Logo (NEO-ARCHIVE) */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center">
            <span className="font-headline text-2xl sm:text-3xl tracking-tight text-[#1B1C1A] group-hover:text-[#AD2C00] transition-colors">
              NEO-ARCHIVE
            </span>
          </Link>
        </div>

        {/* Center: Main Navigation (SHOP, COLLECTIONS, LOOKBOOK, ABOUT, JOURNAL) */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-headline text-base lg:text-lg tracking-wider transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#AD2C00] font-bold border-b-2 border-[#AD2C00]'
                    : 'text-[#1B1C1A] hover:text-[#AD2C00]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: ACCOUNT & BAG */}
        <div className="flex items-center space-x-6 sm:space-x-8 font-headline text-base lg:text-lg tracking-wider">
          <Link
            href="/about"
            className="hidden sm:inline-block text-[#1B1C1A] hover:text-[#AD2C00] transition-colors"
          >
            ACCOUNT
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 text-[#1B1C1A] hover:text-[#AD2C00] transition-colors cursor-pointer group"
          >
            <ShoppingBag className="w-5 h-5 text-[#1B1C1A] group-hover:text-[#AD2C00] transition-colors" />
            <span>BAG</span>
            <span className="bg-[#1B1C1A] text-[#FAF9F5] group-hover:bg-[#AD2C00] font-mono text-xs px-2 py-0.5 transition-colors">
              {totalItems}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1B1C1A] bg-[#FAF9F5] px-6 py-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-headline text-2xl text-[#1B1C1A] hover:text-[#AD2C00] transition-colors flex justify-between items-center py-1 border-b border-stone-200"
            >
              <span>{link.name}</span>
              <span className="font-mono text-sm">→</span>
            </Link>
          ))}
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-headline text-2xl text-[#1B1C1A] hover:text-[#AD2C00] transition-colors py-1"
          >
            ACCOUNT
          </Link>
        </div>
      )}
    </header>
  );
};
