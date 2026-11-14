import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import type { Category, Product } from "@/types/product";
import { matchesColor } from "@/lib/category-styles";

// =============================================================================
// PRODUCTS & CATEGORIES DATA HELPERS
// Pure local file querying. Fast, zero-network, statically generatable.
// =============================================================================

export interface ShopFilterParams {
  categories?: string[];
  occasions?: string[];
  styles?: string[];
  colors?: string[];
  inStock?: boolean;
  bestseller?: boolean;
  sale?: boolean;
  search?: string;
  pricePreset?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

/**
 * Parses a price preset identifier into numeric min & max boundaries.
 */
export function parsePricePreset(preset?: string): {
  minPrice?: number;
  maxPrice?: number;
} {
  if (!preset) return {};
  switch (preset) {
    case "under-2000":
      return { maxPrice: 2000 };
    case "2000-4000":
      return { minPrice: 2000, maxPrice: 4000 };
    case "4000-7000":
      return { minPrice: 4000, maxPrice: 7000 };
    case "above-7000":
      return { minPrice: 7000 };
    default:
      return {};
  }
}

/**
 * Fetch all categories with dynamic productCount.
 */
export async function getCategories(options?: {
  includeInactive?: boolean;
}): Promise<Category[]> {
  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    productCount: PRODUCTS.filter(
      (p) => p.category?.slug.toLowerCase() === cat.slug.toLowerCase()
    ).length,
  }));

  if (options?.includeInactive) {
    return categories;
  }
  return categories.filter((c) => c.isActive !== false);
}

/**
 * Fetch a single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const normalized = slug.toLowerCase().trim();
  const found = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === normalized
  );
  if (!found) return null;

  return {
    ...found,
    productCount: PRODUCTS.filter(
      (p) => p.category?.slug.toLowerCase() === found.slug.toLowerCase()
    ).length,
  };
}

/**
 * Fetch featured products for homepage.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return PRODUCTS.filter(
    (p) => p.isBestSeller && p.stockStatus !== "Out of Stock"
  );
}

/**
 * Search products by keyword across title, short description, category, and occasion.
 */
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const trimmed = searchTerm.trim().toLowerCase();
  if (!trimmed) return [];

  const tokens = trimmed.split(/\s+/).filter(Boolean);

  return PRODUCTS.filter((p) => {
    const textCorpus = [
      p.name,
      p.shortDescription || "",
      p.category?.title || "",
      p.category?.slug || "",
      ...(p.occasion || []),
      p.material || "",
    ]
      .join(" ")
      .toLowerCase();

    return (
      textCorpus.includes(trimmed) ||
      tokens.every((token) => textCorpus.includes(token)) ||
      tokens.some((token) => textCorpus.includes(token))
    );
  }).slice(0, 8);
}

/**
 * Fetch products matching filters, with sorting.
 */
export async function getShopProducts(
  filters: ShopFilterParams = {}
): Promise<Product[]> {
  const { minPrice: presetMin, maxPrice: presetMax } = parsePricePreset(
    filters.pricePreset
  );
  const minPrice =
    filters.minPrice !== undefined ? filters.minPrice : presetMin;
  const maxPrice =
    filters.maxPrice !== undefined ? filters.maxPrice : presetMax;

  let results = [...PRODUCTS];

  // 1. Search filter
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter(Boolean);
    results = results.filter((p) => {
      const textCorpus = [
        p.name,
        p.shortDescription || "",
        p.category?.title || "",
        p.category?.slug || "",
        ...(p.occasion || []),
        p.material || "",
      ]
        .join(" ")
        .toLowerCase();
      return (
        textCorpus.includes(q) ||
        tokens.every((token) => textCorpus.includes(token)) ||
        tokens.some((token) => textCorpus.includes(token))
      );
    });
  }

  // 2. Categories
  if (filters.categories && filters.categories.length > 0) {
    const cats = filters.categories.map((c) => c.toLowerCase());
    results = results.filter(
      (p) => p.category && cats.includes(p.category.slug.toLowerCase())
    );
  }

  // 3. Occasions
  if (filters.occasions && filters.occasions.length > 0) {
    const occs = filters.occasions.map((o) => o.toLowerCase());
    results = results.filter((p) => {
      const hasOccasion = p.occasion?.some((o) => occs.includes(o.toLowerCase()));
      const isEid =
        p.isEidCollection &&
        (occs.includes("eid") || occs.includes("eid/festive"));
      return hasOccasion || isEid;
    });
  }

  // 4. Styles
  if (filters.styles && filters.styles.length > 0) {
    const stls = filters.styles.map((s) => s.toLowerCase());
    results = results.filter((p) =>
      p.styles?.some((s) => stls.includes(s.toLowerCase()))
    );
  }

  // 5. Bestseller
  if (filters.bestseller) {
    results = results.filter((p) => p.isBestSeller === true);
  }

  // 6. Sale
  if (filters.sale) {
    results = results.filter(
      (p) =>
        typeof p.compareAtPrice === "number" && p.compareAtPrice > p.price
    );
  }

  // 7. Price
  if (typeof minPrice === "number") {
    results = results.filter((p) => p.price >= minPrice);
  }
  if (typeof maxPrice === "number") {
    results = results.filter((p) => p.price <= maxPrice);
  }

  // 8. Colors
  if (filters.colors && filters.colors.length > 0) {
    const cols = filters.colors;
    results = results.filter((p) =>
      p.colorVariants?.some((v) => matchesColor(v.colorName, cols))
    );
  }

  // 9. Stock
  if (filters.inStock) {
    results = results.filter((p) => p.stockStatus !== "Out of Stock");
  }

  // 10. Sort
  if (filters.sort === "price_asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price_desc") {
    results.sort((a, b) => b.price - a.price);
  } else {
    results.sort(
      (a, b) =>
        new Date(b._createdAt || 0).getTime() -
        new Date(a._createdAt || 0).getTime()
    );
  }

  return results;
}

/**
 * Fetch a single product by slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalizedSlug = slug.toLowerCase().trim();
  const found = PRODUCTS.find(
    (p) =>
p.slug.toLowerCase() === normalizedSlug
  );
  return found || null;
}

/**
 * Fetch all published products for catalog and sitemap generation.
 */
export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

/**
 * Fetch products by category slug.
 */
export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const normalized = categorySlug.toLowerCase().trim();
  return PRODUCTS.filter(
    (p) => p.category?.slug.toLowerCase() === normalized
  );
}

/**
 * Fetch related products in the same category excluding the active product.
 */
export async function getRelatedProducts(
  categorySlug: string,
  currentProductId: string
): Promise<Product[]> {
  return PRODUCTS.filter(
    (p) =>
      p._id !== currentProductId &&
      p.category?.slug.toLowerCase() === categorySlug.toLowerCase()
  ).slice(0, 5);
}

/**
 * Fetch related accessory products (wallets, pouches, charms, clutches) for Complete The Look.
 */
export async function getAccessoryProducts(
  currentProductId: string
): Promise<Product[]> {
  const accessoryKeywords = [
    "festive",
    "embroidered",
    "botanical",
    "lawn",
  ];

  return PRODUCTS.filter((p) => {
    if (p._id === currentProductId) return false;
    const catSlug = p.category?.slug?.toLowerCase() || "";
    const catTitle = p.category?.title?.toLowerCase() || "";
    const name = p.name.toLowerCase();

    return (
      accessoryKeywords.some((kw) => catSlug.includes(kw)) ||
      accessoryKeywords.some((kw) => catTitle.includes(kw)) ||
      accessoryKeywords.some((kw) => name.includes(kw))
    );
  }).slice(0, 3);
}
