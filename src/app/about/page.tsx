'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Cpu, Anchor, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="p-8 sm:p-16 border-b-grid bg-[var(--bg-container)] flex flex-col justify-between space-y-4">
        <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-widest block">
          // ARCHITECTURAL MANIFESTO & PHILOSOPHY
        </span>
        <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl tracking-tight">
          ABOUT NEO-ARCHIVE
        </h1>
        <p className="font-body text-xl sm:text-2xl text-[var(--text-muted)] max-w-3xl leading-relaxed">
          NEO-ARCHIVE exists at the intersection of brutalist architecture and contemporary garment design. We reject traditional fashion cycles in favor of permanent curation.
        </p>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--brand-border)] border-b-grid bg-[var(--bg-surface)]">
        <div className="p-8 space-y-3">
          <Layers className="w-8 h-8 text-[var(--brand-primary)]" />
          <h3 className="font-headline text-2xl">STRUCTURAL HONESTY</h3>
          <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">
            Every seam is exposed and structurally functional. We omit ornamental trims to celebrate the raw weight of heavy textiles.
          </p>
        </div>

        <div className="p-8 space-y-3">
          <Anchor className="w-8 h-8 text-[var(--brand-primary)]" />
          <h3 className="font-headline text-2xl">300+ GSM DENSITY</h3>
          <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">
            All t-shirts and fleece begin at a baseline of 300 GSM to 500 GSM, ensuring garments retain architectural drape over decades.
          </p>
        </div>

        <div className="p-8 space-y-3">
          <ShieldCheck className="w-8 h-8 text-[var(--brand-primary)]" />
          <h3 className="font-headline text-2xl">PERMANENT CURATION</h3>
          <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">
            We do not discount or liquidate collections. Once an archive release is produced, it remains part of our permanent catalog.
          </p>
        </div>

        <div className="p-8 space-y-3">
          <Cpu className="w-8 h-8 text-[var(--brand-primary)]" />
          <h3 className="font-headline text-2xl">DIGITAL SYSTEM</h3>
          <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">
            Every garment features a serialized label mapped directly to our digital design system for authenticity verification.
          </p>
        </div>
      </div>

      {/* Technical Manifesto Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b-grid bg-[var(--brand-yellow)] text-[var(--text-ink)]">
        <div className="lg:col-span-6 p-8 sm:p-16 border-b lg:border-b-0 lg:border-r-grid flex flex-col justify-center">
          <span className="font-mono text-xs uppercase tracking-widest font-bold mb-2">
            // SPECIFICATION SHEET
          </span>
          <h2 className="font-headline text-4xl sm:text-6xl tracking-tight">
            BUILT LIKE A MONUMENT.
          </h2>
        </div>

        <div className="lg:col-span-6 p-8 sm:p-16 flex flex-col justify-center space-y-6">
          <p className="font-body text-xl leading-relaxed">
            Modern SaaS design and fast-fashion have soft-softened the world. NEO-ARCHIVE reclaims architectural honesty: 0px radii, rigid border grids, and heavy-stock tactile materials.
          </p>

          <div className="pt-4 border-t border-[var(--text-ink)]/30 font-mono text-xs flex flex-col space-y-2">
            <span>HEADQUARTERS: BERLIN / TOKYO HUB</span>
            <span>FOUNDED: EST. 2026 // SYSTEM V.1.0</span>
            <span>FOUNDER & CURATOR: HONEY KUMAR</span>
          </div>

          <div>
            <Link href="/shop" className="btn-brutalist-dark text-lg py-4 px-8 inline-flex items-center gap-3">
              <span>EXPLORE PERMANENT CATALOG</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
