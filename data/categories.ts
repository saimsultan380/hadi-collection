import type { Category } from "@/types/product";

// =============================================================================
// HADI COLLECTION — CLOTHING CATEGORIES
// Ladies unstitched suits: lawn, botanical, embroidered, and festive edits.
// =============================================================================

export const CATEGORIES: Category[] = [
  {
    _id: "cat-lawn",
    title: "Lawn Prints",
    slug: "lawn-prints",
    description:
      "Light, breathable lawn 3-piece suits with printed shirts and bordered dupattas for everyday and daytime dressing.",
    introText:
      "Light, breathable lawn 3-piece suits with printed shirts and bordered dupattas for everyday and daytime dressing.",
    displayOrder: 1,
    sortOrder: 1,
    isActive: true,
    seoTitle: "Printed Lawn Suits for Women in Pakistan | Hadi Collection",
    seoDescription:
      "Shop unstitched printed lawn 3-piece suits from Hadi Collection. Cash on delivery and nationwide delivery across Pakistan.",
    image: {
      asset: { _id: "img-cat-lawn", url: "/images/hadi/noor-floral.jpg" },
      alt: "Ice-blue floral printed lawn 3-piece suit by Hadi Collection",
    },
    hoverImage: "/images/hadi/mehr-geometric.jpg",
    hoverImageObjectPosition: "center center",
    productCount: 2,
  },
  {
    _id: "cat-botanical",
    title: "Botanical",
    slug: "botanical",
    description:
      "Leaf and garden prints in calm tones, finished with gold borders for a polished daytime look.",
    introText:
      "Leaf and garden prints in calm tones, finished with gold borders for a polished daytime look.",
    displayOrder: 2,
    sortOrder: 2,
    isActive: true,
    seoTitle: "Botanical Print Suits in Pakistan | Hadi Collection",
    seoDescription:
      "Shop botanical printed unstitched suits from Hadi Collection. 3-piece sets with lawn trousers and bordered dupattas.",
    image: {
      asset: { _id: "img-cat-botanical", url: "/images/hadi/zarah-botanical.jpg" },
      alt: "Teal and gold botanical unstitched suit by Hadi Collection",
    },
    hoverImage: "/images/hadi/noor-floral.jpg",
    hoverImageObjectPosition: "center center",
    productCount: 1,
  },
  {
    _id: "cat-embroidered",
    title: "Embroidered",
    slug: "embroidered",
    description:
      "Floral embroidery on shirt and dupatta, cut as a ready-to-stitch 3-piece for evenings and celebrations.",
    introText:
      "Floral embroidery on shirt and dupatta, cut as a ready-to-stitch 3-piece for evenings and celebrations.",
    displayOrder: 3,
    sortOrder: 3,
    isActive: true,
    seoTitle: "Embroidered Unstitched Suits in Pakistan | Hadi Collection",
    seoDescription:
      "Shop embroidered 3-piece unstitched suits from Hadi Collection. Premium fabric with nationwide cash on delivery.",
    image: {
      asset: { _id: "img-cat-embroidered", url: "/images/hadi/gul-embroidered.jpg" },
      alt: "Plum floral embroidered 3-piece suit by Hadi Collection",
    },
    hoverImage: "/images/hadi/rani-festive.jpg",
    hoverImageObjectPosition: "center center",
    productCount: 1,
  },
  {
    _id: "cat-festive",
    title: "Festive Edit",
    slug: "festive-edit",
    description:
      "Gold-bordered festive suits in deep jewel tones for Eid, mehndi, barat and wedding week.",
    introText:
      "Gold-bordered festive suits in deep jewel tones for Eid, mehndi, barat and wedding week.",
    displayOrder: 4,
    sortOrder: 4,
    isActive: true,
    seoTitle: "Festive Unstitched Suits for Eid & Weddings | Hadi Collection",
    seoDescription:
      "Shop festive 3-piece unstitched suits with gold borders from Hadi Collection. Made for Eid, weddings and celebrations in Pakistan.",
    image: {
      asset: { _id: "img-cat-festive", url: "/images/hadi/rani-festive.jpg" },
      alt: "Teal, maroon and gold festive 3-piece suit by Hadi Collection",
    },
    hoverImage: "/images/hadi/neel-festive.jpg",
    hoverImageObjectPosition: "center center",
    productCount: 2,
  },
];

export const ALL_SUITS_STRIP_ITEM = {
  id: "all-suits",
  title: "All Suits",
  href: "/shop",
  imageUrl: "/images/hadi/gul-embroidered.jpg",
  alt: "Hadi Collection unstitched suits",
};

/** @deprecated Bag-era export. Kept so older imports keep compiling during the rebrand. */
export const ALL_BAGS_STRIP_ITEM = ALL_SUITS_STRIP_ITEM;
