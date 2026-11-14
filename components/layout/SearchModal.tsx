"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { urlForImage } from "@/lib/image";
import type { Product } from "@/types/product";

// =============================================================================
// SAZAIRA SEARCH OVERLAY MODAL
// Fast, flat, debounced live search modal for luxury handbags and clutches.
// Zero gradients, zero glassmorphism, crisp editorial borders & typography.
// =============================================================================

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input automatically when modal opens, reset state when closed
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query (~300ms)
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("[Search Error]:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Submit full search to catalog /shop?search=query
  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        onClose();
        router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, onClose, router]
  );

  const handleProductClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-16 px-4"
    >
      {/* Flat solid espresso backdrop */}
      <div
        className="bg-black/60 fixed inset-0 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="border-border relative z-10 w-full max-w-2xl border bg-white shadow-none rounded-[8px] overflow-hidden"
      >
        {/* Search Header Bar */}
        <form
          onSubmit={handleSubmit}
          className="border-border flex items-center border-b px-4 py-3 sm:px-6 sm:py-4"
        >
          <Search className="text-[#6B6B6B] mr-3 h-5 w-5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lawn, festive, embroidered suits..."
            className="text-black placeholder:text-[#6B6B6B] w-full bg-transparent font-sans text-sm md:text-base font-normal outline-none"
            aria-label="Search products"
          />

          <div className="flex items-center gap-2">
            {isLoading && (
              <Loader2 className="text-black h-4 w-4 animate-spin shrink-0" />
            )}

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="text-[#6B6B6B] hover:text-black p-1 transition-colors"
                aria-label="Clear search input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-[#6B6B6B] hover:text-black border-[#E5E5E5] ml-2 border-l pl-3 py-1 font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              ESC
            </button>
          </div>
        </form>

        {/* Live Search Results / Content Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {/* Initial State / Suggestions when no query is typed */}
          {!query.trim() && (
            <div className="py-4">
              <p className="text-[#6B6B6B] mb-3 font-sans text-xs font-semibold uppercase tracking-widest">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Everyday Totes", "Eid Potlis", "Crossbody Bags", "Best Sellers", "Sale"].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        if (term === "Best Sellers") {
                          onClose();
                          router.push("/shop?bestseller=true");
                        } else if (term === "Sale") {
                          onClose();
                          router.push("/shop?sale=true");
                        } else {
                          setQuery(term);
                        }
                      }}
                      className="border-[#E5E5E5] hover:border-black hover:text-black text-[#6B6B6B] border px-3 py-1.5 font-sans text-xs tracking-wider uppercase transition-colors rounded-[8px]"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Results List */}
          {query.trim() && results.length > 0 && (
            <div>
              <div className="border-border mb-3 flex items-center justify-between border-b pb-2">
                <span className="text-[#6B6B6B] font-sans text-xs font-semibold uppercase tracking-widest">
                  Products ({results.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="text-black hover:underline flex items-center gap-1 font-sans text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  <span>View all results</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="divide-border divide-y">
                {results.slice(0, 6).map((product) => {
                  const imageUrl = product.images?.[0]
                    ? urlForImage(product.images[0])?.width(120).height(140).url()
                    : null;
                  const isSale = Boolean(
                    product.compareAtPrice &&
                      product.compareAtPrice > product.price
                  );

                  return (
                    <Link
                      key={product._id}
                      href={`/shop/${product.slug}`}
                      onClick={handleProductClick}
                      className="hover:bg-[#F7F7F7] flex items-center gap-4 py-3 px-2 transition-colors group"
                    >
                      {/* Product Thumbnail */}
                      <div className="border border-[#E5E5E5] bg-[#F7F7F7] relative h-14 w-12 shrink-0 overflow-hidden rounded-[8px]">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-sans text-[9px] font-medium text-[#6B6B6B]">
                            SAZAIRA
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <p className="text-[#6B6B6B] font-sans text-[10px] uppercase tracking-wider">
                          {product.category?.title || "Suit"}
                        </p>
                        <h4 className="font-sans text-black group-hover:underline text-[13px] font-medium uppercase tracking-[0.04em] truncate transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-sans text-[12px] font-normal text-black">
                            PKR {product.price.toLocaleString("en-PK")}
                          </span>
                          {isSale && product.compareAtPrice && (
                            <span className="text-[#6B6B6B] line-through text-[11px] font-sans">
                              PKR {product.compareAtPrice.toLocaleString("en-PK")}
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="text-[#6B6B6B] group-hover:text-black h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 stroke-[1.5]" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results Found State */}
          {query.trim() && !isLoading && hasSearched && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="font-sans text-black text-sm font-semibold uppercase tracking-[0.08em]">
                No products found
              </p>
              <p className="text-[#6B6B6B] mt-1 font-sans text-[13px]">
                We couldn&apos;t find any items matching &ldquo;{query}&rdquo;.
              </p>
              <div className="mt-5 flex justify-center">
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="inline-flex items-center justify-center bg-black hover:bg-[#222222] text-white px-6 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.08em] transition-colors rounded-[8px]"
                >
                  Explore all suits
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Submit Bar */}
        {query.trim() && (
          <div className="border-t border-[#E5E5E5] bg-[#F7F7F7] flex items-center justify-between px-4 py-3 sm:px-6">
            <span className="text-[#6B6B6B] font-sans text-[12px]">
              Press <kbd className="font-medium text-black">Enter ↵</kbd> to search catalog
            </span>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="inline-flex items-center justify-center bg-black hover:bg-[#222222] text-white px-5 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.08em] transition-colors rounded-[8px]"
            >
              Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
