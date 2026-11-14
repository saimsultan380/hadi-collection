import type { Product, ProductImage } from "@/types/product";
import { CATEGORIES } from "./categories";

const cat = (slug: string) => {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Category not found: ${slug}`);
  return found;
};

const photo = (id: string, file: string, alt: string): ProductImage[] => [
  {
    asset: { _id: id, url: `/images/hadi/${file}` },
    alt,
  },
];

export const PRODUCTS: Product[] = [
  {
    _id: "prod-noor-floral",
    _createdAt: "2026-11-08T00:00:00Z",
    _updatedAt: "2026-11-08T00:00:00Z",
    name: "Noor Floral Lawn",
    slug: "noor-floral-lawn",
    category: cat("lawn-prints"),
    occasion: ["Everyday", "Casual"],
    styles: ["printed"],
    price: 4850,
    compareAtPrice: 5600,
    shortDescription:
      "Ice-blue floral lawn 3-piece with a plain trouser and a wide bordered dupatta.",
    description:
      "An unstitched 3-piece lawn suit. Printed shirt, plain ice-blue trouser, and a floral dupatta with a dark border. Light enough for daytime and easy to stitch in a straight or frock cut.",
    material: "Printed lawn",
    dimensions: "Unstitched 3-piece · shirt, trouser, dupatta",
    stockStatus: "In Stock",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isDemo: false,
    images: photo(
      "img-noor",
      "noor-floral.jpg",
      "Noor Floral Lawn unstitched 3-piece by Hadi Collection"
    ),
    colorVariants: [{ colorName: "Ice Blue", colorHex: "#C5D5DC" }],
    seoTitle: "Noor Floral Lawn 3-Piece | Hadi Collection",
    seoDescription:
      "Ice-blue floral printed lawn 3-piece suit. Unstitched, with cash on delivery across Pakistan.",
  },
  {
    _id: "prod-mehr-geometric",
    _createdAt: "2026-11-07T00:00:00Z",
    _updatedAt: "2026-11-07T00:00:00Z",
    name: "Mehr Geometric Lawn",
    slug: "mehr-geometric-lawn",
    category: cat("lawn-prints"),
    occasion: ["Everyday", "Festive"],
    styles: ["digital"],
    price: 5250,
    compareAtPrice: 6100,
    shortDescription:
      "Navy geometric print with a plain trouser and a fan-pleat bordered dupatta.",
    description:
      "A 3-piece unstitched lawn suit in navy, sand and ivory. The shirt carries a tile print, the trouser is plain navy, and the dupatta opens into a striped border.",
    material: "Digital printed lawn",
    dimensions: "Unstitched 3-piece · shirt, trouser, dupatta",
    stockStatus: "In Stock",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isDemo: false,
    images: photo(
      "img-mehr",
      "mehr-geometric.jpg",
      "Mehr Geometric Lawn unstitched 3-piece by Hadi Collection"
    ),
    colorVariants: [{ colorName: "Navy Tile", colorHex: "#243656" }],
  },
  {
    _id: "prod-zarah-botanical",
    _createdAt: "2026-11-06T00:00:00Z",
    _updatedAt: "2026-11-06T00:00:00Z",
    name: "Zarah Botanical",
    slug: "zarah-botanical",
    category: cat("botanical"),
    occasion: ["Everyday", "Festive"],
    styles: ["botanical"],
    price: 6450,
    compareAtPrice: 7200,
    shortDescription:
      "Teal lawn with a gold leaf print, plain trouser, and a wide gold border on the dupatta.",
    description:
      "A botanical 3-piece in teal and antique gold. The shirt and dupatta share a leaf motif, finished with a woven-look gold border. The trouser is plain teal.",
    material: "Printed lawn with gold border",
    dimensions: "Unstitched 3-piece · shirt, trouser, dupatta",
    stockStatus: "In Stock",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isDemo: false,
    images: photo(
      "img-zarah",
      "zarah-botanical.jpg",
      "Zarah Botanical unstitched suit by Hadi Collection"
    ),
    colorVariants: [{ colorName: "Teal Gold", colorHex: "#1F6A72" }],
  },
  {
    _id: "prod-gul-embroidered",
    _createdAt: "2026-11-05T00:00:00Z",
    _updatedAt: "2026-11-05T00:00:00Z",
    name: "Gul Embroidered",
    slug: "gul-embroidered",
    category: cat("embroidered"),
    occasion: ["Wedding", "Festive"],
    styles: ["embroidered"],
    price: 7890,
    compareAtPrice: 9200,
    shortDescription:
      "Plum and charcoal 3-piece with floral embroidery across the shirt and dupatta.",
    description:
      "An embroidered 3-piece for evenings and wedding events. Charcoal shirt with plum florals, a plain plum trouser, and a plum dupatta with a scattered motif and border.",
    material: "Embroidered lawn",
    dimensions: "Unstitched 3-piece · shirt, trouser, dupatta",
    stockStatus: "Low Stock",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isDemo: false,
    images: photo(
      "img-gul",
      "gul-embroidered.jpg",
      "Gul Embroidered 3-piece suit by Hadi Collection"
    ),
    colorVariants: [{ colorName: "Plum", colorHex: "#6E3450" }],
  },
  {
    _id: "prod-rani-festive",
    _createdAt: "2026-11-04T00:00:00Z",
    _updatedAt: "2026-11-04T00:00:00Z",
    name: "Rani Festive",
    slug: "rani-festive",
    category: cat("festive-edit"),
    occasion: ["Festive", "Wedding"],
    styles: ["gold-border"],
    price: 8650,
    compareAtPrice: 10500,
    shortDescription:
      "Teal, maroon and purple festive 3-piece with a broad gold paisley border.",
    description:
      "A festive unstitched 3-piece. The dupatta carries teal, maroon and purple panels with a gold paisley border. Two plain teal pieces complete the suit for shirt and trouser.",
    material: "Festive lawn with gold border",
    dimensions: "Unstitched 3-piece · shirt, trouser, dupatta",
    stockStatus: "In Stock",
    isFeatured: true,
    isBestSeller: true,
    isEidCollection: true,
    isNewArrival: true,
    isDemo: false,
    images: photo(
      "img-rani",
      "rani-festive.jpg",
      "Rani Festive gold-border suit by Hadi Collection"
    ),
    colorVariants: [{ colorName: "Teal Maroon", colorHex: "#0E6E78" }],
  },
  {
    _id: "prod-neel-festive",
    _createdAt: "2026-11-03T00:00:00Z",
    _updatedAt: "2026-11-03T00:00:00Z",
    name: "Neel Festive",
    slug: "neel-festive",
    category: cat("festive-edit"),
    occasion: ["Wedding", "Festive"],
    styles: ["zari"],
    price: 8450,
    compareAtPrice: 9900,
    shortDescription:
      "Navy and maroon festive suit with a silver-gold paisley panel and plain navy trousers.",
    description:
      "A deep festive 3-piece in navy and maroon. The dupatta has a wide paisley panel framed in gold, with plain navy fabric for the shirt and trouser.",
    material: "Festive lawn with zari-look border",
    dimensions: "Unstitched 3-piece · shirt, trouser, dupatta",
    stockStatus: "In Stock",
    isFeatured: true,
    isBestSeller: false,
    isEidCollection: true,
    isNewArrival: false,
    isDemo: false,
    images: photo(
      "img-neel",
      "neel-festive.jpg",
      "Neel Festive navy and maroon suit by Hadi Collection"
    ),
    colorVariants: [{ colorName: "Navy Maroon", colorHex: "#1C2C55" }],
  },
];
