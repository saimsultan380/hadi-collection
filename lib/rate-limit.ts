/**
 * =============================================================================
 * SAZAIRA — RATE LIMITER (In-Memory Sliding Window)
 * =============================================================================
 * Limits rate of order confirmation lookups per IP address to prevent brute-force
 * guessing of order tokens.
 * =============================================================================
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const lookupAttempts = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
if (typeof setInterval !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of lookupAttempts.entries()) {
      if (entry.resetAt < now) {
        lookupAttempts.delete(key);
      }
    }
  }, 60000);
  interval.unref?.();
}

/**
 * Checks if a client IP is allowed to perform an order token lookup.
 * Default: Maximum 30 attempts per 60 seconds per IP.
 */
export function checkOrderLookupRateLimit(
  ip: string,
  limit = 30,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const entry = lookupAttempts.get(ip);

  if (!entry || entry.resetAt < now) {
    lookupAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}
