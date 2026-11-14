/**
 * =============================================================================
 * SAZAIRA — CART MIGRATION UTILITY
 * =============================================================================
 * Strips old Sanity CDN image URLs from persisted cart items and replaces them
 * with the matching local product image from /data/products.ts.
 *
 * Run once on cart hydration whenever the stored version is missing or older
 * than the current CART_VERSION.
 * =============================================================================
 */

import { PRODUCTS } from "@/data/products";
import type { CartItem } from "@/types/order";
import type { ProductImage } from "@/types/product";

// ── Version sentinel stored alongside the cart array ──────────────────────────
export const CART_VERSION = "hadi-cart-v1";

/** Returns true if the URL should NOT be passed to next/image. */
export function isBadImageUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    // Reject any external host that is not whitelisted in next.config.ts
    const allowed = ["images.unsplash.com"];
    if (allowed.includes(hostname)) return false;
    // supabase.co wildcard (storage bucket uploads)
    if (hostname.endsWith(".supabase.co")) return false;
    // Local paths start with / — no hostname
    return true; // everything else (cdn.sanity.io etc.) is bad
  } catch {
    // Not a full URL — treat as local path, safe to use
    return false;
  }
}

/** Extract the raw URL string from a ProductImage object. */
function extractUrl(img: ProductImage | undefined | null): string | null {
  if (!img) return null;
  if (img.asset?.url) return img.asset.url;
  if (img.url) return img.url;
  return null;
}

/**
 * Find the local product matching the cart item (by productSlug or id field),
 * and return the best local image for the item's selected variant.
 * Returns null if the product is not found.
 */
function resolveLocalImage(
  item: CartItem
): { image: ProductImage; found: true } | { found: false } {
  const product = PRODUCTS.find(
    (p) =>
      p.slug === item.productSlug ||
      p._id === item.id ||
      item.id.startsWith(p.slug + "-")
  );

  if (!product) return { found: false };

  // Try to find the variant-specific image first
  if (item.selectedVariant?.colorName && product.colorVariants) {
    const variant = product.colorVariants.find(
      (v) => v.colorName === item.selectedVariant!.colorName
    );
    if (variant?.colorImage) {
      const url = extractUrl(variant.colorImage);
      if (url && !isBadImageUrl(url)) {
        return { image: variant.colorImage, found: true };
      }
    }
  }

  // Fall back to the first product image
  const firstImage = product.images?.[0];
  if (firstImage) {
    const url = extractUrl(firstImage);
    if (url && !isBadImageUrl(url)) {
      return { image: firstImage, found: true };
    }
  }

  // Product exists but has no usable local image — return a null-asset image
  return {
    image: { asset: { _id: "placeholder", url: "" }, alt: item.name },
    found: true,
  };
}

/**
 * Migrate an array of raw (potentially Sanity-tainted) cart items:
 * - Items whose image URL is a bad external URL — replaced with local image
 * - Items whose product no longer exists in /data — removed silently
 * - Items with a missing or already-local image — left untouched
 */
export function migrateCartItems(rawItems: unknown[]): CartItem[] {
  const migrated: CartItem[] = [];

  for (const raw of rawItems) {
    // Basic shape guard
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    if (
      typeof item.id !== "string" ||
      typeof item.productSlug !== "string" ||
      typeof item.name !== "string" ||
      typeof item.price !== "number" ||
      typeof item.quantity !== "number"
    ) {
      continue;
    }

    const cartItem = raw as CartItem;
    const resolution = resolveLocalImage(cartItem);
    if (!resolution.found) {
      continue;
    }

    const currentUrl = extractUrl(cartItem.image as ProductImage | undefined);
    if (currentUrl && isBadImageUrl(currentUrl)) {
      migrated.push({ ...cartItem, image: resolution.image });
    } else {
      migrated.push(cartItem);
    }
  }

  return migrated;
}
