'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS = [
  {
    id: 'archive-v1',
    title: 'ARCHIVE V1 // SYSTEM CORE',
    season: 'SPRING/SUMMER 2026',
    itemsCount: 14,
    description: 'Our foundational release centered on raw cotton weights, geometric panel cuts, and high-density monochrome prints.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-[var(--brand-yellow)] text-[var(--text-ink)]'
  },
  {
    id: 'system-02',
    title: 'SYSTEM-02 // TECHNICAL RIPSTOP',
    season: 'AUTUMN/WINTER 2026',
    itemsCount: 9,
    description: 'Modular outer shells built with Cordura fabrics, tactical Cobra buckles, and weather-resistant sealed seams.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-[var(--brand-primary)] text-white'
  },
  {
    id: 'brutal-line',
    title: 'BRUTAL-LINE // HEAVY FLEECE',
    season: 'PERMANENT CURATION',
    itemsCount: 6,
    description: '500 GSM loopback French terry sweats engineered for maximum drop-shoulder drape and structural stability.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-stone-900 text-white'
  }
];

export default function CollectionsPage() {
  return (
    <div className="w-full">
      {/* Banner */}
      <div className="p-8 sm:p-12 border-b-grid bg-[var(--bg-container)] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-widest block">
            // CAPSULE CATALOGUE
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl">COLLECTIONS OVERVIEW</h1>
        </div>
        <div className="font-mono text-xs bg-[var(--text-ink)] text-white px-3 py-1.5 border-grid">
          3 CAPSULES AVAILABLE
        </div>
      </div>

      {/* Collection Cards List */}
      <div className="divide-y divide-[var(--brand-border)]">
        {COLLECTIONS.map((col, idx) => (
          <div key={col.id} className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh] bg-[var(--bg-surface)] items-stretch">
            {/* Image (Alternating Left/Right) */}
            <div className={`lg:col-span-6 relative aspect-[16/9] lg:aspect-auto border-b lg:border-b-0 ${idx % 2 === 0 ? 'lg:border-r-grid lg:order-1' : 'lg:border-l-grid lg:order-2'}`}>
              <Image src={col.image} alt={col.title} fill className="object-cover" />
              <div className="absolute top-4 left-4 font-mono text-xs bg-black text-white px-3 py-1 border-grid">
                CAPSULE 0{idx + 1}
              </div>
            </div>

            {/* Content */}
            <div className={`lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6 ${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[var(--brand-primary)] font-bold">// {col.season}</span>
                  <span className="bg-stone-200 px-2 py-0.5">{col.itemsCount} ARTIFACTS</span>
                </div>
                <h2 className="font-headline text-4xl sm:text-6xl text-[var(--text-ink)]">
                  {col.title}
                </h2>
                <p className="font-body text-lg text-[var(--text-muted)] leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div>
                <Link href="/shop" className="btn-brutalist text-lg py-4 px-8 flex items-center justify-between group">
                  <span>EXPLORE CAPSULE</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
