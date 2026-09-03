'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Plus, LayoutGrid, List, SlidersHorizontal, X, Check, ArrowUpDown, Filter } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';

const SORT_LABELS: Record<string, string> = {
  FEATURED: 'FEATURED DROPS',
  LOW_HIGH: 'PRICE: LOW TO HIGH',
  HIGH_LOW: 'PRICE: HIGH TO LOW',
  NEWEST: 'NEWEST DROPS',
  NAME_AZ: 'NAME: A → Z',
};

const COLLECTION_NAMES: Record<string, string> = {
  'archive-v1': 'ARCHIVE V1 // SYSTEM CORE',
  'system-02': 'SYSTEM-02 // TECHNICAL RIPSTOP',
  'brutal-line': 'BRUTAL-LINE // HEAVY FLEECE',
};

const COLLECTION_PRODUCT_MAP: Record<string, string[]> = {
  'archive-v1': ['nx-001', 'nx-006', 'nx-007'],
  'system-02': ['nx-005', 'nx-004'],
  'brutal-line': ['nx-002', 'nx-003'],
};

function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL query params
  const query = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'ALL';
  const selectedCollection = searchParams.get('collection') || '';
  const sortBy = searchParams.get('sort') || 'FEATURED';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
  const selectedColor = searchParams.get('color') || '';

  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  // Fetch full catalogue from API
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const endpoint = query ? `/api/products?q=${encodeURIComponent(query)}` : '/api/products';

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  // URL state updater helper
  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '' || value === 'ALL') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // Extract dynamic colors & category counts
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.color) set.add(p.color);
    }
    return Array.from(set).sort();
  }, [products]);

  const categoryCounts = useMemo(() => {
    return {
      ALL: products.length,
      OUTERWEAR: products.filter((p) => p.category === 'OUTERWEAR').length,
      TOPS: products.filter((p) => p.category === 'T-SHIRTS').length,
      BOTTOMS: products.filter((p) => p.category === 'PANTS').length,
      ACCESSORIES: products.filter((p) => p.category === 'ACCESSORIES').length,
    };
  }, [products]);

  // Filter & Sort Pipeline
  const displayedProducts = useMemo(() => {
    let list = [...products];

    // 0. Collection Filter
    if (selectedCollection && COLLECTION_PRODUCT_MAP[selectedCollection]) {
      const allowedIds = COLLECTION_PRODUCT_MAP[selectedCollection];
      list = list.filter((p) => allowedIds.includes(p.id));
    }

    // 1. Category Filter
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'TOPS') {
        list = list.filter((p) => p.category === 'T-SHIRTS');
      } else if (selectedCategory === 'BOTTOMS') {
        list = list.filter((p) => p.category === 'PANTS');
      } else {
        list = list.filter((p) => p.category === selectedCategory);
      }
    }

    // 2. In Stock Only
    if (inStockOnly) {
      list = list.filter((p) => p.inStock && (p.stock ?? 25) > 0);
    }

    // 3. Price Filter
    if (minPrice !== null) {
      list = list.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== null) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    // 4. Color Filter
    if (selectedColor) {
      list = list.filter((p) => p.color.toLowerCase() === selectedColor.toLowerCase());
    }

    // 5. Multi-dimensional Sorting
    switch (sortBy) {
      case 'LOW_HIGH':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'HIGH_LOW':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'NAME_AZ':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'NEWEST':
        list.sort((a, b) => (b.index || '').localeCompare(a.index || ''));
        break;
      case 'FEATURED':
      default:
        list.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
    }

    return list;
  }, [products, selectedCategory, selectedCollection, inStockOnly, minPrice, maxPrice, selectedColor, sortBy]);

  const visibleProducts = displayedProducts.slice(0, visibleCount);

  const hasActiveFilters = Boolean(
    query ||
    selectedCategory !== 'ALL' ||
    selectedCollection ||
    inStockOnly ||
    minPrice !== null ||
    maxPrice !== null ||
    selectedColor
  );

  return (
    <div className="w-full bg-[#FAF9F5]">
      {/* 1. SHOP HEADER */}
      <div className="p-6 sm:p-10 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
            {query ? `// SEARCH RESULTS FOR "${query.toUpperCase()}"` : '// PERMANENT ARCHIVE CATALOGUE'}
          </span>
          <h1 className="font-headline text-5xl sm:text-7xl tracking-tight text-[#1B1C1A] leading-none">
            {query ? 'SEARCH RESULTS.' : 'SHOP COLLECTION.'}
          </h1>
          <p className="font-body text-base sm:text-lg text-[#5D4038] leading-relaxed">
            {query ? (
              <span>
                Displaying archive artifacts matching your query.{' '}
                <button onClick={clearAllFilters} className="text-[#FF4500] underline font-bold">
                  [CLEAR ALL FILTERS]
                </button>
              </span>
            ) : (
              'Exploring the intersection of raw utility, brutalist architecture, and underground streetwear. Drop #1 / Vol. 001 Archive.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-end">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="font-mono text-xs bg-[#FAF9F5] text-[#FF4500] border border-[#1B1C1A] px-3 py-1.5 font-bold tracking-widest hover:bg-[#FF4500] hover:text-white transition-colors"
            >
              RESET FILTERS
            </button>
          )}
          <div className="font-mono text-xs bg-[#1B1C1A] text-white px-3 py-1.5 border border-[#1B1C1A] font-bold tracking-widest">
            SHOWING: [ {displayedProducts.length} OF {products.length} ]
          </div>
        </div>
      </div>

      {/* 2. CATEGORY TABS WITH LIVE COUNTS */}
      <div className="w-full border-b border-[#1B1C1A] bg-[#FAF9F5] flex flex-wrap lg:flex-nowrap items-stretch text-xs font-mono">
        <div className="flex flex-wrap lg:flex-nowrap flex-1 items-stretch overflow-x-auto">
          {[
            { id: 'ALL', label: 'ALL', count: categoryCounts.ALL },
            { id: 'OUTERWEAR', label: 'OUTERWEAR', count: categoryCounts.OUTERWEAR },
            { id: 'TOPS', label: 'TOPS', count: categoryCounts.TOPS },
            { id: 'BOTTOMS', label: 'BOTTOMS', count: categoryCounts.BOTTOMS },
            { id: 'ACCESSORIES', label: 'ACCESSORIES', count: categoryCounts.ACCESSORIES },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => updateParam('category', cat.id)}
                className={`flex-1 min-w-[130px] px-4 py-4 border-r border-[#1B1C1A] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-[#FF4500] text-white'
                    : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FF4500] hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 border ${
                    isSelected ? 'bg-[#1B1C1A] text-white border-white/30' : 'bg-[#EFEEEA] text-[#1B1C1A] border-[#1B1C1A]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar Right: Filter Toggle + Sort + View Mode */}
        <div className="flex items-stretch border-t lg:border-t-0 font-mono text-xs">
          {/* Filters Toggle Button */}
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`px-5 py-4 border-r border-[#1B1C1A] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              filterDrawerOpen || inStockOnly || minPrice !== null || selectedColor
                ? 'bg-[#FCD400] text-[#1B1C1A]'
                : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#EFEEEA]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>FILTERS</span>
            {(inStockOnly || minPrice !== null || selectedColor) && (
              <span className="w-2 h-2 rounded-full bg-[#FF4500]"></span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="border-r border-[#1B1C1A] bg-[#FAF9F5] px-4 py-3 flex items-center gap-2 font-bold">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent border-none font-mono font-bold text-xs outline-none cursor-pointer uppercase tracking-wider text-[#1B1C1A]"
            >
              <option value="FEATURED">FEATURED</option>
              <option value="LOW_HIGH">PRICE: LOW TO HIGH</option>
              <option value="HIGH_LOW">PRICE: HIGH TO LOW</option>
              <option value="NEWEST">NEWEST DROPS</option>
              <option value="NAME_AZ">NAME: A → Z</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-stretch flex-shrink-0">
            <button
              onClick={() => setViewMode('GRID')}
              className={`w-12 py-4 border-r border-[#1B1C1A] transition-colors flex items-center justify-center ${
                viewMode === 'GRID' ? 'bg-[#1B1C1A] text-white' : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`w-12 py-4 transition-colors flex items-center justify-center ${
                viewMode === 'LIST' ? 'bg-[#1B1C1A] text-white' : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2.5. EXPANDABLE MULTI-FACETED FILTER DRAWER */}
      {filterDrawerOpen && (
        <div className="border-b border-[#1B1C1A] bg-[#EFEEEA] p-6 font-mono text-xs space-y-6 shadow-inner animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Price Range Filter */}
            <div className="space-y-2">
              <span className="font-bold text-[#FF4500] uppercase block">// PRICE SPECTRUM</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'ALL PRICES', min: null, max: null },
                  { label: '< $100', min: null, max: 100 },
                  { label: '$100 — $200', min: 100, max: 200 },
                  { label: '$200+', min: 200, max: null },
                ].map((tier, idx) => {
                  const isMatch =
                    minPrice === tier.min && maxPrice === tier.max;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (tier.min !== null) params.set('minPrice', String(tier.min));
                        else params.delete('minPrice');

                        if (tier.max !== null) params.set('maxPrice', String(tier.max));
                        else params.delete('maxPrice');

                        router.push(`${pathname}?${params.toString()}`, { scroll: false });
                      }}
                      className={`px-3 py-2 border border-[#1B1C1A] font-bold transition-colors ${
                        isMatch
                          ? 'bg-[#1B1C1A] text-white'
                          : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400]'
                      }`}
                    >
                      {tier.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Stock Availability Filter */}
            <div className="space-y-2">
              <span className="font-bold text-[#FF4500] uppercase block">// INVENTORY AVAILABILITY</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateParam('inStock', inStockOnly ? null : 'true')}
                  className={`px-4 py-2 border border-[#1B1C1A] font-bold flex items-center gap-2 transition-colors ${
                    inStockOnly
                      ? 'bg-[#1B1C1A] text-white'
                      : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400]'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 border flex items-center justify-center ${
                      inStockOnly ? 'bg-[#FF4500] border-white' : 'bg-white border-black'
                    }`}
                  >
                    {inStockOnly && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span>IN STOCK ONLY</span>
                </button>
              </div>
            </div>

            {/* 3. Colorway Filter */}
            <div className="space-y-2">
              <span className="font-bold text-[#FF4500] uppercase block">// PALETTE / COLORWAY</span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                <button
                  onClick={() => updateParam('color', null)}
                  className={`px-2.5 py-1 border border-[#1B1C1A] text-[11px] font-bold transition-colors ${
                    !selectedColor ? 'bg-[#1B1C1A] text-white' : 'bg-[#FAF9F5] hover:bg-[#FCD400]'
                  }`}
                >
                  ALL
                </button>
                {availableColors.map((col) => {
                  const isCol = selectedColor.toLowerCase() === col.toLowerCase();
                  return (
                    <button
                      key={col}
                      onClick={() => updateParam('color', isCol ? null : col)}
                      className={`px-2.5 py-1 border border-[#1B1C1A] text-[11px] font-bold transition-colors ${
                        isCol ? 'bg-[#FF4500] text-white' : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400]'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.8. ACTIVE FILTERS CHIP BAR */}
      {hasActiveFilters && (
        <div className="px-6 py-3 border-b border-[#1B1C1A] bg-[#FAF9F5] flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="font-bold text-[#FF4500] uppercase mr-2">// ACTIVE CRITERIA:</span>

          {query && (
            <span className="bg-[#EFEEEA] border border-[#1B1C1A] px-2.5 py-1 flex items-center gap-1.5">
              <span>QUERY: &quot;{query}&quot;</span>
              <button onClick={() => updateParam('q', null)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'ALL' && (
            <span className="bg-[#EFEEEA] border border-[#1B1C1A] px-2.5 py-1 flex items-center gap-1.5">
              <span>CATEGORY: {selectedCategory}</span>
              <button onClick={() => updateParam('category', null)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCollection && (
            <span className="bg-[#FCD400] text-[#1B1C1A] border border-[#1B1C1A] px-2.5 py-1 flex items-center gap-1.5 font-bold">
              <span>
                COLLECTION: {COLLECTION_NAMES[selectedCollection] || selectedCollection.toUpperCase()}
              </span>
              <button onClick={() => updateParam('collection', null)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="bg-[#EFEEEA] border border-[#1B1C1A] px-2.5 py-1 flex items-center gap-1.5">
              <span>IN STOCK ONLY</span>
              <button onClick={() => updateParam('inStock', null)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(minPrice !== null || maxPrice !== null) && (
            <span className="bg-[#EFEEEA] border border-[#1B1C1A] px-2.5 py-1 flex items-center gap-1.5">
              <span>
                PRICE:{' '}
                {minPrice !== null && maxPrice !== null
                  ? `$${minPrice} — $${maxPrice}`
                  : minPrice !== null
                  ? `$${minPrice}+`
                  : `< $${maxPrice}`}
              </span>
              <button
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString());
                  p.delete('minPrice');
                  p.delete('maxPrice');
                  router.push(`${pathname}?${p.toString()}`, { scroll: false });
                }}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedColor && (
            <span className="bg-[#EFEEEA] border border-[#1B1C1A] px-2.5 py-1 flex items-center gap-1.5">
              <span>COLOR: {selectedColor}</span>
              <button onClick={() => updateParam('color', null)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-stone-500 hover:text-red-600 underline font-bold ml-2 uppercase text-[11px]"
          >
            RESET ALL
          </button>
        </div>
      )}

      {/* 3. PRODUCT CATALOG DISPLAY */}
      {loading ? (
        <div className="p-16 text-center border-b border-[#1B1C1A] bg-[#FAF9F5] font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A]">
          LOADING ARCHIVE DATA...
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="p-16 text-center border-b border-[#1B1C1A] bg-[#FAF9F5] space-y-4">
          <div className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest">
            // NO ARTIFACTS FOUND
          </div>
          <h2 className="font-headline text-3xl text-[#1B1C1A]">NO MATCHING ARCHIVE ENTRIES</h2>
          <p className="font-mono text-xs text-stone-500 max-w-md mx-auto">
            No artifacts match your selected filter criteria. Try adjusting or clearing your filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="btn-brutalist-yellow text-xs py-3 px-6 font-headline tracking-wider inline-block mt-2"
          >
            CLEAR ALL FILTERS
          </button>
        </div>
      ) : viewMode === 'GRID' ? (
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FAF9F5] border-b border-[#1B1C1A]">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* List View Mode */
        <div className="divide-y divide-[#1B1C1A] border-b border-[#1B1C1A] bg-[#FAF9F5]">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-[#F4F4F0] transition-colors"
            >
              <Link href={`/product/${product.id}`} className="flex items-center gap-6 group flex-1">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 border border-[#1B1C1A] bg-[#111211] flex-shrink-0 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-1 right-1 bg-[#FAF9F5] text-[#1B1C1A] font-mono text-[9px] font-bold px-1.5 py-0.5 border border-[#1B1C1A]">
                    / {product.index}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#FF4500] font-bold">
                    <span>{product.sku}</span>
                    <span>//</span>
                    <span>{product.color}</span>
                    {product.badgeJapanese && (
                      <span className="bg-[#FF4500] text-white px-1.5 py-0.2 border border-[#1B1C1A]">
                        {product.badgeJapanese}
                      </span>
                    )}
                  </div>
                  <h3 className="font-headline text-2xl text-[#1B1C1A] group-hover:text-[#FF4500] transition-colors mt-1">
                    {product.name}
                  </h3>
                  <p className="font-body text-sm text-[#5D4038] max-w-lg mt-1 line-clamp-1">
                    {product.description}
                  </p>
                  <div className="font-mono text-[10px] text-stone-500 mt-1">
                    SIZES: {product.sizes.join(' · ')}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-6 self-end sm:self-center">
                <span className="font-headline text-3xl text-[#1B1C1A]">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(product, product.sizes[0] || 'M')}
                  className="font-headline text-sm py-3 px-6 bg-[#FCD400] text-black border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> ADD BAG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. LOAD MORE BUTTON */}
      {visibleProducts.length < displayedProducts.length && (
        <div className="p-8 text-center border-b border-[#1B1C1A] bg-[#EFEEEA]">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="font-headline text-lg px-8 py-4 bg-[#FAF9F5] text-[#1B1C1A] border border-[#1B1C1A] hover:bg-[#FF4500] hover:text-white transition-colors uppercase tracking-wider inline-flex items-center gap-2 shadow-[3px_3px_0px_0px_#1B1C1A]"
          >
            <Plus className="w-5 h-5" />
            <span>LOAD MORE ARCHIVE DATA</span>
          </button>
        </div>
      )}

      {/* 5. FOOTER ARCHIVE INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#1B1C1A] bg-[#1B1C1A] text-white">
        <div className="md:col-span-6 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-stone-800 space-y-4">
          <h2 className="font-headline text-4xl text-[#FCD400]">NEO-ARCHIVE UNLTD.</h2>
          <p className="font-body text-base text-stone-300 max-w-md leading-relaxed">
            Brutalist design systems for the modern wasteland. Engineering garments for urban survival and permanent curation.
          </p>
          <div className="font-mono text-xs text-stone-400">
            ©2024 NEO-ARCHIVE. DROP #1 / VOL. 001. ALL RIGHTS RESERVED.
          </div>
        </div>

        <div className="md:col-span-6 p-8 sm:p-12 grid grid-cols-3 gap-6 font-mono text-xs">
          <div>
            <span className="text-[#FF4500] font-bold block mb-3">// INDEX</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li><Link href="/shop" className="hover:text-[#FCD400]">SHOP</Link></li>
              <li><Link href="/collections" className="hover:text-[#FCD400]">COLLECTIONS</Link></li>
              <li><Link href="/lookbook" className="hover:text-[#FCD400]">LOOKBOOK</Link></li>
            </ul>
          </div>
          <div>
            <span className="text-[#FF4500] font-bold block mb-3">// INFO</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li><Link href="/about" className="hover:text-[#FCD400]">ABOUT</Link></li>
              <li><Link href="/journal" className="hover:text-[#FCD400]">JOURNAL</Link></li>
              <li><Link href="/about" className="hover:text-[#FCD400]">CONTACT</Link></li>
            </ul>
          </div>
          <div>
            <span className="text-[#FF4500] font-bold block mb-3">// NETWORK</span>
            <ul className="space-y-2 font-headline text-sm tracking-wider">
              <li className="hover:text-[#FCD400] cursor-pointer">INSTAGRAM</li>
              <li className="hover:text-[#FCD400] cursor-pointer">TIKTOK</li>
              <li className="hover:text-[#FCD400] cursor-pointer">DISCORD</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-[#FAF9F5] min-h-[80vh] p-16 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A]">
          INITIALIZING ARCHIVE...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
