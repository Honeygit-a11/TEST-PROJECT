'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Check, X, Loader2, RefreshCw, AlertCircle, Calendar, Users } from 'lucide-react';

interface PromoItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotal: number;
  maxUses?: number | null;
  usedCount: number;
  active: boolean;
  expiresAt?: string | null;
  createdAt: string;
}

const EMPTY_PROMO_FORM = {
  code: '',
  discountType: 'percentage' as 'percentage' | 'fixed',
  discountValue: 15,
  minSubtotal: 0,
  maxUses: '' as string | number,
  expiresAt: '',
  active: true,
};

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_PROMO_FORM });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/promos');
      if (res.ok) {
        const data = await res.json();
        setPromos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch promos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/promos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (res.ok) {
        setPromos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, active: !currentActive } : p))
        );
      }
    } catch (err) {
      console.error('Toggle promo error:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeletePromo = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?`)) return;
    try {
      const res = await fetch(`/api/promos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPromos((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete promo code');
      }
    } catch (err) {
      console.error('Delete promo error:', err);
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      const payload: any = {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minSubtotal: Number(form.minSubtotal) || 0,
        active: form.active,
      };

      if (form.maxUses !== '') {
        payload.maxUses = Number(form.maxUses);
      }

      if (form.expiresAt) {
        payload.expiresAt = new Date(form.expiresAt).toISOString();
      }

      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === 'object' && data.error?.message ? data.error.message : (data.error || 'Failed to create promo code');
        throw new Error(msg);
      }

      setModalOpen(false);
      setForm({ ...EMPTY_PROMO_FORM });
      fetchPromos();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Error creating promo code');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1B1C1A] pb-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // DISCOUNT ENGINE
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">PROMOTION CODES</h1>
        </div>

        <button
          onClick={() => {
            setForm({ ...EMPTY_PROMO_FORM });
            setCreateError('');
            setModalOpen(true);
          }}
          className="btn-brutalist-yellow text-xs py-3.5 px-6 font-headline tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE PROMO CAMPAIGN</span>
        </button>
      </div>

      {/* Promos Table */}
      {loading ? (
        <div className="p-16 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF4500]" />
          <span>FETCHING ACTIVE CAMPAIGNS...</span>
        </div>
      ) : promos.length === 0 ? (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-12 text-center space-y-2">
          <Tag className="w-10 h-10 text-stone-400 mx-auto" />
          <div className="font-headline text-2xl text-[#1B1C1A]">NO PROMO CODES ON RECORD</div>
          <p className="font-mono text-xs text-stone-500">
            Create your first archive discount campaign above.
          </p>
        </div>
      ) : (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A] overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1B1C1A] bg-[#1B1C1A] text-white">
                <th className="p-3.5 uppercase">Promo Code</th>
                <th className="p-3.5 uppercase">Discount</th>
                <th className="p-3.5 uppercase">Min Subtotal</th>
                <th className="p-3.5 uppercase">Redemptions</th>
                <th className="p-3.5 uppercase">Expiration</th>
                <th className="p-3.5 uppercase">Status</th>
                <th className="p-3.5 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B1C1A] bg-[#FAF9F5]">
              {promos.map((promo) => {
                const isToggling = togglingId === promo.id;
                const isExpired = promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now();

                return (
                  <tr key={promo.id} className="hover:bg-[#F4F4F0] transition-colors">
                    {/* Code */}
                    <td className="p-3.5">
                      <div className="font-headline text-lg text-[#1B1C1A] tracking-wider">
                        {promo.code}
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="p-3.5 font-bold text-sm">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue ?? 0}% OFF`
                        : `$${(promo.discountValue ?? 0).toFixed(2)} OFF`}
                    </td>

                    {/* Min Subtotal */}
                    <td className="p-3.5">
                      {(promo.minSubtotal ?? 0) > 0
                        ? `$${(promo.minSubtotal ?? 0).toFixed(2)}`
                        : 'NO MINIMUM'}
                    </td>

                    {/* Redemptions / Limits */}
                    <td className="p-3.5">
                      <span className="font-bold text-[#1B1C1A]">{promo.usedCount}</span>
                      {promo.maxUses ? (
                        <span className="text-stone-500"> / {promo.maxUses} USES</span>
                      ) : (
                        <span className="text-stone-400"> (UNLIMITED)</span>
                      )}
                    </td>

                    {/* Expiration */}
                    <td className="p-3.5">
                      {promo.expiresAt ? (
                        <span className={isExpired ? 'text-red-600 font-bold' : 'text-stone-700'}>
                          {new Date(promo.expiresAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                          })}
                          {isExpired && ' [EXPIRED]'}
                        </span>
                      ) : (
                        <span className="text-stone-400">PERMANENT</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="p-3.5">
                      <button
                        disabled={isToggling}
                        onClick={() => handleToggleActive(promo.id, promo.active)}
                        className={`px-2.5 py-1 font-bold text-[10px] border transition-colors ${
                          promo.active && !isExpired
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-600 hover:bg-red-100 hover:text-red-700'
                            : 'bg-stone-200 text-stone-600 border-stone-400 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                        title="Click to toggle status"
                      >
                        {promo.active && !isExpired ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeletePromo(promo.id, promo.code)}
                        className="p-2 border border-[#1B1C1A] bg-[#FAF9F5] text-red-600 hover:bg-red-600 hover:text-white transition-colors inline-flex items-center"
                        title="Delete promo code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Promo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="border border-[#1B1C1A] bg-[#FAF9F5] shadow-[6px_6px_0px_0px_#1B1C1A] max-w-lg w-full p-6 sm:p-8 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-[#1B1C1A] pb-3">
              <div>
                <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
                  // NEW DISCOUNT CAMPAIGN
                </span>
                <h2 className="font-headline text-3xl text-[#1B1C1A]">CREATE PROMO CODE</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 border border-[#1B1C1A] bg-[#EFEEEA] hover:bg-[#FF4500] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 font-mono text-xs">
              {createError && (
                <div className="p-3 bg-red-50 border border-red-600 text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#1B1C1A] block">PROMO CODE STRING:</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER25 or VIPARCHIVE"
                  className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none uppercase font-headline text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">DISCOUNT TYPE:</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none uppercase cursor-pointer"
                  >
                    <option value="percentage">PERCENTAGE (%)</option>
                    <option value="fixed">FIXED AMOUNT ($)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">
                    {form.discountType === 'percentage' ? 'PERCENT (%) OFF:' : 'AMOUNT ($) OFF:'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={form.discountType === 'percentage' ? 100 : undefined}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none text-base font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">MIN ORDER SUBTOTAL ($):</label>
                  <input
                    type="number"
                    min="0"
                    value={form.minSubtotal}
                    onChange={(e) => setForm({ ...form, minSubtotal: Number(e.target.value) })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none"
                    placeholder="0 = No minimum"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">MAX USES LIMIT:</label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1B1C1A] block">EXPIRATION DATE (OPTIONAL):</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none cursor-pointer"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#1B1C1A]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="font-headline text-xs px-5 py-3 border border-[#1B1C1A] bg-[#EFEEEA] hover:bg-black hover:text-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-brutalist-yellow text-xs px-6 py-3 font-headline tracking-wider flex items-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{creating ? 'CREATING...' : 'PUBLISH PROMO'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
