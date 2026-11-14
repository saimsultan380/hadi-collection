"use client";

import { Star } from "lucide-react";

// =============================================================================
// FLOATING VERTICAL REVIEWS TAB
// Fixed to the right edge of the screen, smooth-scrolls to the reviews section.
// =============================================================================

export function ProductFloatingReviewsTab() {
  const scrollToReviews = () => {
    const el = document.getElementById("reviews");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToReviews}
      aria-label="Scroll to Customer Reviews"
      className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 items-center gap-1.5 border-l border-t border-b border-black bg-black py-3 px-2 text-white shadow-none hover:bg-[#333333] transition-colors cursor-pointer [writing-mode:vertical-rl] rotate-180"
    >
      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.14em]">
        Reviews
      </span>
      <Star className="h-3 w-3 fill-[#F5A623] text-[#F5A623] rotate-90" />
    </button>
  );
}

export default ProductFloatingReviewsTab;
