"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// =============================================================================
// CATEGORY STYLE QUICK-FILTER BUTTON ROW
// Displays category-specific styles in format: ALL (n) | HOBO (2) | BAGUETTE (2).
// Per rule: Only shown on category pages, only for styles with >= 1 product.
// =============================================================================

export interface CategoryStyleWithCount {
  label: string;
  value: string;
  count: number;
}

interface StyleQuickFiltersProps {
  categorySlug?: string;
  stylesWithCounts?: CategoryStyleWithCount[];
  totalCategoryCount?: number;
}

export function StyleQuickFilters({
  categorySlug,
  stylesWithCounts = [],
  totalCategoryCount = 0,
}: StyleQuickFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // If no category is selected or category has no styles with products, hide completely
  if (!categorySlug || stylesWithCounts.length === 0) {
    return null;
  }

  const selectedStyles = searchParams.get("style")
    ? searchParams.get("style")!.split(",").filter(Boolean)
    : [];

  const handleSelectStyle = useCallback(
    (value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        // "ALL" was clicked
        params.delete("style");
      } else {
        if (selectedStyles.includes(value) && selectedStyles.length === 1) {
          // Toggle off if already active
          params.delete("style");
        } else {
          params.set("style", value);
        }
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, selectedStyles]
  );

  const isAllActive = selectedStyles.length === 0;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap">
        {/* ALL button */}
        <button
          type="button"
          onClick={() => handleSelectStyle(undefined)}
          className={`shrink-0 rounded-[8px] border px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.06em] transition-colors ${
            isAllActive
              ? "border-black bg-black text-white"
              : "border-[#E5E5E5] bg-white text-black hover:border-black hover:bg-[#F7F7F7]"
          }`}
        >
          ALL ({totalCategoryCount})
        </button>

        {/* Category specific style buttons with individual product counts */}
        {stylesWithCounts.map((style) => {
          const isActive = selectedStyles.includes(style.value);
          return (
            <button
              key={style.value}
              type="button"
              onClick={() => handleSelectStyle(style.value)}
              className={`shrink-0 rounded-[8px] border px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.06em] transition-colors ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-[#E5E5E5] bg-white text-black hover:border-black hover:bg-[#F7F7F7]"
              }`}
            >
              {style.label.toUpperCase()} ({style.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StyleQuickFilters;
