import type { MetadataRoute } from "next";
import { getAllProducts, getCategories } from "@/lib/products";
import { urlForImage } from "@/lib/image";

/**
 * =============================================================================
 * SAZAIRA DYNAMIC SITEMAP GENERATOR (sitemap.xml)
 * =============================================================================
 * Automatically generates a search engine sitemap containing:
 * 1. Core static marketing pages (Homepage, About, Contact)
 * 2. Main collection catalog (/shop)
 * 3. Primary category landing pages (/category/...)
 * 4. All published product detail pages with Google Image sitemap extensions
 *
 * INDEXING DECISION FOR CATEGORY PAGES:
 * We intentionally include canonical category URLs (e.g. /category/tote-bags)
 * because users in Pakistan frequently search high-intent queries like
 * "tote bags Pakistan" or "festive potli bags". Each category represents a
 * distinct collection silo. In contrast, multi-parameter faceted combinations
 * (e.g. ?sort=price_asc&price=under-2000) are excluded from the sitemap
 * and given "noindex, follow" robots headers to prevent crawling low-value permutations.
 * =============================================================================
 */

// Production base domain (placeholder - update when production domain is connected)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic products and categories concurrently
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  const currentDate = new Date().toISOString();

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/policies/shipping`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/policies/returns`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/policies/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/policies/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Primary Category Collection Routes
  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter(
      (category) =>
        category.isActive !== false && (category.productCount ?? 0) > 0
    )
    .map((category) => ({
      url: `${BASE_URL}/category/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // 3. Product Detail Routes with Google Image Sitemap Extensions (Demo products excluded)
  const productRoutes: MetadataRoute.Sitemap = products
    .filter((product) => !product.isDemo)
    .map((product) => {
      // Collect all valid image URLs for the Google Image Sitemap extension
      const imageUrls: string[] = [];
      if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
          const url = urlForImage(img)?.width(1200).height(1200).url();
          if (url) imageUrls.push(url);
        });
      }

      return {
        url: `${BASE_URL}/shop/${product.slug}`,
        lastModified: product._updatedAt || product._createdAt || currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };
    });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
