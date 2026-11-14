// =============================================================================
// IMAGE URL RESOLVER
// Replaces Sanity image builder with pure local and static asset handling.
// Keeps the fluent builder interface (.width().height().url()) for 100% compatibility.
// =============================================================================

export interface ImageBuilderResult {
  width: (w: number) => ImageBuilderResult;
  height: (h: number) => ImageBuilderResult;
  url: () => string;
}

/**
 * Returns true for any external URL that is NOT whitelisted in next.config.ts.
 * Kept intentionally in sync with isBadImageUrl in lib/cart-migration.ts.
 */
function isDisallowedRemote(rawUrl: string): boolean {
  try {
    const { hostname } = new URL(rawUrl);
    if (hostname === "images.unsplash.com") return false;
    if (hostname.endsWith(".supabase.co")) return false;
    // Any other external host (cdn.sanity.io, etc.) is disallowed
    return true;
  } catch {
    // Not a full URL → local path, safe
    return false;
  }
}

export function urlForImage(
  source: any
): ImageBuilderResult | null {
  if (!source) return null;

  let rawUrl = "";

  if (typeof source === "string") {
    rawUrl = source;
  } else if (source?.asset?.url && typeof source.asset.url === "string") {
    rawUrl = source.asset.url;
  } else if (source?.url && typeof source.url === "string") {
    rawUrl = source.url;
  } else if (source?.asset?._ref && typeof source.asset._ref === "string") {
    rawUrl = source.asset._ref;
  }

  if (!rawUrl) return null;

  // Guard: never expose a disallowed remote URL to next/image
  if (isDisallowedRemote(rawUrl)) {
    console.warn(
      `[urlForImage] Blocked disallowed remote image URL: ${rawUrl}`
    );
    return null;
  }

  const builder: ImageBuilderResult = {
    width: (_w: number) => builder,
    height: (_h: number) => builder,
    url: () => rawUrl,
  };

  return builder;
}
