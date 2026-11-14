// =============================================================================
// TYPE DEFINITIONS — SAZAIRA PRODUCTS & CATEGORIES
// Types for local data files (/data/products.ts & /data/categories.ts).
// =============================================================================

export type OccasionTag = "Everyday" | "Festive" | "Wedding" | "Casual";

export type StyleTag =
  | "printed"
  | "digital"
  | "botanical"
  | "embroidered"
  | "zari"
  | "gold-border";

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface ImageAsset {
  _id?: string;
  url: string;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
      aspectRatio: number;
    };
  };
}

export interface ProductImage {
  asset?: ImageAsset;
  url?: string;
  alt?: string;
  _key?: string;
}

export interface ColorVariant {
  colorName: string;
  colorHex?: string;
  colorImage?: ProductImage;
  _key?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  introText?: string;
  image?: ProductImage;
  hoverImage?: string;
  hoverImageObjectPosition?: string;
  displayOrder?: number;
  sortOrder?: number;
  productCount?: number;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Product {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  name: string;
  slug: string;
  category: Category;
  occasion?: OccasionTag[];
  styles?: StyleTag[];
  price: number;
  compareAtPrice?: number;
  shortDescription?: string;
  description?: string | any[];
  images: ProductImage[];
  colorVariants?: ColorVariant[];
  material?: string;
  dimensions?: string;
  details?: string[];
  care?: string[];
  sku?: string;
  stockStatus: StockStatus;
  isFeatured?: boolean;
  isEidCollection?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDemo?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}
