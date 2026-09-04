'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'footer' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({
          message: data.message || 'ACCESS GRANTED // YOU ARE ON THE PRIORITY LIST',
          success: true,
        });
        setEmail('');
      } else {
        const errorMsg =
          typeof data.error === 'object' && data.error?.message
            ? data.error.message
            : 'FAILED TO REGISTER IDENTITY';
        setFeedback({ message: errorMsg, success: false });
      }
    } catch {
      setFeedback({ message: 'NETWORK ERROR // CANNOT ACCESS PROTOCOL', success: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-[var(--text-ink)] text-[var(--bg-surface)] border-t-grid">
      {/* Upper Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--bg-surface-low)]/20">
        {/* Col 1: Newsletter */}
        <div className="md:col-span-5 p-6 md:p-10 border-b md:border-b-0 md:border-r border-[var(--bg-surface-low)]/20 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-headline text-3xl md:text-4xl text-[var(--brand-yellow)] mb-3">
              JOIN THE ARCHIVE
            </h3>
            <p className="font-body text-sm md:text-base text-stone-300 max-w-md">
              Receive raw technical notifications for limited drops, capsule releases, and architectural manifestos. No spam. Only artifacts.
            </p>
          </div>

          <div className="space-y-2">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL ADDRESS..."
                className="flex-1 bg-[var(--bg-surface)] text-[var(--text-ink)] font-mono text-xs p-3.5 border border-stone-800 outline-none uppercase placeholder:text-stone-500"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-brutalist-yellow font-headline px-6 py-3.5 text-sm uppercase flex items-center justify-center gap-2"
              >
                {submitting ? 'CONNECTING...' : 'SUBSCRIBE'}
              </button>
            </form>

            {feedback && (
              <div
                className={`font-mono text-xs p-2.5 border font-bold ${
                  feedback.success
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600'
                    : 'bg-red-950/80 text-red-400 border-red-600'
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="md:col-span-4 p-6 md:p-10 border-b md:border-b-0 md:border-r border-[var(--bg-surface-low)]/20 grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-widest mb-4">
              // CATALOG
            </h4>
            <ul className="space-y-2 font-headline text-base tracking-wider">
              <li><Link href="/shop" className="hover:text-[var(--brand-yellow)] transition-colors">ALL DROPS</Link></li>
              <li><Link href="/shop?category=T-SHIRTS" className="hover:text-[var(--brand-yellow)] transition-colors">T-SHIRTS</Link></li>
              <li><Link href="/shop?category=OUTERWEAR" className="hover:text-[var(--brand-yellow)] transition-colors">OUTERWEAR</Link></li>
              <li><Link href="/shop?category=ACCESSORIES" className="hover:text-[var(--brand-yellow)] transition-colors">ACCESSORIES</Link></li>
              <li><Link href="/shop?category=PANTS" className="hover:text-[var(--brand-yellow)] transition-colors">PANTS</Link></li>
              <li><Link href="/collections" className="hover:text-[var(--brand-yellow)] transition-colors">COLLECTIONS</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-widest mb-4">
              // SYSTEM
            </h4>
            <ul className="space-y-2 font-headline text-base tracking-wider">
              <li><Link href="/lookbook" className="hover:text-[var(--brand-yellow)] transition-colors">LOOKBOOK</Link></li>
              <li><Link href="/journal" className="hover:text-[var(--brand-yellow)] transition-colors">JOURNAL</Link></li>
              <li><Link href="/about" className="hover:text-[var(--brand-yellow)] transition-colors">MANIFESTO</Link></li>
              <li><Link href="/bag" className="hover:text-[var(--brand-yellow)] transition-colors">YOUR BAG</Link></li>
            </ul>
          </div>
        </div>

        {/* Col 3: Specifications */}
        <div className="md:col-span-3 p-6 md:p-10 flex flex-col justify-between font-mono text-xs space-y-4">
          <div>
            <h4 className="text-[var(--brand-primary)] uppercase tracking-widest mb-3">
              // SPECIFICATIONS
            </h4>
            <p className="text-stone-400 leading-relaxed">
              NEO-ARCHIVE HQ<br />
              HIGH-FIDELITY BRUTALIST STUDIO<br />
              EST. 2026 // SYSTEM V.1.0<br />
              GLOBAL DISTRO CENTER
            </p>
          </div>

          <div className="pt-4 border-t border-stone-800">
            <span className="text-[var(--brand-yellow)]">STATUS: ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Lower Copyright Strip */}
      <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center font-mono text-xs text-stone-400 gap-2">
        <div>
          © 2026 NEO-ARCHIVE. ALL RIGHTS RESERVED. HIGH-FIDELITY BRUTALISM.
        </div>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">TERMS OF SYSTEM</span>
          <span className="hover:text-white cursor-pointer">PRIVACY PROTOCOL</span>
          <span className="hover:text-white cursor-pointer">SHIPPING SPECS</span>
        </div>
      </div>
    </footer>
  );
};
