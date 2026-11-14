import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortDropdown } from "@/components/shop/SortDropdown";
import { EmptyState } from "@/components/shop/EmptyState";
import { getCategories, getShopProducts } from "@/lib/products";

// =============================================================================
// SAZAIRA SHOP CATALOG PAGE
// Server Component with URL-driven filtering, dynamic GROQ queries, and SEO metadata.
// =============================================================================

interface ShopPageProps {
  searchParams: Promise<{
    category?: string | string[];
    occasion?: string | string[];
    style?: string | string[];
    price?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string | string[];
    instock?: string;
    sort?: string;
    bestseller?: string;
    sale?: string;
    search?: string | string[];
  }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

/**
 * Generate dynamic SEO title, description, canonical tags, and robots directives.
 *
 * CANONICAL & DUPLICATE CONTENT PREVENTION RATIONALE:
 * - The canonical URL is fixed to "/shop" (or the base catalog) across filtered/sorted variants.
 *   Without canonicals, Google may index both "/shop?category=tote" and "/shop?category=tote&sort=price_asc"
 *   as separate duplicate pages, diluting authority and splitting backlink signals.
 * - For multi-faceted queries (combining price presets, sorting, or multi-select filters), we apply
 *   "noindex, follow" to prevent search bots from indexing thousands of thin combinatorial variations,
 *   while still allowing crawlers to discover and follow product links.
 */
export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;

  const categoryList = params.category
    ? (Array.isArray(params.category)
        ? params.category.join(",")
        : params.category
      )
        .split(",")
        .filter(Boolean)
    : [];

  const categoryParam = categoryList.length === 1 ? categoryList[0] : undefined;
  const isMultiCategory = categoryList.length > 1;

  const occasionParam =
    typeof params.occasion === "string"
      ? params.occasion
      : params.occasion?.[0];
  const styleParam =
    typeof params.style === "string"
      ? params.style
      : params.style?.[0];
  const searchParam =
    typeof params.search === "string"
      ? params.search
      : params.search?.[0];

  const bestsellerParam = params.bestseller === "true";
  const saleParam = params.sale === "true";

  const hasPriceFilter = Boolean(params.price || params.minPrice || params.maxPrice);
  const hasColorFilter = Boolean(params.color);
  const hasInstockFilter = Boolean(params.instock);
  const hasSortFilter = Boolean(params.sort && params.sort !== "newest");
  const hasSearchFilter = Boolean(searchParam?.trim());
  const hasStyleFilter = Boolean(styleParam);
  const hasOccasionFilter = Boolean(occasionParam);
  const hasCategoryFilter = categoryList.length > 0;

  // Multi-parameter filter variants or any filtered query should be excluded from index (noindex, follow)
  const hasAnyFilter =
    hasCategoryFilter ||
    hasPriceFilter ||
    hasColorFilter ||
    hasInstockFilter ||
    hasSortFilter ||
    hasSearchFilter ||
    hasStyleFilter ||
    hasOccasionFilter ||
    bestsellerParam ||
    saleParam;

  let title = "All Unstitched Suits | Hadi Collection";
  let description =
    "Shop Hadi Collection lawn, embroidered and festive unstitched suits in Pakistan.";

  if (hasSearchFilter) {
    title = `Search Results for "${searchParam}" | Hadi Collection`;
    description = `Suits matching "${searchParam}" from Hadi Collection.`;
  } else if (saleParam) {
    title = "Sale & Special Offers | Hadi Collection";
    description =
      "Reduced prices on Hadi Collection lawn and festive unstitched suits.";
  } else if (bestsellerParam) {
    title = "Best Sellers | Hadi Collection";
    description =
      "The Hadi Collection suits customers order most often.";
  } else if (occasionParam?.toLowerCase().includes("festive") || occasionParam?.toLowerCase().includes("eid")) {
    title = "Festive Unstitched Suits | Hadi Collection";
    description =
      "Gold-bordered festive suits for Eid, mehndi and wedding week.";
  } else if (categoryParam && !isMultiCategory) {
    const formattedCat = categoryParam
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    title = `${formattedCat} Collection | Hadi Collection`;
    description = `Explore ${formattedCat.toLowerCase()} from Hadi Collection with premium finishes, reinforced stitching, and thoughtful organization.`;
  } else if (styleParam && !hasStyleFilter) {
    const formattedStyle = styleParam
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    title = `${formattedStyle} Suits | Hadi Collection`;
    description = `Discover ${formattedStyle.toLowerCase()} unstitched suits from Hadi Collection.`;
  } else if (occasionParam) {
    title = `${occasionParam} Suits | Hadi Collection`;
    description = `Shop unstitched suits for ${occasionParam.toLowerCase()} dressing in Pakistan.`;
  }

  // Canonical determination per SEO requirements:
  // If exactly ONE category is selected: canonical points to /category/[that-slug]
  // If two or more are selected (or plain /shop / other filters): canonical points to /shop
  const canonicalUrl =
    categoryList.length === 1
      ? `${SITE_URL}/category/${categoryList[0]}`
      : `${SITE_URL}/shop`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: hasAnyFilter
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  // Normalize multi-select filter arrays
  const categoriesParam = params.category
    ? (Array.isArray(params.category)
        ? params.category.join(",")
        : params.category
      )
        .split(",")
        .filter(Boolean)
    : undefined;


  const occasionsParam = params.occasion
    ? (Array.isArray(params.occasion)
        ? params.occasion.join(",")
        : params.occasion
      )
        .split(",")
        .filter(Boolean)
    : undefined;

  const stylesParam = params.style
    ? (Array.isArray(params.style)
        ? params.style.join(",")
        : params.style
      )
        .split(",")
        .filter(Boolean)
    : undefined;

  const colorsParam = params.color
    ? (Array.isArray(params.color)
        ? params.color.join(",")
        : params.color
      )
        .split(",")
        .filter(Boolean)
    : undefined;

  const inStockFilter = params.instock === "1" || params.instock === "true";

  const searchParam =
    typeof params.search === "string"
      ? params.search
      : params.search?.[0];

  const pricePreset =
    typeof params.price === "string" ? params.price : undefined;
  const minPrice =
    typeof params.minPrice === "string" && !isNaN(Number(params.minPrice))
      ? Math.max(0, Number(params.minPrice))
      : undefined;
  const maxPrice =
    typeof params.maxPrice === "string" && !isNaN(Number(params.maxPrice))
      ? Math.max(0, Number(params.maxPrice))
      : undefined;

  const sortParam = typeof params.sort === "string" ? params.sort : "newest";
  const bestsellerFilter = params.bestseller === "true";
  const saleFilter = params.sale === "true";

  // Fetch categories for sidebar filter list and matching products concurrently
  const [categories, products, allCatalogProducts] = await Promise.all([
    getCategories(),
    getShopProducts({
      categories: categoriesParam,
      occasions: occasionsParam,
      styles: stylesParam,
      colors: colorsParam,
      inStock: inStockFilter,
      bestseller: bestsellerFilter,
      sale: saleFilter,
      search: searchParam,
      pricePreset,
      minPrice,
      maxPrice,
      sort: sortParam,
    }),
    getShopProducts({}), // For calculating accurate zero-product filter counts
  ]);

  // Determine dynamic heading
  let pageHeading = "All Suits";
  let eyebrow = "Collection Catalog";
  let currentCategoryTitle: string | undefined;

  if (searchParam && searchParam.trim()) {
    pageHeading = `Search: "${searchParam.trim()}"`;
    eyebrow = "Search Results";
  } else if (saleFilter) {
    pageHeading = "Sale & Special Offers";
    eyebrow = "Special Value";
  } else if (bestsellerFilter) {
    pageHeading = "Best Sellers";
    eyebrow = "Customer Favorites";
  } else if (occasionsParam?.some((o) => o.toLowerCase().includes("eid"))) {
    pageHeading = "Eid & Festive Collection";
    eyebrow = "Festive Edit";
  } else if (categoriesParam && categoriesParam.length === 1) {
    const matchedCat = categories.find(
      (c) => c.slug.toLowerCase() === categoriesParam[0].toLowerCase()
    );
    if (matchedCat) {
      pageHeading = matchedCat.title;
      currentCategoryTitle = matchedCat.title;
      eyebrow = "Category Collection";
    }
  } else if (stylesParam && stylesParam.length === 1) {
    const formattedStyle = stylesParam[0]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    pageHeading = `${formattedStyle} Bags`;
    eyebrow = "Curated Style";
  } else if (occasionsParam && occasionsParam.length === 1) {
    pageHeading = `${occasionsParam[0]} Bags`;
    eyebrow = "Curated Occasion";
  }

  // BreadcrumbList JSON-LD Schema
  const breadcrumbItemList = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Shop",
      item: `${SITE_URL}/shop`,
    },
  ];

  if (searchParam && searchParam.trim()) {
    breadcrumbItemList.push({
      "@type": "ListItem",
      position: 3,
      name: `Search: ${searchParam.trim()}`,
      item: `${SITE_URL}/shop?search=${encodeURIComponent(searchParam.trim())}`,
    });
  } else if (currentCategoryTitle && categoriesParam?.[0]) {
    breadcrumbItemList.push({
      "@type": "ListItem",
      position: 3,
      name: currentCategoryTitle,
      item: `${SITE_URL}/category/${encodeURIComponent(categoriesParam[0])}`,
    });
  } else if (saleFilter) {
    breadcrumbItemList.push({
      "@type": "ListItem",
      position: 3,
      name: "Sale",
      item: `${SITE_URL}/shop?sale=true`,
    });
  } else if (bestsellerFilter) {
    breadcrumbItemList.push({
      "@type": "ListItem",
      position: 3,
      name: "Best Sellers",
      item: `${SITE_URL}/shop?bestseller=true`,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItemList,
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12">
      {/* BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Container>
        {/* Page Header Area */}
        <div className="mb-8 border-b border-[#E5E5E5] pb-6">
          <p className="mb-1 font-sans text-[12px] font-medium uppercase tracking-[0.15em] text-[#6B6B6B]">
            {eyebrow}
          </p>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-[0.02em] text-black">
                {pageHeading}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Filter Sidebar + Product Grid */}
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            totalProducts={products.length}
            catalogProducts={allCatalogProducts}
            hideStyleSection={true}
          />

          {/* Product Listing Area */}
          <div className="w-full flex-1">
            {/* Top Toolbar (Sort Control & View Info) — Desktop only (Mobile handled by sticky toolbar) */}
            <div className="mb-6 hidden lg:flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <span className="font-sans text-[12px] text-[#6B6B6B]">
                {products.length}{" "}
                {products.length === 1 ? "item found" : "items found"}
              </span>

              <div className="ml-auto">
                <SortDropdown />
              </div>
            </div>

            {/* Product Grid or Empty State */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
