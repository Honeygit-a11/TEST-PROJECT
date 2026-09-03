'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Plus, 
  Minus, 
  Check, 
  Bookmark, 
  Star, 
  MessageSquarePlus, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';

interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  createdAt: string;
}

interface ReviewMeta {
  total: number;
  averageRating: number;
  distribution: Record<number, number>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = typeof params?.id === 'string' ? params.id : (Array.isArray(params?.id) ? params.id[0] : 'nx-001');

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(productId);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewMeta, setReviewMeta] = useState<ReviewMeta>({
    total: 0,
    averageRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.meta) setReviewMeta(data.meta);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  // Fetch product + related items from the API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          if (!cancelled) setProduct(null);
          return;
        }
        const data: Product = await res.json();
        if (cancelled) return;
        setProduct(data);
        setSelectedSize(data.sizes[0] || 'M');
        setSelectedImage(data.image);
        const allRes = await fetch('/api/products');
        const all: Product[] = await allRes.json();
        if (!cancelled) {
          setRelatedProducts(all.filter((p) => p.id !== data.id).slice(0, 4));
        }
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    fetchReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize as any);
    }
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof data?.error === 'object' && data.error?.message ? data.error.message : (data?.error || 'Review submission failed');
        throw new Error(msg);
      }

      setReviewSuccess('✓ ARCHIVE REVIEW LOGGED SUCCESSFULLY');
      setNewReview({ rating: 5, title: '', comment: '' });
      fetchReviews();
      setTimeout(() => {
        setReviewFormOpen(false);
        setReviewSuccess('');
      }, 2500);
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'fill-[#FCD400] text-[#1B1C1A]' : 'text-stone-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading || !product) {
    return (
      <div className="w-full bg-[#FAF9F5] min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#1B1C1A]">
          {loading ? 'LOADING ARCHIVE ARTIFACT...' : '// ERROR 404 — ARTIFACT NOT FOUND'}
        </span>
        {!loading && (
          <Link href="/shop" className="btn-brutalist text-sm px-6 py-3 uppercase tracking-wider">
            RETURN TO CATALOG
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F5]">
      {/* 1. TOP BREADCRUMB & SKU BAR */}
      <div className="p-4 sm:px-8 border-b border-[#1B1C1A] bg-[#EFEEEA] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Link href="/shop" className="text-stone-500 hover:text-[#1B1C1A] flex items-center gap-1 font-bold">
            <ArrowLeft className="w-3.5 h-3.5" /> SHOP
          </Link>
          <span className="text-stone-400">/</span>
          <span className="uppercase text-stone-500 font-semibold">{product.category}</span>
          <span className="text-stone-400">/</span>
          <span className="font-bold text-[#1B1C1A] truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3">
          <span className="bg-[#1B1C1A] text-white px-2 py-0.5 uppercase tracking-widest text-[11px] font-bold">
            SKU: {product.sku}
          </span>
          <span className="text-stone-500 font-semibold">{product.season}</span>
        </div>
      </div>

      {/* 2. MAIN PRODUCT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#1B1C1A]">
        {/* LEFT COLUMN: Gallery & Main Image (7 Cols) */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#1B1C1A] bg-[#111211] p-4 sm:p-8 flex flex-col items-center justify-center">
          {/* Main Showcase Image */}
          <div className="relative w-full aspect-square max-w-xl border border-[#FAF9F5]/20 bg-[#1B1C1A] overflow-hidden shadow-2xl">
            <Image
              src={selectedImage || product.image}
              alt={product.name}
              fill
              priority
              className="object-cover object-center"
            />
            {/* Top Japanese Badge overlay */}
            {product.badgeJapanese && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#FF4500] text-white font-mono text-xs font-bold px-3 py-1 border border-[#1B1C1A] tracking-wider uppercase">
                  {product.badgeJapanese}
                </span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 mt-6 overflow-x-auto w-full max-w-xl pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 flex-shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-[#FF4500] scale-105 shadow-md'
                      : 'border-[#FAF9F5]/30 hover:border-white opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Telemetry & Controls (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-8 bg-[#FAF9F5]">
          <div className="space-y-6">
            {/* Tag / Category Header */}
            <div className="flex items-center justify-between border-b border-[#1B1C1A] pb-3">
              <span className="font-mono text-xs font-bold text-[#FF4500] uppercase tracking-widest">
                // {product.category}
              </span>
              <span className="font-mono text-xs font-bold bg-[#EFEEEA] border border-[#1B1C1A] px-2.5 py-0.5">
                {product.details.edition}
              </span>
            </div>

            {/* Product Title & Color */}
            <div className="space-y-1">
              <h1 className="font-headline text-4xl sm:text-5xl text-[#1B1C1A] leading-none uppercase tracking-tight">
                {product.name}
              </h1>
              <p className="font-body text-base text-stone-600 font-medium">
                Colorway: <span className="font-bold text-[#1B1C1A]">{product.color}</span>
              </p>
            </div>

            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2.5 font-mono text-xs">
              {renderStars(Math.round(reviewMeta.averageRating))}
              <span className="font-bold">{reviewMeta.averageRating > 0 ? reviewMeta.averageRating.toFixed(1) : 'NEW'}</span>
              <span className="text-stone-500">({reviewMeta.total} reviews)</span>
            </div>

            {/* Price & Stock status */}
            <div className="flex items-baseline justify-between border-y border-[#1B1C1A] py-4 bg-[#EFEEEA] px-4">
              <span className="font-headline text-3xl sm:text-4xl font-bold text-[#1B1C1A]">
                ${product.price.toFixed(2)}
              </span>
              <span className="font-mono text-xs font-bold flex items-center gap-1.5 uppercase">
                {product.inStock ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                    <span className="text-stone-900">IN STOCK & READY TO SHIP</span>
                  </>
                ) : (
                  <span className="text-[#FF4500]">OUT OF STOCK</span>
                )}
              </span>
            </div>

            {/* Description Paragraph */}
            <p className="font-body text-sm sm:text-base text-[#5D4038] leading-relaxed">
              {product.description}
            </p>

            {/* Sizing Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-[#1B1C1A] uppercase tracking-wider">
                  SELECT SIZE:
                </span>
                <span className="font-mono text-[11px] text-stone-500 underline cursor-pointer">
                  SIZE GUIDE (CM)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 font-headline text-sm border border-[#1B1C1A] tracking-wider transition-colors ${
                      selectedSize === size
                        ? 'bg-[#1B1C1A] text-white shadow-[2px_2px_0px_0px_#FF4500]'
                        : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Bag & Bookmark */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3 items-stretch">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-[#1B1C1A] bg-[#FAF9F5]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-3 hover:bg-stone-200 transition-colors text-black"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-bold text-base px-4 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-3 hover:bg-stone-200 transition-colors text-black"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 text-xl font-headline flex items-center justify-center gap-3 tracking-wider border border-[#1B1C1A] transition-all ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#FCD400] text-[#1B1C1A] hover:bg-[#1B1C1A] hover:text-[#FCD400] shadow-[3px_3px_0px_0px_#1B1C1A]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-6 h-6" />
                      <span>ADDED TO BAG!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-6 h-6" />
                      <span>ADD TO BAG — ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>

                {/* Bookmark Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`px-4 border border-[#1B1C1A] transition-colors flex items-center justify-center ${
                    wishlisted
                      ? 'bg-[#FF4500] text-white shadow-[3px_3px_0px_0px_#1B1C1A]'
                      : 'bg-[#FAF9F5] text-[#1B1C1A] hover:bg-[#FCD400] shadow-[3px_3px_0px_0px_#1B1C1A]'
                  }`}
                  title={wishlisted ? 'Remove from Saved Artifacts' : 'Save Artifact to Wishlist'}
                >
                  <Bookmark className={`w-6 h-6 ${wishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Technical Garment Specs Sheet */}
            <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-4 space-y-2 font-mono text-xs">
              <div className="text-[#FF4500] font-bold mb-2">// TECHNICAL GARMENT SPECIFICATIONS</div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">GSM DENSITY:</span>
                <span className="font-bold">{product.details.gsm}</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">COMPOSITION:</span>
                <span className="font-bold">{product.details.fabric}</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">SILHOUETTE:</span>
                <span className="font-bold">{product.details.fit}</span>
              </div>
              <div className="flex justify-between border-b border-stone-300 pb-1">
                <span className="text-stone-600">ORIGIN:</span>
                <span className="font-bold">{product.details.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">EDITION:</span>
                <span className="font-bold text-[#FF4500]">{product.details.edition}</span>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 border-t border-[#1B1C1A] pt-4 font-mono text-[10px] text-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#FF4500]" />
              <span className="font-bold">EXPRESS DISPATCH</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#FF4500]" />
              <span className="font-bold">QUALITY GUARANTEE</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-[#FF4500]" />
              <span className="font-bold">14-DAY RETURNS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5. ARCHIVE REVIEWS & VERIFIED RATINGS SECTION */}
      <section className="w-full bg-[#FAF9F5] border-b border-[#1B1C1A]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // COMMUNITY TELEMETRY
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl text-[#1B1C1A]">
              ARCHIVE REVIEWS & VERIFIED RATINGS
            </h2>
          </div>

          <button
            onClick={() => setReviewFormOpen(!reviewFormOpen)}
            className="btn-brutalist-yellow text-xs py-3 px-6 font-headline tracking-wider flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{reviewFormOpen ? 'CLOSE REVIEW TERMINAL' : 'POST ARCHIVE REVIEW'}</span>
          </button>
        </div>

        {/* Reviews Overview Grid & Submission Form */}
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
          {/* Rating Telemetry Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border border-[#1B1C1A] bg-[#EFEEEA] p-6 shadow-[4px_4px_0px_0px_#1B1C1A]">
            <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#1B1C1A] p-4 text-center space-y-2">
              <div className="font-headline text-6xl text-[#1B1C1A] leading-none">
                {reviewMeta.averageRating > 0 ? reviewMeta.averageRating.toFixed(1) : '—'}
              </div>
              <div className="flex items-center gap-1 text-[#FCD400]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(reviewMeta.averageRating)
                        ? 'fill-[#FCD400] text-[#1B1C1A]'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <div className="font-mono text-xs text-stone-500">
                BASED ON {reviewMeta.total} {reviewMeta.total === 1 ? 'COMMUNITY REVIEW' : 'COMMUNITY REVIEWS'}
              </div>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="md:col-span-8 space-y-2 font-mono text-xs p-2 flex flex-col justify-center">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviewMeta.distribution[stars] || 0;
                const percentage = reviewMeta.total > 0 ? Math.round((count / reviewMeta.total) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="w-16 font-bold">{stars} STARS</span>
                    <div className="flex-1 bg-[#FAF9F5] border border-[#1B1C1A] h-3.5 overflow-hidden">
                      <div
                        className="bg-[#FF4500] h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-stone-500 font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Form Drawer */}
          {reviewFormOpen && (
            <div className="border border-[#1B1C1A] bg-[#FAF9F5] p-6 shadow-[4px_4px_0px_0px_#1B1C1A] space-y-4 max-w-2xl">
              <div className="border-b border-[#1B1C1A] pb-3">
                <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
                  // NEW TRANSMISSION
                </span>
                <h3 className="font-headline text-2xl text-[#1B1C1A]">LOG VERIFIED PIECE REVIEW</h3>
              </div>

              {reviewError && (
                <div className="p-3 bg-red-50 border border-red-600 text-red-700 font-mono text-xs font-bold">
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-600 text-emerald-800 font-mono text-xs font-bold">
                  {reviewSuccess}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="font-bold text-[#1B1C1A] block mb-1">SCORE RATING (1 TO 5):</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 text-stone-300 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating
                              ? 'fill-[#FCD400] text-[#1B1C1A]'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-bold ml-2 text-sm">{newReview.rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#1B1C1A] block mb-1">HEADLINE TITLE:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNMATCHED GSM DENSITY AND BOXY FIT"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-3 text-sm outline-none uppercase focus:border-[#FF4500]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1B1C1A] block mb-1">DETAILED REVIEW & FEEDBACK:</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe garment drape, wash durability, weight, and sizing..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-[#EFEEEA] border border-[#1B1C1A] p-3 font-body text-sm outline-none focus:border-[#FF4500]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewFormOpen(false)}
                    className="font-headline text-xs px-5 py-3 border border-[#1B1C1A] bg-[#EFEEEA] hover:bg-black hover:text-white transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-brutalist-yellow text-xs px-6 py-3 font-headline tracking-wider flex items-center gap-2"
                  >
                    {submittingReview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{submittingReview ? 'SUBMITTING...' : 'PUBLISH REVIEW'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="border border-[#1B1C1A] bg-[#EFEEEA] p-12 text-center space-y-2">
              <div className="font-headline text-2xl text-[#1B1C1A]">NO REVIEWS LOGGED YET</div>
              <p className="font-mono text-xs text-stone-500">
                Be the first verified customer to evaluate this archive artifact.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border border-[#1B1C1A] bg-[#FAF9F5] p-6 shadow-[3px_3px_0px_0px_#1B1C1A] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-headline text-base text-[#1B1C1A]">{rev.userName}</span>
                      {rev.verifiedBuyer && (
                        <span className="font-mono text-[10px] bg-[#1B1C1A] text-[#FCD400] font-bold px-2 py-0.5 border border-[#1B1C1A] uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VERIFIED ARCHIVE BUYER</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {renderStars(rev.rating)}
                      <span className="font-mono text-xs text-stone-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-headline text-lg text-[#1B1C1A]">{rev.title}</div>
                    <p className="font-body text-sm text-[#5D4038] leading-relaxed">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. DEDICATED RELATED PRODUCTS SECTION */}
      <section className="w-full bg-[#FAF9F5] border-b border-[#1B1C1A]">
        {/* Section Header */}
        <div className="p-6 md:p-8 border-b border-[#1B1C1A] bg-[#EFEEEA] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-xs text-[#FF4500] font-bold uppercase tracking-widest block">
              // ARCHIVE CURATION
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl text-[#1B1C1A]">
              RELATED PRODUCTS & COMPLETE THE LOOK
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-mono text-xs text-[#1B1C1A] hover:text-[#FF4500] font-bold uppercase tracking-wider flex items-center gap-1 underline"
          >
            VIEW FULL COLLECTION →
          </Link>
        </div>

        {/* Product Cards Grid using exact same card design */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FAF9F5]">
          {relatedProducts.map((relProduct) => (
            <ProductCard key={relProduct.id} product={relProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}
