'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2, Mail, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  source: string;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [meta, setMeta] = useState<{ total: number; activeCount: number }>({ total: 0, activeCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = async (query = '') => {
    setLoading(true);
    try {
      const endpoint = query
        ? `/api/admin/subscribers?q=${encodeURIComponent(query)}`
        : '/api/admin/subscribers';
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setMeta(data.meta || { total: 0, activeCount: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers(search);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove ${email} from priority drop audience?`)) return;
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        setMeta((prev) => ({
          total: Math.max(0, prev.total - 1),
          activeCount: Math.max(0, prev.activeCount - 1),
        }));
      } else {
        alert('Failed to delete subscriber');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1B1C1A] pb-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // AUDIENCE & DROP ENGINE
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">VIP SUBSCRIBERS</h1>
        </div>

        <button
          onClick={() => {
            setSearch('');
            fetchSubscribers('');
          }}
          className="font-mono text-xs border border-[#1B1C1A] bg-[#EFEEEA] px-4 py-2 font-bold hover:bg-[#1B1C1A] hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH AUDIENCE</span>
        </button>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-1">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">TOTAL REGISTERED IN DATABASE</span>
            <Users className="w-4 h-4 text-[#FF4500]" />
          </div>
          <div className="font-headline text-5xl text-[#1B1C1A]">{meta.total}</div>
          <div className="font-mono text-[11px] text-stone-500">Underground drop identities captured</div>
        </div>

        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-1">
          <div className="flex items-center justify-between text-stone-600">
            <span className="font-mono text-xs font-bold uppercase">ACTIVE DISPATCH AUDIENCE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-headline text-5xl text-emerald-800">{meta.activeCount}</div>
          <div className="font-mono text-[11px] text-stone-500">Eligible for SMS/Email priority drop links</div>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER BY EMAIL ADDRESS..."
            className="w-full bg-[#EFEEEA] border border-[#1B1C1A] pl-10 pr-3 py-3 outline-none"
          />
        </div>
        <button type="submit" className="btn-brutalist-yellow px-6 text-xs font-headline tracking-wider">
          SEARCH
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              fetchSubscribers('');
            }}
            className="border border-[#1B1C1A] bg-[#FAF9F5] px-4 font-mono text-xs font-bold hover:bg-stone-200"
          >
            CLEAR
          </button>
        )}
      </form>

      {/* Subscribers Table */}
      {loading ? (
        <div className="p-16 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF4500]" />
          <span>QUERYING SUBSCRIBER AUDIENCE...</span>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-12 text-center space-y-2">
          <Mail className="w-10 h-10 text-stone-400 mx-auto" />
          <div className="font-headline text-2xl text-[#1B1C1A]">NO SUBSCRIBERS FOUND</div>
          <p className="font-mono text-xs text-stone-500">
            {search ? `No subscriber matched "${search}".` : 'No subscribers in database yet.'}
          </p>
        </div>
      ) : (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A] overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1B1C1A] bg-[#1B1C1A] text-white">
                <th className="p-3.5 uppercase">Subscriber Email</th>
                <th className="p-3.5 uppercase">Status</th>
                <th className="p-3.5 uppercase">Capture Source</th>
                <th className="p-3.5 uppercase">Registered Date</th>
                <th className="p-3.5 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B1C1A] bg-[#FAF9F5]">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#F4F4F0] transition-colors">
                  <td className="p-3.5 font-bold text-sm text-[#1B1C1A]">{sub.email}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 font-bold text-[10px] border border-[#1B1C1A] ${
                        sub.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600 line-through'
                      }`}
                    >
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 uppercase text-stone-600">[{sub.source}]</td>
                  <td className="p-3.5 text-stone-500">
                    {new Date(sub.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(sub.id, sub.email)}
                      className="p-2 border border-[#1B1C1A] bg-[#FAF9F5] text-red-600 hover:bg-red-600 hover:text-white transition-colors inline-flex items-center"
                      title="Remove Subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
