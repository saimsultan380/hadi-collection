"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { urlForImage } from "@/lib/image";
import type { Product, ColorVariant } from "@/types/product";
import { useCart } from "@/context/CartContext";

// =============================================================================
// MOBILE STICKY BOTTOM BAR
// Appears on mobile only when the main ADD TO BAG button scrolls out of view.
// Provides instant one-tap addition with price and thumbnail preview.
// =============================================================================

interface ProductMobileStickyBarProps {
  product: Product;
  selectedVariant: ColorVariant | null;
}

export function ProductMobileStickyBar({
  product,
  selectedVariant,
}: ProductMobileStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const target = document.getElementById("product-action-buttons");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar only when main CTA is scrolled above/out of viewport
        setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      {
        threshold: 0,
        rootMargin: "0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const isOutOfStock = product.stockStatus === "Out of Stock";

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, 1, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  if (!isVisible) {
    return null;
  }

  const activeImage = selectedVariant?.colorImage || product.images?.[0];
  const imageUrl = activeImage
    ? urlForImage(activeImage)?.width(100).height(100).url()
    : null;

  return (
    <aside
      aria-label="Sticky product actions"
      className="fixed bottom-0 left-0 right-0 z-40 block border-t border-[#E5E5E5] bg-white px-4 py-3 md:hidden transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Product snapshot */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative h-10 w-10 shrink-0 bg-[#F7F7F7] overflow-hidden rounded-[8px]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={activeImage?.alt || product.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[8px] uppercase tracking-wider text-[#6B6B6B]">
                SZR
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-sans text-[12px] font-medium text-black truncate">
              {product.name}
            </p>
            <p className="font-sans text-[12px] font-semibold text-black">
              PKR {product.price.toLocaleString("en-PK")}
            </p>
          </div>
        </div>

        {/* Add to Bag CTA */}
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant="primary"
          size="sm"
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-[12px] uppercase tracking-[0.06em] rounded-[8px] cursor-pointer"
        >
          {isAdded ? (
            <>
              <Check className="h-3.5 w-3.5 stroke-[2]" />
              <span>Added</span>
            </>
          ) : isOutOfStock ? (
            <span>Sold Out</span>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>Add to Bag</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

export default ProductMobileStickyBar;
