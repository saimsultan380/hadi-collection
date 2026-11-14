"use client";

import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

// =============================================================================
// EMPTY STATE COMPONENT
// Flat editorial message when filter criteria yields zero matching bags.
// =============================================================================

export function EmptyState() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="border-[#E5E5E5] flex min-h-[360px] w-full flex-col items-center justify-center border bg-white p-10 text-center rounded-[8px]">
      <div className="border-[#E5E5E5] bg-[#F7F7F7] text-black mb-4 flex h-14 w-14 items-center justify-center rounded-[8px] border">
        <ShoppingBag className="text-[#6B6B6B] h-6 w-6 stroke-1" />
      </div>

      <h3 className="font-sans text-black text-xl font-semibold tracking-wider uppercase">
        No Matching Bags Found
      </h3>

      <p className="text-[#6B6B6B] mt-2 max-w-sm font-sans text-sm leading-relaxed">
        We couldn&apos;t find any products matching your active filter
        combination. Try adjusting your categories, occasions, or price filters.
      </p>

      <div className="mt-6">
        <Button
          type="button"
          onClick={handleClearFilters}
          variant="primary"
          size="sm"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}

export default EmptyState;
