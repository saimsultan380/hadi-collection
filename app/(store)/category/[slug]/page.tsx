import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortDropdown } from "@/components/shop/SortDropdown";
import { StyleQuickFilters } from "@/components/shop/StyleQuickFilters";
import { EmptyState } from "@/components/shop/EmptyState";
import {
  getCategories,
  getCategoryBySlug,
  getShopProducts,
} from "@/lib/products";
import { urlForImage } from "@/lib/image";
import { getStylesForCategory } from "@/lib/category-styles";

// =============================================================================
// CATEGORY COLLECTION PAGE ROUTE (/category/[slug])
// Displays the category collection with breadcrumb, H1, intro paragraph,
// style button row (ALL (n) | STYLE (n)), product count, FilterSidebar, and grid.
// =============================================================================

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    more?: string | string[];
    sort?: string;
    style?: string | string[];
    occasion?: string | string[];
    price?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string | string[];
    instock?: string;
    bestseller?: string;
    sale?: string;
    search?: string | string[];
  }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const search = searchParams ? await searchParams : {};
  const category = await getCategoryBySlug(slug);

  if (!category || category.isActive === false) {
    return {
      title: "Category Not Found | Hadi Collection",
      description: "The requested category could not be found.",
    };
  }

  // Check product count to determine indexing
  const allCategoryProducts = await getShopProducts({
    categories: [category.slug],
  });

  const isEmpty = allCategoryProducts.length === 0;
  const hasFilterParams = Boolean(
    search?.more ||
    search?.style ||
    search?.occasion ||
    search?.price ||
    search?.minPrice ||
    search?.maxPrice ||
    search?.color ||
    search?.instock ||
    search?.sort ||
    search?.bestseller ||
    search?.sale ||
    search?.search
  );

  const title =
    category.seoTitle || `${category.title} | Hadi Collection`;
  const description =
    category.seoDescription ||
    category.introText ||
    category.description ||
    `Explore Hadi Collection's curated collection of ${category.title.toLowerCase()} in Pakistan. Modern silhouettes, precision finishing, and nationwide cash on delivery.`;

  const canonicalUrl = `${SITE_URL}/category/${category.slug}`;
  const ogImage = category.image
    ? urlForImage(category.image)?.width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: (isEmpty || hasFilterParams)
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
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: category.image?.alt || category.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const category = await getCategoryBySlug(slug);

  if (!category || category.isActive === false) {
    notFound();
  }

  // Parse filter params
  const stylesParam = search.style
    ? (Array.isArray(search.style)
        ? search.style.join(",")
        : search.style
      )
        .split(",")
        .filter(Boolean)
    : undefined;

  const occasionsParam = search.occasion
    ? (Array.isArray(search.occasion)
        ? search.occasion.join(",")
        : search.occasion
      )
        .split(",")
        .filter(Boolean)
    : undefined;

  const colorsParam = search.color
    ? (Array.isArray(search.color)
        ? search.color.join(",")
        : search.color
      )
        .split(",")
        .filter(Boolean)
    : undefined;

  const inStockFilter = search.instock === "1" || search.instock === "true";
  const sortParam = typeof search.sort === "string" ? search.sort : "newest";
  const pricePreset = typeof search.price === "string" ? search.price : undefined;
  const minPrice =
    typeof search.minPrice === "string" && !isNaN(Number(search.minPrice))
      ? Math.max(0, Number(search.minPrice))
      : undefined;
  const maxPrice =
    typeof search.maxPrice === "string" && !isNaN(Number(search.maxPrice))
      ? Math.max(0, Number(search.maxPrice))
      : undefined;
  const bestsellerFilter = search.bestseller === "true";
  const saleFilter = search.sale === "true";
  const searchParam = typeof search.search === "string" ? search.search : undefined;

  // Parse 'more' categories parameter
  const moreCategories = search.more
    ? (Array.isArray(search.more) ? search.more.join(",") : search.more)
        .split(",")
        .filter(Boolean)
    : [];

  const allSelectedCategorySlugs = [category.slug, ...moreCategories];
  const hasMultipleCategories = moreCategories.length > 0;

  // Concurrently fetch:
  // 1. All active categories (for sidebar category filter list)
  // 2. All catalog products (for accurate sidebar faceted calculations across categories)
  // 3. Base products for this primary category (for style quick-filter counts)
  // 4. Filtered products matching URL parameters including all selected categories (for grid display)
  const [categories, allCatalogProducts, baseCategoryProducts, filteredProducts] =
    await Promise.all([
      getCategories(),
      getShopProducts({}),
      getShopProducts({ categories: [category.slug] }),
      getShopProducts({
        categories: allSelectedCategorySlugs,
        styles: hasMultipleCategories ? undefined : stylesParam,
        occasions: occasionsParam,
        pricePreset,
        minPrice,
        maxPrice,
        colors: colorsParam,
        inStock: inStockFilter,
        bestseller: bestsellerFilter,
        sale: saleFilter,
        search: searchParam,
        sort: sortParam,
      }),
    ]);

  // Compute category style options and their product counts (only keeping styles with count >= 1)
  const categoryStyleOptions = getStylesForCategory(category.slug);
  const stylesWithCounts = categoryStyleOptions
    .map((opt) => {
      const count = baseCategoryProducts.filter((p) =>
        p.styles?.includes(opt.value)
      ).length;
      return {
        label: opt.label,
        value: opt.value,
        count,
      };
    })
    .filter((s) => s.count > 0);

  // Structured Data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
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
      {
        "@type": "ListItem",
        position: 3,
        name: category.title,
        item: `${SITE_URL}/category/${category.slug}`,
      },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description:
      category.seoDescription ||
      category.introText ||
      category.description ||
      `Collection of ${category.title} by Hadi Collection.`,
    url: `${SITE_URL}/category/${category.slug}`,
    numberOfItems: filteredProducts.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: filteredProducts.length,
      itemListElement: filteredProducts.map((prod, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/shop/${prod.slug}`,
        name: prod.name,
      })),
    },
  };

  const introParagraph = category.introText || category.description;

  return (
    <div className="min-h-screen bg-white py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd),
        }}
      />

      <Container>
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 font-sans text-[12px] text-[#6B6B6B]"
        >
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="font-semibold text-black uppercase tracking-wider">
            {category.title}
          </span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8 border-b border-[#E5E5E5] pb-6">
          <p className="mb-1 font-sans text-[12px] font-medium uppercase tracking-[0.15em] text-[#6B6B6B]">
            Category Collection
          </p>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-[0.02em] text-black">
                {category.title}
              </h1>
              {introParagraph && (
                <p className="mt-2 max-w-2xl font-sans text-[13px] sm:text-[14px] leading-relaxed text-[#6B6B6B]">
                  {introParagraph}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Style Quick-Filter Button Row: desktop only (on mobile Quick Chips replace it) */}
        {!hasMultipleCategories && stylesWithCounts.length > 0 && (
          <div className="hidden lg:block">
            <StyleQuickFilters
              categorySlug={category.slug}
              stylesWithCounts={stylesWithCounts}
              totalCategoryCount={baseCategoryProducts.length}
            />
          </div>
        )}

        {/* Main Content Layout: Context-Aware FilterSidebar + Product Grid */}
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <FilterSidebar
            categories={categories}
            totalProducts={filteredProducts.length}
            activeCategorySlug={category.slug}
            catalogProducts={allCatalogProducts}
            hideCategoriesSection={false}
            hideStyleSection={true}
          />

          <div className="w-full flex-1">
            {/* Top Toolbar (Sort Control & View Info) — Desktop only (Mobile handled by sticky toolbar) */}
            <div className="mb-6 hidden lg:flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <span className="font-sans text-[12px] text-[#6B6B6B]">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "item found" : "items found"}
              </span>

              <div className="ml-auto">
                <SortDropdown />
              </div>
            </div>

            {/* Product Grid or Empty State */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 xl:grid-cols-3">
                {filteredProducts.map((product) => (
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
