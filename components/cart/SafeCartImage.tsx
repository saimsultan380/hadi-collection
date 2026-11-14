"use client";

import Image from "next/image";
import { isBadImageUrl } from "@/lib/cart-migration";
import { urlForImage } from "@/lib/image";
import type { ProductImage } from "@/types/product";

// =============================================================================
// SAFE CART IMAGE
// Resolves a ProductImage to a URL, guards against disallowed remote hosts,
// and renders a neutral placeholder box instead of throwing.
// =============================================================================

interface SafeCartImageProps {
  image: ProductImage | undefined | null;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
}

function PlaceholderBox({ alt }: { alt: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-[#F7F7F7]"
      aria-label={alt}
    >
      <span className="block text-center text-[9px] font-medium uppercase leading-tight text-[#6B6B6B]">
        Hadi Collection
      </span>
    </div>
  );
}

export function SafeCartImage({
  image,
  alt,
  width,
  height,
  sizes,
  className,
}: SafeCartImageProps) {
  if (!image) return <PlaceholderBox alt={alt} />;

  const rawUrl = urlForImage(image)?.width(width).height(height).url();

  if (!rawUrl || isBadImageUrl(rawUrl)) {
    return <PlaceholderBox alt={alt} />;
  }

  return (
    <Image
      src={rawUrl}
      alt={alt}
      fill
      sizes={sizes ?? `${width}px`}
      className={className ?? "object-cover"}
    />
  );
}

export default SafeCartImage;
