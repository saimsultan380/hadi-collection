import type { MetadataRoute } from "next";

/**
 * =============================================================================
 * SAZAIRA ROBOTS.TXT DIRECTIVES (robots.txt)
 * =============================================================================
 * Guides search engine crawlers (Googlebot, Bingbot, etc.):
 * - Allows public indexing of storefront, categories, editorial, and product pages
 * - Disallows sensitive routes: CMS studio, internal API handlers, cart, checkout,
 *   and order confirmation pages
 * - Disallows combinatorial query parameters (e.g. ?sort=, ?price=) to conserve crawl budget
 *   and prevent indexing low-value duplicate permutations
 * - References the dynamic XML sitemap
 * =============================================================================
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio",
          "/studio/",
          "/studio/*",
          "/api/",
          "/api/*",
          "/cart",
          "/cart/",
          "/checkout",
          "/checkout/",
          "/order-confirmation",
          "/order-confirmation/",
          "/order-confirmation/*",
          "/*?*sort=*",
          "/*?*price=*",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
