/**
 * =============================================================================
 * SAZAIRA SEASONAL BANNER SYSTEM
 * =============================================================================
 *
 * This utility manages the homepage promo banner based on the time of year.
 *
 * HOW IT WORKS:
 * 1. Eid dates shift annually on the Gregorian calendar (~10-11 days earlier each year)
 *    because the Islamic calendar is lunar.
 * 2. During defined Eid windows (approx. 2 weeks before each Eid through the holidays),
 *    the banner dynamically presents the "Eid Collection".
 * 3. Outside of these windows, it automatically serves an evergreen fallback banner:
 *    - "Wedding & Formal Collection" (Default)
 *    - "Best Sellers"
 *
 * -----------------------------------------------------------------------------
 * 📅 ANNUAL MAINTENANCE (UPDATE ONCE A YEAR):
 * To update Eid dates for next year, simply add new start and end date windows
 * to the `EID_WINDOWS` array below in 'YYYY-MM-DD' format.
 * -----------------------------------------------------------------------------
 */

export interface EidWindow {
  label: string;
  start: string; // ISO date string 'YYYY-MM-DD' (inclusive)
  end: string; // ISO date string 'YYYY-MM-DD' (inclusive)
}

export type BannerType = "eid" | "wedding" | "bestsellers";

export interface SeasonalBannerConfig {
  type: BannerType;
  badge: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColorClass: string;
  textColorClass: string;
}

/**
 * -----------------------------------------------------------------------------
 * 1. CONFIGURE ANNUAL EID WINDOWS HERE
 * -----------------------------------------------------------------------------
 * Windows span ~2 weeks prior to shopping season through the end of Eid days.
 * Update or append upcoming years here as needed.
 */
export const EID_WINDOWS: EidWindow[] = [
  // ── 2025 ───────────────────────────────────────────────────────────────────
  {
    label: "Eid-ul-Fitr 2025",
    start: "2025-03-15",
    end: "2025-04-05",
  },
  {
    label: "Eid-ul-Adha 2025",
    start: "2025-05-23",
    end: "2025-06-12",
  },

  // ── 2026 ───────────────────────────────────────────────────────────────────
  {
    label: "Eid-ul-Fitr 2026",
    start: "2026-03-05",
    end: "2026-03-26",
  },
  {
    label: "Eid-ul-Adha 2026",
    start: "2026-05-12",
    end: "2026-06-02",
  },

  // ── 2027 ───────────────────────────────────────────────────────────────────
  {
    label: "Eid-ul-Fitr 2027",
    start: "2027-02-22",
    end: "2027-03-16",
  },
  {
    label: "Eid-ul-Adha 2027",
    start: "2027-05-02",
    end: "2027-05-23",
  },

  // ── 2028 ───────────────────────────────────────────────────────────────────
  {
    label: "Eid-ul-Fitr 2028",
    start: "2028-02-11",
    end: "2028-03-04",
  },
  {
    label: "Eid-ul-Adha 2028",
    start: "2028-04-20",
    end: "2028-05-11",
  },
];

/**
 * -----------------------------------------------------------------------------
 * 2. EVERGREEN FALLBACK BANNER SELECTION (ONE-LINE TOGGLE)
 * -----------------------------------------------------------------------------
 * Choose the active default evergreen fallback when outside an Eid window.
 * Options: "wedding" | "bestsellers"
 */
export const DEFAULT_FALLBACK_BANNER: "wedding" | "bestsellers" = "wedding";

/**
 * -----------------------------------------------------------------------------
 * 3. BANNER PRESET DEFINITIONS
 * -----------------------------------------------------------------------------
 * All styles follow Hadi Collection's flat design system with solid tones & contrast.
 */
export const BANNER_PRESETS: Record<BannerType, SeasonalBannerConfig> = {
  eid: {
    type: "eid",
    badge: "Seasonal Feature",
    heading: "Eid Collection — Elegance for Every Occasion",
    description:
      "Gold-bordered and embroidered unstitched suits for Eid, mehndi and wedding week.",
    ctaText: "Explore Eid Collection",
    ctaLink: "/shop?occasion=Festive",
    bgColorClass: "bg-gold",
    textColorClass: "text-black",
  },
  wedding: {
    type: "wedding",
    badge: "Featured Collection",
    heading: "Wedding & Formal Collection — Elegance for Every Celebration",
    description:
      "Festive 3-piece suits in jewel tones, cut later to your own measurements.",
    ctaText: "Explore Wedding & Formal",
    ctaLink: "/shop?occasion=Wedding",
    bgColorClass: "bg-gold",
    textColorClass: "text-black",
  },
  bestsellers: {
    type: "bestsellers",
    badge: "Customer Favorites",
    heading: "Best Sellers — Loved by Thousands",
    description:
      "The suits customers ask for first — lawn prints, embroidery and festive borders.",
    ctaText: "Explore Best Sellers",
    ctaLink: "/shop?bestseller=true",
    bgColorClass: "bg-gold",
    textColorClass: "text-black",
  },
};

/**
 * Checks if a given date falls within an Eid window range (inclusive).
 */
export function isDateInWindow(targetDate: Date, window: EidWindow): boolean {
  // Normalize date comparison in YYYY-MM-DD
  const targetYear = targetDate.getFullYear();
  const targetMonth = String(targetDate.getMonth() + 1).padStart(2, "0");
  const targetDay = String(targetDate.getDate()).padStart(2, "0");
  const targetIso = `${targetYear}-${targetMonth}-${targetDay}`;

  return targetIso >= window.start && targetIso <= window.end;
}

/**
 * Finds the currently active Eid window if one exists for the given date.
 */
export function getActiveEidWindow(
  currentDate: Date = new Date()
): EidWindow | null {
  for (const window of EID_WINDOWS) {
    if (isDateInWindow(currentDate, window)) {
      return window;
    }
  }
  return null;
}

/**
 * Resolves the banner configuration for the homepage based on current date.
 *
 * @param currentDate - Optional custom date for testing or simulation (defaults to now)
 * @param fallback - Optional override for fallback banner ("wedding" | "bestsellers")
 * @returns SeasonalBannerConfig object with title, text, link, and styling
 */
export function getSeasonalBanner(
  currentDate: Date = new Date(),
  fallback: "wedding" | "bestsellers" = DEFAULT_FALLBACK_BANNER
): SeasonalBannerConfig {
  const activeEid = getActiveEidWindow(currentDate);

  if (activeEid) {
    return BANNER_PRESETS.eid;
  }

  return BANNER_PRESETS[fallback] || BANNER_PRESETS.wedding;
}
