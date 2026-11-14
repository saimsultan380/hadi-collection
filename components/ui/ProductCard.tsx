"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { urlForImage } from "@/lib/image";
import { useCart } from "@/context/CartContext";
import type { Product, ColorVariant } from "@/types/product";

// =============================================================================
// PRODUCT CARD — Minimal Fashion-Retail (Aldo Inspired)
// Image on top (desktop hover crossfade to second image), product name & price below.
// Color variant dots, discount badge, left-aligned, no borders, square corners.
// Interactive Quick Add to Bag with single-tap & multi-variant selection popover.
// =============================================================================

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [showVariantPicker, setShowVariantPicker] = useState(false);
  const addedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) {
        clearTimeout(addedTimeoutRef.current);
      }
    };
  }, []);

  const firstImageUrl = product.images?.[0]
    ? urlForImage(product.images[0])?.width(700).height(875).url()
    : null;

  const secondImageUrl =
    product.images && product.images.length > 1
      ? urlForImage(product.images[1])?.width(700).height(875).url()
      : null;

  const isSale = Boolean(
    product.compareAtPrice && product.compareAtPrice > product.price
  );

  const isOutOfStock = product.stockStatus === "Out of Stock";

  const discountPercent =
    isSale && product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : null;

  const handleQuickAdd = (variant?: ColorVariant | null) => {
    if (isOutOfStock) return;
    addToCart(product, 1, variant || product.colorVariants?.[0] || null);
    setShowVariantPicker(false);
    setIsAdded(true);

    if (addedTimeoutRef.current) {
      clearTimeout(addedTimeoutRef.current);
    }
    addedTimeoutRef.current = setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const onQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    if (product.colorVariants && product.colorVariants.length > 1) {
      setShowVariantPicker((prev) => !prev);
    } else {
      handleQuickAdd(product.colorVariants?.[0] || null);
    }
  };

  return (
    <article className="group flex flex-col bg-transparent relative">
      {/* Product Image Container */}
      <div className="bg-[#F7F7F7] relative aspect-[3/4] w-full overflow-hidden block rounded-[8px]">
        <Link
          href={`/shop/${product.slug}`}
          className="relative block h-full w-full"
          aria-label={`View details for ${product.name}`}
        >
          {firstImageUrl ? (
            <>
              {/* Primary Image */}
              <Image
                src={firstImageUrl}
                alt={
                  product.images[0]?.alt ||
                  `${product.name} - Hadi Collection`
                }
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={
                  secondImageUrl
                    ? "object-cover transition-opacity duration-300 ease-in-out md:group-hover:opacity-0"
                    : "object-cover transition-transform duration-500 ease-out md:group-hover:scale-105"
                }
              />

              {/* Secondary Image (Hover Crossfade for Desktop) */}
              {secondImageUrl && (
                <Image
                  src={secondImageUrl}
                  alt={
                    product.images[1]?.alt ||
                    `${product.name} – alternate view`
                  }
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-0 transition-opacity duration-300 ease-in-out md:group-hover:opacity-100 pointer-events-none"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <span className="font-sans text-xs tracking-widest uppercase text-[#6B6B6B]">
                Hadi Collection
              </span>
            </div>
          )}

          {/* Badges Container (Top Left) */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
            {isSale && (
              <Badge variant="sale" className="text-[10px] px-1.5 py-0.5">
                {discountPercent ? `-${discountPercent}%` : "Sale"}
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0.5 opacity-90">
                Sold Out
              </Badge>
            )}
          </div>
        </Link>

        {/* Quick Add to Bag Button (Circular Brand Sales Color #A6843D) */}
        {!isOutOfStock ? (
          <button
            type="button"
            onClick={onQuickAddClick}
            aria-label={`Add ${product.name} to bag`}
            style={{ borderRadius: "9999px" }}
            className={`absolute bottom-2.5 right-2.5 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none shadow-sm motion-reduce:transition-none motion-reduce:transform-none ${
              isAdded
                ? "bg-[#A6843D] text-white opacity-100 translate-y-0 scale-105"
                : "bg-[#A6843D] text-white hover:bg-[#7A5E2A] hover:scale-105 opacity-95 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:group-focus-within:opacity-100 sm:group-focus-within:translate-y-0"
            }`}
          >
            {isAdded ? (
              <Check className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.5] text-white" />
            ) : (
              <ShoppingBag className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[1.8] text-white" />
            )}
          </button>
        ) : (
          <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
            <span className="bg-black/75 px-2 py-1 font-sans text-[9px] uppercase font-semibold tracking-wider text-white">
              Sold Out
            </span>
          </div>
        )}

        {/* Compact Variant / Color Picker Panel over Bottom of Image */}
        {showVariantPicker && product.colorVariants && product.colorVariants.length > 1 && (
          <div
            className="absolute inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-xs p-2.5 border-t border-black/10 flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150 motion-reduce:animate-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-black">
                Select Color
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVariantPicker(false);
                }}
                className="text-black/60 hover:text-black p-0.5 cursor-pointer"
                aria-label="Close color selector"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {product.colorVariants.map((variant, idx) => (
                <button
                  key={idx}
                  type="button"
                  title={variant.colorName}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickAdd(variant);
                  }}
                  className="h-6 w-6 border border-black/20 hover:border-black hover:scale-105 transition-all flex items-center justify-center p-0.5 cursor-pointer bg-white"
                >
                  <span
                    className="h-full w-full block"
                    style={{ backgroundColor: variant.colorHex || "#333333" }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Details — Minimalist left-aligned (Preserved exact fonts, styling and spacing) */}
      <div className="flex flex-col pt-3 pb-1">
        {/* Color Dots */}
        {product.colorVariants && product.colorVariants.length > 1 && (
          <div className="mb-1.5 flex items-center gap-1.5">
            {product.colorVariants.slice(0, 4).map((variant, idx) => (
              <span
                key={idx}
                title={variant.colorName}
                className="h-2.5 w-2.5 border border-black/20"
                style={{
                  backgroundColor: variant.colorHex || "#333333",
                }}
              />
            ))}
            {product.colorVariants.length > 4 && (
              <span className="font-sans text-[10px] text-[#6B6B6B]">
                +{product.colorVariants.length - 4}
              </span>
            )}
          </div>
        )}

        <h3 className="font-sans text-[13px] sm:text-[14px] font-medium text-black line-clamp-1 group-hover:underline">
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-sans text-[13px] sm:text-[14px] font-normal text-black">
            PKR {product.price.toLocaleString("en-PK")}
          </span>
          {isSale && product.compareAtPrice && (
            <span className="font-sans text-[12px] text-[#6B6B6B] line-through">
              PKR {product.compareAtPrice.toLocaleString("en-PK")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
