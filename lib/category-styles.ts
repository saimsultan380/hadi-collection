import type { StyleTag } from "@/types/product";

export interface StyleOption {
  label: string;
  value: StyleTag;
}

export const CATEGORY_STYLES_MAP: Record<string, StyleOption[]> = {
  "lawn-prints": [
    { label: "Printed", value: "printed" },
    { label: "Digital Print", value: "digital" },
  ],
  botanical: [{ label: "Botanical", value: "botanical" }],
  embroidered: [{ label: "Embroidered", value: "embroidered" }],
  "festive-edit": [
    { label: "Gold Border", value: "gold-border" },
    { label: "Zari", value: "zari" },
  ],
};

export function getStylesForCategory(categorySlug?: string): StyleOption[] {
  if (!categorySlug) return [];
  const normalized = categorySlug.toLowerCase();
  return CATEGORY_STYLES_MAP[normalized] || [];
}

export function colorToSlug(colorName: string): string {
  return colorName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function matchesColor(colorName: string, selectedColors?: string[]): boolean {
  if (!selectedColors || selectedColors.length === 0) return true;
  const normName = colorName.toLowerCase().trim();
  const slug = colorToSlug(colorName);
  return selectedColors.some((c) => {
    const normC = c.toLowerCase().trim();
    return (
      normName === normC ||
      slug === normC ||
      normName.includes(normC) ||
      slug.includes(normC)
    );
  });
}
