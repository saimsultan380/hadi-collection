"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductFloatingReviewsTab } from "@/components/product/ProductFloatingReviewsTab";
import { ProductMobileStickyBar } from "@/components/product/ProductMobileStickyBar";
import type { Product, ColorVariant } from "@/types/product";
import type { ReviewStats } from "@/types/review";

// =============================================================================
// PRODUCT DETAIL VIEW (CLIENT CONTAINER)
// Coordinates two-column gallery and interactive actions state.
// Manages floating reviews trigger and mobile sticky bottom bar.
// =============================================================================

interface ProductDetailViewProps {
  product: Product;
  reviewStats?: ReviewStats;
}

export function ProductDetailView({
  product,
  reviewStats,
}: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(
    product.colorVariants && product.colorVariants.length > 0
      ? product.colorVariants[0]
      : null
  );

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Image Gallery (Span 7 cols on desktop) */}
        <div className="w-full lg:col-span-7">
          <ProductGallery
            images={product.images}
            productName={product.name}
            categoryTitle={product.category?.title}
            activeVariantImage={selectedVariant?.colorImage ?? null}
          />
        </div>

        {/* Right Column: Info, Actions & Reassurance (Span 5 cols on desktop) */}
        <div className="flex w-full flex-col lg:col-span-5">
          <ProductActions
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={(variant) => setSelectedVariant(variant)}
            reviewStats={reviewStats}
          />
        </div>
      </div>

      {/* Floating Vertical Reviews Tab on Right Edge */}
      <ProductFloatingReviewsTab />

      {/* Mobile-Only Sticky Bottom Bar */}
      <ProductMobileStickyBar
        product={product}
        selectedVariant={selectedVariant}
      />
    </>
  );
}

export default ProductDetailView;
