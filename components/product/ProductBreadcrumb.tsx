import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/types/product";

// =============================================================================
// PRODUCT BREADCRUMB COMPONENT
// Editorial flat breadcrumb navigation for product detail pages.
// =============================================================================

interface ProductBreadcrumbProps {
  category?: Category;
  productName: string;
}

export function ProductBreadcrumb({
  category,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[#6B6B6B] mb-6 flex flex-wrap items-center gap-1.5 font-sans text-xs tracking-wider uppercase md:mb-8"
    >
      <Link href="/" className="hover:text-black transition-colors">
        Home
      </Link>
      <ChevronRight className="text-[#6B6B6B] h-3 w-3 shrink-0" />

      <Link href="/shop" className="hover:text-black transition-colors">
        Shop
      </Link>
      <ChevronRight className="text-[#6B6B6B] h-3 w-3 shrink-0" />

      {category && (
        <>
          <Link
            href={`/category/${category.slug}`}
            className="hover:text-black transition-colors"
          >
            {category.title}
          </Link>
          <ChevronRight className="text-[#6B6B6B] h-3 w-3 shrink-0" />
        </>
      )}

      <span className="text-black max-w-[200px] truncate font-semibold sm:max-w-xs">
        {productName}
      </span>
    </nav>
  );
}

export default ProductBreadcrumb;
