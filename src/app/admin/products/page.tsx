'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Search, X, Loader2, Save, AlertCircle } from 'lucide-react';

interface ProductItem {
  id: string;
  index: string;
  sku: string;
  name: string;
  color: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
  image: string;
  images: string[];
  description: string;
  season: string;
  sizes: string[];
}

const EMPTY_PRODUCT_FORM = {
  id: '',
  index: '009',
  sku: 'NX-DROP-01',
  name: '',
  color: 'Black',
  category: 'T-SHIRTS' as const,
  price: 120,
  stock: 25,
  image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
  images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000'],
  description: 'Heavyweight raw cotton garment. Engineered brutalist archive piece.',
  season: 'Drop #1 / Vol. 001',
  details: {
    gsm: '450 GSM',
    fabric: '100% French Terry Cotton',
    fit: 'Boxy Oversized Fit',
    origin: 'Buenos Aires',
    edition: '1 of 50 Permanent Archive',
  },
  sizes: ['S', 'M', 'L', 'XL'],
  inStock: true,
  featured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ ...EMPTY_PRODUCT_FORM });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = async (productId: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    setUpdatingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock: validStock,
          inStock: validStock > 0,
        }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: validStock, inStock: validStock > 0 } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(`Are you sure you want to delete product "${productId}"?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
          inStock: Number(newProduct.stock) > 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === 'object' && data.error?.message ? data.error.message : (data.error || 'Failed to create product');
        throw new Error(msg);
      }

      setModalOpen(false);
      setNewProduct({ ...EMPTY_PRODUCT_FORM, id: `neo-${Date.now().toString().slice(-3)}` });
      fetchProducts();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setCreating(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1B1C1A] pb-4">
        <div>
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            // WAREHOUSE CONTROLS
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A]">PRODUCTS & INVENTORY</h1>
        </div>

        <button
          onClick={() => {
            setNewProduct({ ...EMPTY_PRODUCT_FORM, id: `neo-00${products.length + 1}` });
            setCreateError('');
            setModalOpen(true);
          }}
          className="btn-brutalist-yellow text-xs py-3.5 px-6 font-headline tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW ARTIFACT</span>
        </button>
      </div>

      {/* Filter and Search Strip */}
      <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH BY NAME, SKU, OR ID..."
            className="w-full bg-[#FAF9F5] border border-[#1B1C1A] pl-9 pr-4 py-2.5 font-mono text-xs outline-none focus:border-[#FF4500] uppercase"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-stone-600">CATEGORY:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF9F5] border border-[#1B1C1A] font-mono text-xs font-bold px-3 py-2.5 outline-none uppercase cursor-pointer"
          >
            <option value="ALL">ALL CATEGORIES</option>
            <option value="T-SHIRTS">T-SHIRTS</option>
            <option value="OUTERWEAR">OUTERWEAR</option>
            <option value="PANTS">PANTS</option>
            <option value="ACCESSORIES">ACCESSORIES</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="p-16 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF4500]" />
          <span>FETCHING INVENTORY DATA...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-12 text-center space-y-2">
          <div className="font-headline text-2xl text-[#1B1C1A]">NO ARTIFACTS MATCH SEARCH CRITERIA</div>
          <p className="font-mono text-xs text-stone-500">Adjust query filters or create a new product above.</p>
        </div>
      ) : (
        <div className="border border-[#1B1C1A] bg-[#EFEEEA] shadow-[4px_4px_0px_0px_#1B1C1A] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1B1C1A] bg-[#1B1C1A] text-white font-mono text-xs">
                <th className="p-3.5 uppercase">Product</th>
                <th className="p-3.5 uppercase">Category</th>
                <th className="p-3.5 uppercase">Price</th>
                <th className="p-3.5 uppercase">Stock Control</th>
                <th className="p-3.5 uppercase">Status</th>
                <th className="p-3.5 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B1C1A] font-mono text-xs bg-[#FAF9F5]">
              {filteredProducts.map((product) => {
                const isLow = (product.stock ?? 25) < 5;
                const isUpdating = updatingId === product.id;

                return (
                  <tr key={product.id} className="hover:bg-[#F4F4F0] transition-colors">
                    {/* Product / Thumbnail */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 border border-[#1B1C1A] bg-[#111211] flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline text-base text-[#1B1C1A] leading-tight truncate">
                            {product.name}
                          </div>
                          <div className="font-mono text-[10px] text-stone-500">
                            {product.id} // {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5 font-bold uppercase">{product.category}</td>

                    {/* Price */}
                    <td className="p-3.5 font-bold text-sm">${product.price.toFixed(2)}</td>

                    {/* Stock Control */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isUpdating || (product.stock ?? 25) <= 0}
                          onClick={() => handleStockChange(product.id, (product.stock ?? 25) - 1)}
                          className="w-7 h-7 border border-[#1B1C1A] bg-[#FAF9F5] font-bold hover:bg-[#FF4500] hover:text-white transition-colors disabled:opacity-40"
                          title="Decrease by 1"
                        >
                          -
                        </button>
                        <span
                          className={`font-bold px-2.5 py-1 border min-w-[48px] text-center ${
                            isLow
                              ? 'bg-red-100 text-red-700 border-red-500'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-500'
                          }`}
                        >
                          {product.stock ?? 25}
                        </span>
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStockChange(product.id, (product.stock ?? 25) + 1)}
                          className="w-7 h-7 border border-[#1B1C1A] bg-[#FAF9F5] font-bold hover:bg-[#FCD400] transition-colors"
                          title="Increase by 1"
                        >
                          +
                        </button>
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStockChange(product.id, (product.stock ?? 25) + 10)}
                          className="px-2 py-1 border border-[#1B1C1A] bg-[#EFEEEA] font-mono text-[10px] font-bold hover:bg-black hover:text-white transition-colors"
                          title="Restock +10"
                        >
                          +10
                        </button>
                        {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF4500]" />}
                      </div>
                    </td>

                    {/* In-Stock Status */}
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 border font-bold text-[10px] uppercase ${
                          product.inStock && (product.stock ?? 25) > 0
                            ? 'bg-[#1B1C1A] text-white border-black'
                            : 'bg-red-600 text-white border-red-700'
                        }`}
                      >
                        {product.inStock && (product.stock ?? 25) > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 border border-[#1B1C1A] bg-[#FAF9F5] text-red-600 hover:bg-red-600 hover:text-white transition-colors inline-flex items-center"
                        title="Delete product"
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

      {/* Create Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="border border-[#1B1C1A] bg-[#FAF9F5] shadow-[6px_6px_0px_0px_#1B1C1A] max-w-2xl w-full p-6 sm:p-8 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-[#1B1C1A] pb-3">
              <div>
                <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
                  // NEW CATALOG ENTRY
                </span>
                <h2 className="font-headline text-3xl text-[#1B1C1A]">CREATE ARTIFACT</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 border border-[#1B1C1A] bg-[#EFEEEA] hover:bg-[#FF4500] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 font-mono text-xs">
              {createError && (
                <div className="p-3 bg-red-50 border border-red-600 text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">PRODUCT SLUG ID:</label>
                  <input
                    type="text"
                    required
                    value={newProduct.id}
                    onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                    placeholder="e.g. neo-009"
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">SKU:</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="e.g. NX-DROP-09"
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none uppercase"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#1B1C1A] block">PRODUCT NAME:</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. ACID OVERSIZED HOODIE"
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">CATEGORY:</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none uppercase cursor-pointer"
                  >
                    <option value="T-SHIRTS">T-SHIRTS</option>
                    <option value="OUTERWEAR">OUTERWEAR</option>
                    <option value="PANTS">PANTS</option>
                    <option value="ACCESSORIES">ACCESSORIES</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">COLORWAY:</label>
                  <input
                    type="text"
                    required
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                    placeholder="e.g. Washed Carbon"
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">PRICE (USD):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1B1C1A] block">INITIAL STOCK UNITS:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#1B1C1A] block">PRIMARY IMAGE URL:</label>
                  <input
                    type="url"
                    required
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value, images: [e.target.value] })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#1B1C1A] block">DESCRIPTION:</label>
                  <textarea
                    rows={3}
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-2.5 outline-none font-body text-xs"
                  />
                </div>
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
                  className="btn-brutalist-yellow text-xs px-6 py-3 font-headline tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{creating ? 'PUBLISHING...' : 'SAVE & PUBLISH'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
