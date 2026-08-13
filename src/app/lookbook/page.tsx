'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const LOOKBOOK_ENTRIES = [
  {
    id: 1,
    location: 'BERLIN // INDUSTRIAL SITE B',
    garment: 'TS-001 STRUCTURAL TEE + PT-019 CARGO',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-8'
  },
  {
    id: 2,
    location: 'TOKYO // SHIBUYA OVERPASS',
    garment: 'HD-042 ASYMMETRIC HOODIE',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-4'
  },
  {
    id: 3,
    location: 'LONDON // SOUTHBANK BRUTALIST COMPLEX',
    garment: 'JK-088 MODULAR JACKET',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-4'
  },
  {
    id: 4,
    location: 'PARIS // CONCRETE PLAZA',
    garment: 'TS-009 OVERSIZED GRAPHIC TEE',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-8'
  }
];

export default function LookbookPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-8 sm:p-12 border-b-grid bg-[var(--bg-container)] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-widest block">
            // VISUAL DOCUMENTATION
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl">LOOKBOOK 2026</h1>
          <p className="font-body text-xl text-[var(--text-muted)] mt-2">
            "THE STREET IS OUR CANVAS" — FILMED ON LOCATION ACROSS BRUTALIST ARCHITECTURAL SITES.
          </p>
        </div>

        <div className="font-mono text-xs bg-[var(--brand-yellow)] text-[var(--text-ink)] px-3 py-1.5 border-grid font-bold">
          VOLUME 01
        </div>
      </div>

      {/* Editorial Masonry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b-grid divide-y lg:divide-y-0 divide-[var(--brand-border)]">
        {LOOKBOOK_ENTRIES.map((entry) => (
          <div
            key={entry.id}
            className={`${entry.span} relative min-h-[500px] border-grid group overflow-hidden bg-black`}
          >
            <Image
              src={entry.image}
              alt={entry.location}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-10 bg-black text-white font-mono text-xs px-3 py-1 border-grid">
              {entry.location}
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 text-white flex justify-between items-end">
              <div>
                <span className="font-mono text-[10px] text-[var(--brand-yellow)] block">// OUTFIT TAG</span>
                <span className="font-headline text-2xl">{entry.garment}</span>
              </div>
              <Link href="/shop" className="btn-brutalist-yellow p-3 text-xs flex items-center gap-1">
                <span>SHOP LOOK</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
