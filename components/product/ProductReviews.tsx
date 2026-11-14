"use client";

import { useState, useMemo, useRef } from "react";
import {
  Star,
  Check,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Camera,
  X,
  AlertCircle,
  Upload,
} from "lucide-react";
import type { Review, ReviewStats } from "@/types/review";

// =============================================================================
// CUSTOMER REVIEWS SECTION (#reviews)
// Features:
// - Live rating breakdown and instant review publishing
// - Direct file upload and link photo attachments with fallback previews
// - Toolbar with Sort, Search, and Filter Pills
// - Paginated review list with Verified Buyer badges and avatar initials
// =============================================================================

interface ProductReviewsProps {
  productId: string;
  productSlug: string;
  initialReviews?: Review[];
  initialStats?: ReviewStats;
}

const REVIEWS_PER_PAGE = 5;

export function ProductReviews({
  productId,
  productSlug,
  initialReviews = [],
  initialStats = {
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  },
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [stats, setStats] = useState<ReviewStats>(initialStats);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toolbar state
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "photos">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ---------- helpers ----------
  /** Canvas-based image compression: max 800px on longest side, 0.75 JPEG quality */
  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          } else {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("canvas context unavailable")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("image load failed")); };
      img.src = objectUrl;
    });

  // Filter & Sort Logic
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q)
      );
    }

    if (filterMode === "photos") {
      list = list.filter((r) => r.photos && r.photos.length > 0);
    }

    if (sortBy === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      list.sort((a, b) => a.rating - b.rating);
    } else {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list;
  }, [reviews, searchQuery, filterMode, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return filteredReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      if (!file.type.startsWith("image/")) return;
      try {
        const compressed = await compressImage(file);
        setFormPhotos((prev) => [...prev, compressed]);
      } catch {
        // fallback to plain FileReader if canvas fails
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = ev.target?.result as string;
          if (result) setFormPhotos((prev) => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddPhotoUrl = () => {
    const trimmed = photoInput.trim();
    if (!trimmed) return;

    // Normalize URL if protocol is missing
    let finalUrl = trimmed;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("data:")) {
      finalUrl = `https://${trimmed}`;
    }

    setFormPhotos((prev) => [...prev, finalUrl]);
    setPhotoInput("");
  };

  const handleRemovePhoto = (idx: number) => {
    setFormPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitReview = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    setFormError(null);
    setFormSuccess(null);

    if (!formName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!formTitle.trim()) {
      setFormError("Please enter a review title.");
      return;
    }
    if (!formText.trim() || formText.trim().length < 5) {
      setFormError("Please write at least 5 characters in your review.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productSlug,
          name: formName.trim(),
          rating: formRating,
          title: formTitle.trim(),
          body: formText.trim(),
          text: formText.trim(),
          photos: formPhotos,
          honeypot: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "We could not submit your review at this time. Please try again.");
      }

      setFormSuccess("Thank you! Your review will appear after we approve it.");
      setFormName("");
      setFormRating(5);
      setFormTitle("");
      setFormText("");
      setFormPhotos([]);
      setHoneypot("");

      setTimeout(() => {
        setIsFormOpen(false);
        setFormSuccess(null);
      }, 3500);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "We could not submit your review at this time. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalReviews = stats.totalReviews;
  const avgRating = stats.averageRating;

  return (
    <section id="reviews" className="w-full scroll-mt-24">
      {/* Section Header */}
      <div className="mb-8">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6B] mb-1">
          Customer Feedback
        </p>
        <h2 className="font-sans text-xl font-semibold uppercase tracking-[0.02em] text-black sm:text-2xl">
          Customer Reviews
        </h2>
      </div>

      {/* 3-Column Reviews Overview Header */}
      <div className="grid grid-cols-1 gap-8 border border-[#E5E5E5] bg-white p-6 sm:p-8 md:grid-cols-12 md:items-center">
        {/* Left Column: Average Score (Span 4) */}
        <div className="flex flex-col items-center justify-center border-b border-[#E5E5E5] pb-6 text-center md:col-span-4 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <span className="font-sans text-4xl sm:text-5xl font-semibold text-black">
            {totalReviews > 0 ? avgRating.toFixed(1) : "0.0"}
          </span>
          <div className="my-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(avgRating) && totalReviews > 0
                    ? "fill-[#F5A623] text-[#F5A623]"
                    : "fill-transparent text-[#D4D4D4]"
                }`}
              />
            ))}
          </div>
          <p className="font-sans text-[12px] text-[#6B6B6B]">
            {totalReviews > 0
              ? `Based on ${totalReviews} verified ${
                  totalReviews === 1 ? "review" : "reviews"
                }`
              : "Based on 0 reviews"}
          </p>
        </div>

        {/* Middle Column: 5-to-1 Star Breakdown (Span 5) */}
        <div className="flex flex-col gap-2 md:col-span-5 md:px-4">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const count = stats.ratingBreakdown[star] || 0;
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3 font-sans text-[12px]">
                <span className="w-8 shrink-0 text-right font-medium text-black">
                  {star} <span className="text-[#F5A623]">★</span>
                </span>
                <div className="relative h-2 flex-1 bg-[#F0F0F0] overflow-hidden">
                  <div
                    className="h-full bg-[#F5A623] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-left text-[#6B6B6B]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Column: Write a Review CTA (Span 3) */}
        <div className="flex flex-col items-center justify-center border-t border-[#E5E5E5] pt-6 md:col-span-3 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <button
            type="button"
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="w-full border border-black bg-black py-3 px-5 font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-white hover:bg-[#222222] transition-colors rounded-[8px] text-center cursor-pointer"
          >
            {isFormOpen ? "Cancel Review" : "Write a Review"}
          </button>
        </div>
      </div>

      {/* Review Submission Form Drawer / Panel */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="mt-6 border border-black bg-[#FAFAFA] p-6 sm:p-8 space-y-5"
        >
          {/* Hidden Honeypot Field */}
          <input
            type="text"
            name="user_homepage"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
            aria-hidden="true"
          />

          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
            <h3 className="font-sans text-[14px] font-semibold uppercase tracking-[0.06em] text-black">
              Share Your Experience
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-[#6B6B6B] hover:text-black cursor-pointer"
              aria-label="Close review form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {formSuccess && (
            <div className="flex items-center gap-2 border border-black bg-black p-3.5 text-[12px] text-white font-sans">
              <Check className="h-4 w-4 shrink-0 text-white stroke-[2]" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#A6843D] bg-[#FFF4F0] p-3.5 text-[12px] text-[#A6843D] font-sans">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
              <button
                type="button"
                onClick={() => handleSubmitReview()}
                disabled={isSubmitting}
                className="border border-[#A6843D] bg-white px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#A6843D] hover:bg-[#A6843D] hover:text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? "Retrying..." : "Retry"}
              </button>
            </div>
          )}

          {/* Star Rating Selector */}
          <div className="space-y-1.5">
            <label className="block font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-black">
              Overall Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormRating(star)}
                  onMouseEnter={() => setFormHoverRating(star)}
                  onMouseLeave={() => setFormHoverRating(null)}
                  className="p-1 focus:outline-none cursor-pointer"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (formHoverRating ?? formRating)
                        ? "fill-[#F5A623] text-[#F5A623]"
                        : "fill-transparent text-[#D4D4D4]"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-sans text-[12px] text-[#6B6B6B]">
                ({formHoverRating ?? formRating} out of 5)
              </span>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-black">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Ayesha K."
              className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5 font-sans text-[13px] text-black focus:border-black focus:outline-none rounded-[8px]"
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-black">
              Review Title *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Exceeded my expectations, beautiful craftsmanship"
              className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5 font-sans text-[13px] text-black focus:border-black focus:outline-none rounded-[8px]"
            />
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <label className="block font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-black">
              Review Details *
            </label>
            <textarea
              rows={4}
              required
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="Describe what you liked about the material, finish, packaging, and everyday utility..."
              className="w-full border border-[#E5E5E5] bg-white px-3.5 py-2.5 font-sans text-[13px] text-black focus:border-black focus:outline-none rounded-[8px]"
            />
          </div>

          {/* Photo Upload Attachment */}
          <div className="space-y-2.5">
            <label className="block font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-black">
              Add Photos (Optional)
            </label>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Upload Action Area */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 border border-black bg-white px-4 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-black hover:bg-black hover:text-white transition-colors rounded-[8px] cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Photos</span>
              </button>

              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPhotoUrl();
                    }
                  }}
                  placeholder="Or paste image URL (https://...)"
                  className="flex-1 border border-[#E5E5E5] bg-white px-3 py-2 font-sans text-[12px] text-black focus:border-black focus:outline-none rounded-[8px]"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="border border-[#E5E5E5] bg-white px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-black hover:border-black transition-colors rounded-[8px] cursor-pointer"
                >
                  Add Link
                </button>
              </div>
            </div>

            {/* Attached Photo Previews */}
            {formPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-2">
                {formPhotos.map((photoSrc, idx) => (
                  <div
                    key={idx}
                    className="relative group h-20 w-20 border border-[#E5E5E5] bg-[#F7F7F7] overflow-hidden flex items-center justify-center rounded-[8px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoSrc}
                      alt={`Upload preview ${idx + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Handle broken image links gracefully
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/100x100?text=Photo";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      aria-label="Remove photo"
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-black text-white hover:bg-red-600 transition-colors cursor-pointer rounded-[4px]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E5E5]">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="border border-[#E5E5E5] bg-white px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.06em] text-black hover:border-black transition-colors rounded-[8px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-black bg-black px-6 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-white hover:bg-[#222222] transition-colors disabled:opacity-50 rounded-[8px] cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* Toolbar: Sort, Search, Filter */}
      {reviews.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 border-b border-[#E5E5E5] pb-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFilterMode("all");
                setCurrentPage(1);
              }}
              className={`border px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.06em] transition-colors rounded-[8px] cursor-pointer ${
                filterMode === "all"
                  ? "border-black bg-black text-white"
                  : "border-[#E5E5E5] bg-white text-black hover:border-black"
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterMode("photos");
                setCurrentPage(1);
              }}
              className={`border px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.06em] transition-colors rounded-[8px] cursor-pointer ${
                filterMode === "photos"
                  ? "border-black bg-black text-white"
                  : "border-[#E5E5E5] bg-white text-black hover:border-black"
              }`}
            >
              With Photos ({reviews.filter((r) => r.photos && r.photos.length > 0).length})
            </button>
          </div>

          {/* Right: Search & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-[#6B6B6B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search reviews..."
                className="border border-[#E5E5E5] bg-white pl-8 pr-3 py-1.5 font-sans text-[12px] text-black focus:border-black focus:outline-none rounded-[8px]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 border border-[#E5E5E5] bg-white px-2.5 py-1.5 rounded-[8px]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#6B6B6B]" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as "recent" | "highest" | "lowest");
                  setCurrentPage(1);
                }}
                aria-label="Sort reviews by"
                className="bg-transparent font-sans text-[11px] font-medium uppercase tracking-[0.04em] text-black focus:outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Review List or Empty State */}
      <div className="mt-6">
        {reviews.length === 0 ? (
          /* Empty State */
          <div className="border border-[#E5E5E5] bg-white py-14 px-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-[#E5E5E5] bg-[#F7F7F7]">
              <Star className="h-5 w-5 fill-[#F5A623] text-[#F5A623]" />
            </div>
            <h3 className="font-sans text-[15px] font-semibold uppercase tracking-[0.04em] text-black">
              No reviews yet
            </h3>
            <p className="mt-1 font-sans text-[13px] text-[#6B6B6B]">
              Be the first to review this handcrafted piece.
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-5 border border-black bg-white px-6 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-black hover:bg-black hover:text-white transition-colors rounded-[8px] cursor-pointer"
            >
              Write the First Review
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          /* Filter zero state */
          <div className="border border-[#E5E5E5] bg-white py-10 px-6 text-center">
            <p className="font-sans text-[13px] text-[#6B6B6B]">
              No reviews matched your search query or photo filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterMode("all");
              }}
              className="mt-3 text-[12px] font-medium uppercase tracking-[0.06em] text-black underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Reviews List */
          <div className="flex flex-col divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
            {paginatedReviews.map((review) => {
              const initial = review.name.charAt(0).toUpperCase() || "A";
              const formattedDate = new Date(review.createdAt).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              );

              return (
                <article key={review.id} className="py-6 sm:py-8">
                  {/* Top: Avatar, Name, Verified Buyer Badge, Stars & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar initial */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#E5E5E5] bg-[#F7F7F7] font-sans text-[13px] font-semibold text-black">
                        {initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[13px] font-medium text-black">
                            {review.name}
                          </span>
                          {review.isVerifiedBuyer && (
                            <span className="flex items-center gap-1 border border-[#E5E5E5] bg-[#F7F7F7] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-black">
                              <Check className="h-3 w-3 stroke-[2]" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-[#F5A623] text-[#F5A623]"
                                    : "fill-transparent text-[#E5E5E5]"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-sans text-[11px] text-[#8C8C8C]">
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div className="mt-3 space-y-1.5 pl-12">
                    <h4 className="font-sans text-[14px] font-medium text-black">
                      {review.title}
                    </h4>
                    <p className="font-sans text-[13px] leading-relaxed text-[#4A4A4A]">
                      {review.text}
                    </p>

                    {/* Review Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-1">
                        {review.photos.map((photoUrl, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setLightboxUrl(photoUrl)}
                            aria-label={`View customer photo ${pIdx + 1}`}
                            className="relative h-16 w-16 border border-[#E5E5E5] bg-[#F7F7F7] overflow-hidden block hover:border-black transition-colors cursor-zoom-in rounded-[8px]"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photoUrl}
                              alt={`Customer photo ${pIdx + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "https://placehold.co/100x100?text=Photo";
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-[#E5E5E5] pt-4 font-sans text-[12px]">
            <span className="text-[#6B6B6B]">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center border border-[#E5E5E5] bg-white text-black hover:border-black transition-colors disabled:opacity-30 rounded-[8px] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center border border-[#E5E5E5] bg-white text-black hover:border-black transition-colors disabled:opacity-30 rounded-[8px] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Lightbox Overlay ── */}
      {lightboxUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Review photo"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
          onClick={() => setLightboxUrl(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            aria-label="Close photo"
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center border border-white/30 bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Review photo"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/600x600?text=Photo";
            }}
          />
        </div>
      )}
    </section>
  );
}

export default ProductReviews;
