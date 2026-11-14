"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

// =============================================================================
// SORT DROPDOWN COMPONENT
// Editorial flat styled select dropdown synced with the ?sort= URL parameter.
// =============================================================================

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[#6B6B6B] hidden items-center gap-1.5 font-sans text-xs font-semibold tracking-wider uppercase sm:inline-flex">
        <ArrowUpDown className="text-black h-3.5 w-3.5" />
        Sort By:
      </span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          aria-label="Sort products by"
          className="border-[#E5E5E5] text-black hover:border-black focus:border-black cursor-pointer appearance-none rounded-[8px] border bg-white px-3 py-2 pr-8 font-sans text-xs font-semibold tracking-wider uppercase transition-colors focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <div className="text-black pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2">
          <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SortDropdown;
