import type { ReactElement } from "react";
import { SOCIAL_LINKS } from "@/content/home";

// =============================================================================
// SHARED SOCIAL BRAND GLYPHS + SOCIAL ITEMS LIST
// =============================================================================
// Accurate official brand logo glyphs for Instagram, TikTok, Facebook and
// Pinterest (Simple Icons CC0 paths, optically centered).
// Clean inline SVG brand glyphs (no icon library, no external images).
// Consumed by the footer "Follow Us" block, the contact page and the homepage
// "Follow Hadi Collection" section.
// =============================================================================

interface GlyphProps {
  className?: string;
}

/** Official Instagram Camera Glyph (Simple Icons) */
export function InstagramGlyph({ className = "h-5 w-5" }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  );
}

/** Official TikTok Musical Note Glyph (Simple Icons) */
export function TikTokGlyph({ className = "h-5 w-5" }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

/** Official Facebook "f" Glyph (Simple Icons, optically centered) */
export function FacebookGlyph({ className = "h-5 w-5" }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.704 0-1.278.106-1.584.288-.396.232-.596.697-.596 1.385v2.315h4.161l-.64 3.667h-3.521v7.98c-2.457 0-5.124 0-5.124 0z" />
    </svg>
  );
}

/** Official Pinterest "P" Cursive Glyph (Simple Icons, optically centered) */
export function PinterestGlyph({ className = "h-5 w-5" }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M13.725 3.5c-4.464 0-6.725 3.036-6.725 5.59 0 1.542.613 2.915 1.928 3.427.216.085.334.004.385-.195.036-.145.122-.486.16-.632.052-.204.032-.275-.121-.454-.34-.397-.557-.91-.557-1.637 0-2.109 1.626-4.002 4.242-4.002 2.31 0 3.58 1.411 3.58 3.3 0 2.477-1.097 4.568-2.726 4.568-.9 0-1.572-.743-1.356-1.654.258-1.087.76-2.259.76-3.044 0-.702-.377-1.288-1.157-1.288-.918 0-1.656.95-1.656 2.221 0 .81.274 1.358.274 1.358l-1.087 4.606c-.321 1.36-.048 3.023-.024 3.195.014.099.138.123.194.049.078-.104 1.083-1.343 1.424-2.585l.546-2.083c.318.605 1.246 1.137 2.231 1.137 2.936 0 4.927-2.674 4.927-6.255 0-2.706-2.31-4.68-5.967-4.68z" />
    </svg>
  );
}

/** Official WhatsApp mark: speech bubble with the phone handset. */
export function WhatsAppGlyph({ className = "h-5 w-5" }: GlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.15 1.6 5.95L0 24l6.34-1.66a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.16-3.45-8.42Zm-8.46 18.3h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.67-.24-.38a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.9-9.87 9.9Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

/** Green circular WhatsApp button mark for contact rows and CTAs. */
export function WhatsAppIconBadge({ className = "h-8 w-8" }: GlyphProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white ${className}`}
      aria-hidden="true"
    >
      <WhatsAppGlyph className="h-[58%] w-[58%]" />
    </span>
  );
}

export interface SocialItem {
  id: string;
  /** Brand name shown in cards, e.g. "Instagram". */
  label: string;
  /** Display handle shown in cards, e.g. "@saza_ira". */
  handle: string;
  href: string;
  /** Accessible name, e.g. "Follow Hadi Collection on Instagram". */
  ariaLabel: string;
  /** Official flat brand background colour */
  bgHex: string;
  /** Slightly darker hover shade */
  hoverBgHex: string;
  /** Tailwind classes for background and hover */
  bgClass: string;
  hoverClass: string;
  focusRingClass: string;
  Icon: (props: GlyphProps) => ReactElement;
}

export const SOCIAL_ITEMS: readonly SocialItem[] = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@hadicollection.pk",
    href: SOCIAL_LINKS.instagram,
    ariaLabel: "Follow Hadi Collection on Instagram",
    bgHex: "#E1306C",
    hoverBgHex: "#C1275B",
    bgClass: "bg-[#E1306C]",
    hoverClass: "hover:bg-[#C1275B]",
    focusRingClass: "focus-visible:ring-[#E1306C]",
    Icon: InstagramGlyph,
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@hadicollection.pk",
    href: SOCIAL_LINKS.tiktok,
    ariaLabel: "Follow Hadi Collection on TikTok",
    bgHex: "#000000",
    hoverBgHex: "#1F1F1F",
    bgClass: "bg-[#000000]",
    hoverClass: "hover:bg-[#1F1F1F]",
    focusRingClass: "focus-visible:ring-[#000000]",
    Icon: TikTokGlyph,
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "@hadicollection.pk",
    href: SOCIAL_LINKS.facebook,
    ariaLabel: "Follow Hadi Collection on Facebook",
    bgHex: "#1877F2",
    hoverBgHex: "#145DBF",
    bgClass: "bg-[#1877F2]",
    hoverClass: "hover:bg-[#145DBF]",
    focusRingClass: "focus-visible:ring-[#1877F2]",
    Icon: FacebookGlyph,
  },
  {
    id: "pinterest",
    label: "Pinterest",
    handle: "@hadicollection.pk",
    href: SOCIAL_LINKS.pinterest,
    ariaLabel: "Follow Hadi Collection on Pinterest",
    bgHex: "#E60023",
    hoverBgHex: "#B8001C",
    bgClass: "bg-[#E60023]",
    hoverClass: "hover:bg-[#B8001C]",
    focusRingClass: "focus-visible:ring-[#E60023]",
    Icon: PinterestGlyph,
  },
];
