"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { urlForImage } from "@/lib/image";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

// =============================================================================
// COMPLETE THE LOOK — Related Accessories
// 2–3 compact rows with thumbnail, name, price, and outlined "+ Add" button.
// Hidden if no matching accessories exist.
// =============================================================================

interface ProductCompleteLookProps {
  accessories: Product[];
}

export function ProductCompleteLook({ accessories }: ProductCompleteLookProps) {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  if (!accessories || accessories.length === 0) {
    return null;
  }

  const handleAdd = (item: Product) => {
    addToCart(item, 1, item.colorVariants?.[0] || null);
    setAddedIds((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item._id]: false }));
    }, 2000);
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6B] mb-1">
          Pair It With
        </p>
        <h2 className="font-sans text-xl font-semibold uppercase tracking-[0.02em] text-black sm:text-2xl">
          Complete The Look
        </h2>
      </div>

      <div className="flex flex-col divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
        {accessories.slice(0, 3).map((item) => {
          const isAdded = Boolean(addedIds[item._id]);
          const imageUrl = item.images?.[0]
            ? urlForImage(item.images[0])?.width(200).height(200).url()
            : null;

          return (
            <div
              key={item._id}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              {/* Thumbnail + Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <Link
                  href={`/shop/${item.slug}`}
                  className="relative h-14 w-14 shrink-0 bg-[#F7F7F7] overflow-hidden block rounded-[8px]"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.images?.[0]?.alt || item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#F7F7F7] text-[9px] uppercase tracking-wider text-[#6B6B6B]">
                      SZR
                    </div>
                  )}
                </Link>

                <div className="min-w-0">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="font-sans text-[13px] font-medium text-black hover:underline line-clamp-1 block"
                  >
                    {item.name}
                  </Link>
                  <p className="font-sans text-[12px] text-[#6B6B6B] mt-0.5">
                    PKR {item.price.toLocaleString("en-PK")}
                  </p>
                </div>
              </div>

              {/* + Add Button */}
              <button
                type="button"
                onClick={() => handleAdd(item)}
                disabled={item.stockStatus === "Out of Stock"}
                className={`flex shrink-0 items-center justify-center gap-1.5 border px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.08em] transition-all rounded-[8px] cursor-pointer ${
                  isAdded
                    ? "border-black bg-black text-white"
                    : "border-black bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="h-3 w-3 stroke-[2]" />
                    <span>Added</span>
                  </>
                ) : item.stockStatus === "Out of Stock" ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <Plus className="h-3 w-3 stroke-[2]" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProductCompleteLook;
