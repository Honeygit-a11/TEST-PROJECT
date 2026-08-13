'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

const ARTICLES = [
  {
    id: 'brutalism-garments',
    title: 'THE ARCHITECTURE OF HEAVYWEIGHT COTTON: WHY 300 GSM MATTERS',
    date: 'AUG 12, 2026',
    readTime: '6 MIN READ',
    author: 'EDITORIAL TEAM',
    category: 'MATERIALS',
    excerpt: 'An investigation into fabric density, structural drape, and why light cottons fail to hold form in modern brutalist streetwear silhouettes.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'permanent-curation',
    title: 'REJECTING FAST CYCLES: THE PERMANENT ARCHIVE MANIFESTO',
    date: 'JUL 28, 2026',
    readTime: '8 MIN READ',
    author: 'CURATOR 01',
    category: 'MANIFESTO',
    excerpt: 'Why seasonal drops are obsolete and how permanent design tokens guarantee timeless garment longevity.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'concrete-concrete',
    title: 'CONCRETE & COTTON: INDUSTRIAL SPACES THAT INSPIRED DROP 01',
    date: 'JUL 14, 2026',
    readTime: '4 MIN READ',
    author: 'ARCHITECTURAL DIVISION',
    category: 'DESIGN SPECS',
    excerpt: 'A photo essay pairing brutalist architecture landmarks across Europe with cut and sew patterns.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop'
  }
];

export default function JournalPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-8 sm:p-12 border-b-grid bg-[var(--bg-container)] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-widest block">
            // UNDERGROUND PUBLICATION
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl">NEO-ARCHIVE JOURNAL</h1>
        </div>

        <div className="font-mono text-xs bg-[var(--text-ink)] text-white px-3 py-1.5 border-grid">
          ISSUE 01 // 2026
        </div>
      </div>

      {/* Main Featured Article */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b-grid bg-[var(--bg-surface)] items-stretch">
        <div className="lg:col-span-7 relative min-h-[450px] border-b lg:border-b-0 lg:border-r-grid">
          <Image
            src={ARTICLES[0].image}
            alt={ARTICLES[0].title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-[var(--brand-yellow)] text-black font-mono text-xs px-3 py-1 border-grid font-bold">
            FEATURED ARTICLE
          </div>
        </div>

        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between font-mono text-xs text-[var(--brand-primary)]">
              <span>// {ARTICLES[0].category}</span>
              <span className="flex items-center gap-1 text-stone-500">
                <Clock className="w-3 h-3" /> {ARTICLES[0].readTime}
              </span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl leading-tight">
              {ARTICLES[0].title}
            </h2>
            <p className="font-body text-base text-[var(--text-muted)] leading-relaxed">
              {ARTICLES[0].excerpt}
            </p>
          </div>

          <button className="btn-brutalist-yellow text-base py-4 flex items-center justify-between">
            <span>READ FULL ESSAY</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--brand-border)]">
        {ARTICLES.slice(1).map((article) => (
          <div key={article.id} className="p-8 border-b border-grid bg-[var(--bg-surface)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="relative aspect-[16/9] w-full border-grid bg-stone-200 overflow-hidden mb-4">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
              </div>

              <div className="flex justify-between font-mono text-xs text-[var(--brand-primary)]">
                <span>// {article.category}</span>
                <span className="text-stone-500">{article.date}</span>
              </div>

              <h3 className="font-headline text-2xl sm:text-3xl text-[var(--text-ink)]">
                {article.title}
              </h3>
              <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <button className="btn-brutalist text-sm py-3 flex items-center justify-between">
              <span>READ ESSAY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
