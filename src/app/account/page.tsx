'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, UserPlus, LogOut, User, Loader2, Package } from 'lucide-react';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface OrderView {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { name: string; image: string; size: string; price: number; quantity: number }[];
}

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
};

// Status badge colours, kept within the account page's hardcoded-hex palette.
const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FCD400] text-[#1B1C1A]',
  paid: 'bg-[#1B1C1A] text-white',
  shipped: 'bg-[#FF4500] text-white',
  delivered: 'bg-green-600 text-white',
  cancelled: 'bg-stone-300 text-stone-600 line-through',
};

function formatOrderDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function AccountPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check existing session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user ?? null))
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const switchMode = (next: 'LOGIN' | 'REGISTER') => {
    setMode(next);
    setError('');
    setForm({ ...EMPTY_FORM });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('// ERROR: EMAIL AND PASSWORD ARE REQUIRED');
      return;
    }
    if (mode === 'REGISTER' && !form.name.trim()) {
      setError('// ERROR: NAME IS REQUIRED');
      return;
    }
    if (mode === 'REGISTER' && form.password.length < 6) {
      setError('// ERROR: PASSWORD MUST BE AT LEAST 6 CHARACTERS');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = mode === 'LOGIN' ? '/api/auth/login' : '/api/auth/register';
      const body =
        mode === 'LOGIN'
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      setUser(meData.user ?? null);
      setForm({ ...EMPTY_FORM });
    } catch (err) {
      setError(err instanceof Error ? `// ${err.message.toUpperCase()}` : '// REQUEST FAILED');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setUser(null);
  };

  return (
    <div className="w-full bg-[#FAF9F5] min-h-[80vh]">
      {/* Header Strip */}
      <div className="p-6 sm:p-10 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // USER ACCESS TERMINAL
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl tracking-tight text-[#1B1C1A] leading-none">
            {user ? `HELLO, ${user.name.toUpperCase()}.` : 'ACCOUNT ACCESS.'}
          </h1>
        </div>
        <div className="font-mono text-xs bg-[#1B1C1A] text-white px-3 py-1.5 font-bold tracking-widest self-start md:self-end">
          {user ? `STATUS: AUTHORIZED // ${user.role.toUpperCase()}` : 'STATUS: GUEST'}
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6 sm:p-10">
        {checkingSession ? (
          <div className="p-16 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A]">
            CHECKING SESSION...
          </div>
        ) : user ? (
          /* ---------- LOGGED IN STATE ---------- */
          <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A]">
            <div className="p-6 border-b border-[#1B1C1A] flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FF4500] text-white flex items-center justify-center border border-[#1B1C1A]">
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="font-headline text-2xl text-[#1B1C1A]">{user.name}</div>
                <div className="font-mono text-xs text-stone-500">{user.email}</div>
              </div>
            </div>
            <div className="p-6 space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-stone-300 pb-2">
                <span className="text-stone-600">USER ID:</span>
                <span className="font-bold">{user.id}</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-2">
                <span className="text-stone-600">ROLE:</span>
                <span className="font-bold uppercase">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">MEMBER STATUS:</span>
                <span className="font-bold text-[#FF4500]">ACTIVE</span>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/shop"
                  className="btn-brutalist-yellow text-sm py-4 px-6 text-center font-headline tracking-wider"
                >
                  CONTINUE SHOPPING
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-headline text-sm py-4 px-6 border border-[#1B1C1A] bg-[#FAF9F5] text-[#1B1C1A] hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 tracking-wider"
                >
                  <LogOut className="w-4 h-4" /> LOG OUT
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ---------- LOGIN / REGISTER FORM ---------- */
          <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A]">
            {/* Mode Tabs */}
            <div className="grid grid-cols-2 border-b border-[#1B1C1A]">
              <button
                onClick={() => switchMode('LOGIN')}
                className={`py-4 font-headline tracking-wider transition-colors ${
                  mode === 'LOGIN'
                    ? 'bg-[#FF4500] text-white'
                    : 'bg-[#EFEEEA] text-[#1B1C1A] hover:bg-[#FCD400]'
                }`}
              >
                SIGN IN
              </button>
              <button
                onClick={() => switchMode('REGISTER')}
                className={`py-4 font-headline tracking-wider transition-colors ${
                  mode === 'REGISTER'
                    ? 'bg-[#FF4500] text-white'
                    : 'bg-[#EFEEEA] text-[#1B1C1A] hover:bg-[#FCD400]'
                }`}
              >
                SIGN UP
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
              <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
                {mode === 'LOGIN' ? '// AUTHENTICATE TO CONTINUE' : '// CREATE NEW ARCHIVE IDENTITY'}
              </span>

              {mode === 'REGISTER' && (
                <div className="space-y-1">
                  <label className="font-mono text-xs font-bold text-[#1B1C1A] block">FULL NAME:</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="ENTER FULL NAME..."
                    className="w-full bg-[#FAF9F5] font-mono text-sm p-3.5 border border-[#1B1C1A] outline-none focus:border-[#FF4500]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-[#1B1C1A] block">EMAIL:</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="ENTER EMAIL..."
                  className="w-full bg-[#FAF9F5] font-mono text-sm p-3.5 border border-[#1B1C1A] outline-none focus:border-[#FF4500]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-[#1B1C1A] block">PASSWORD:</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder={mode === 'REGISTER' ? 'MIN 6 CHARACTERS...' : 'ENTER PASSWORD...'}
                  className="w-full bg-[#FAF9F5] font-mono text-sm p-3.5 border border-[#1B1C1A] outline-none focus:border-[#FF4500]"
                />
              </div>

              {error && (
                <div className="font-mono text-xs font-bold text-red-600 bg-red-50 border border-red-600 p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 font-headline text-lg tracking-wider border border-[#1B1C1A] flex items-center justify-center gap-3 transition-all ${
                  submitting
                    ? 'bg-stone-400 text-white cursor-not-allowed'
                    : 'bg-[#FCD400] text-[#1B1C1A] hover:bg-[#1B1C1A] hover:text-[#FCD400] shadow-[3px_3px_0px_0px_#1B1C1A]'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : mode === 'LOGIN' ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>SIGN IN</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>CREATE ACCOUNT</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
