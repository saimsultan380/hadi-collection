"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Check,
  ShoppingBag,
  AlertCircle,
  Star,
  Share2,
  Link2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductTrustBadges } from "@/components/product/ProductTrustBadges";
import type { Product, ColorVariant } from "@/types/product";
import type { ReviewStats } from "@/types/review";
import { useCart } from "@/context/CartContext";
import { createDirectProductWhatsAppLink } from "@/lib/whatsapp";

// =============================================================================
// PRODUCT ACTIONS & INFORMATION (RIGHT COLUMN)
// Follows strict ordering & design tokens:
// 1. Category label + badges
// 2. Product title
// 3. Star rating + "(N reviews)" link under title (smooth scrolls to #reviews)
// 4. Price row + "You save PKR X" + SKU
// 5. Short description
// 6. Color selector
// 7. Stock status ("Only X left" when <= 5)
// 8. Quantity + ADD TO BAG + outlined BUY IT NOW
// 9. ORDER VIA WHATSAPP button
// 10. Trust row (3 equal columns)
// 11. Accordion (Description, Details & Size, Care, Shipping & Returns)
// 12. Share row (WhatsApp, Facebook, Copy link)
// =============================================================================

interface ProductActionsProps {
  product: Product;
  selectedVariant: ColorVariant | null;
  onSelectVariant: (variant: ColorVariant) => void;
  reviewStats?: ReviewStats;
}

export function ProductActions({
  product,
  selectedVariant,
  onSelectVariant,
  reviewStats,
}: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { addToCart } = useCart();

  // Accordion state (First section 'Description' open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    details: false,
    care: false,
    shipping: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isOutOfStock = product.stockStatus === "Out of Stock";
  const isLowStock = product.stockStatus === "Low Stock";
  const isSale = Boolean(
    product.compareAtPrice && product.compareAtPrice > product.price
  );

  const discountPercent =
    isSale && product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : null;

  const savingsAmount =
    isSale && product.compareAtPrice
      ? product.compareAtPrice - product.price
      : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  };

  const handleBuyItNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariant);
    router.push("/checkout");
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const scrollToReviews = () => {
    const el = document.getElementById("reviews");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const directWhatsAppUrl = createDirectProductWhatsAppLink({
    productName: product.name,
    productSlug: product.slug,
    price: product.price,
    quantity,
    selectedVariant,
  });

  const shareOnWhatsApp = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const text = encodeURIComponent(`Check out ${product.name} at Hadi Collection: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareOnFacebook = () => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const copyProductLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Extract dimensions breakdown if available
  const parseDimensions = (dimString?: string) => {
    if (!dimString) return null;
    const lengthMatch = dimString.match(/(\d+(?:\.\d+)?\s*(?:in|cm|mm)?)\s*(?:\(W\)|\(L\)|W|L|width|length)/i);
    const heightMatch = dimString.match(/(\d+(?:\.\d+)?\s*(?:in|cm|mm)?)\s*(?:\(H\)|H|height)/i);
    const depthMatch = dimString.match(/(\d+(?:\.\d+)?\s*(?:in|cm|mm)?)\s*(?:\(D\)|D|depth)/i);

    return {
      length: lengthMatch ? lengthMatch[1] : null,
      height: heightMatch ? heightMatch[1] : null,
      depth: depthMatch ? depthMatch[1] : null,
    };
  };

  const parsedDim = parseDimensions(product.dimensions);

  const reviewCount = reviewStats?.totalReviews || 0;
  const avgRating = reviewStats?.averageRating || 0;

  return (
    <div className="flex flex-col gap-6 text-black">
      {/* 1. Category label + Badges */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {product.category?.title && (
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-[#6B6B6B]">
              {product.category.title}
            </span>
          )}

          {product.isBestSeller && (
            <Badge
              variant="default"
              className="text-[10px] px-2 py-0.5 font-medium uppercase tracking-[0.08em]"
            >
              Best Seller
            </Badge>
          )}

          {isSale && (
            <Badge
              variant="sale"
              className="text-[10px] px-2 py-0.5 font-medium uppercase tracking-[0.08em]"
            >
              {discountPercent ? `${discountPercent}% OFF` : "Sale"}
            </Badge>
          )}
        </div>

        {/* 2. Product Title */}
        <h1 className="font-sans text-2xl sm:text-3xl font-semibold uppercase tracking-[0.02em] text-black">
          {product.name}
        </h1>

        {/* 3. Star rating + "(N reviews)" link under title */}
        <div className="flex items-center gap-2 pt-0.5">
          {reviewCount > 0 ? (
            <button
              type="button"
              onClick={scrollToReviews}
              className="flex items-center gap-2 text-left group focus:outline-none"
              aria-label={`View ${reviewCount} customer reviews`}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Math.round(avgRating)
                        ? "fill-[#F5A623] text-[#F5A623]"
                        : "fill-transparent text-[#E5E5E5]"
                    }`}
                  />
                ))}
              </div>
              <span className="font-sans text-[12px] text-[#6B6B6B] group-hover:text-black group-hover:underline transition-colors">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={scrollToReviews}
              className="flex items-center gap-1.5 text-left group focus:outline-none"
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3.5 w-3.5 fill-transparent text-[#D4D4D4]"
                  />
                ))}
              </div>
              <span className="font-sans text-[12px] text-[#6B6B6B] group-hover:text-black group-hover:underline transition-colors">
                No reviews yet
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Price Row + You Save + SKU */}
      <div className="flex flex-col gap-1 border-y border-[#E5E5E5] py-4">
        <div className="flex items-baseline gap-3">
          <span className="font-sans text-2xl font-semibold text-black">
            PKR {product.price.toLocaleString("en-PK")}
          </span>

          {isSale && product.compareAtPrice && (
            <span className="font-sans text-sm text-[#6B6B6B] line-through">
              PKR {product.compareAtPrice.toLocaleString("en-PK")}
            </span>
          )}
        </div>

        {isSale && savingsAmount > 0 && (
          <p className="font-sans text-[12px] font-medium text-[#6B6B6B]">
            You save PKR {savingsAmount.toLocaleString("en-PK")}
          </p>
        )}

        <p className="font-sans text-[11px] uppercase tracking-[0.06em] text-[#8C8C8C] pt-0.5">
          SKU: {product._id || product.slug}
        </p>
      </div>

      {/* 5. Short Description */}
      {product.shortDescription && (
        <p className="font-sans text-[13px] leading-relaxed text-[#6B6B6B]">
          {product.shortDescription}
        </p>
      )}

      {/* 6. Color Selector */}
      {product.colorVariants && product.colorVariants.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center justify-between font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-black">
            <span>
              Color:{" "}
              <strong className="font-semibold">
                {selectedVariant?.colorName || product.colorVariants[0].colorName}
              </strong>
            </span>
          </label>

          <div className="flex flex-wrap gap-2">
            {product.colorVariants.map((variant) => {
              const isSelected =
                (selectedVariant?.colorName ||
                  product.colorVariants![0].colorName) === variant.colorName;

              return (
                <button
                  key={variant.colorName}
                  type="button"
                  onClick={() => onSelectVariant(variant)}
                  aria-label={`Select color ${variant.colorName}`}
                  className={`flex items-center gap-2 border px-3.5 py-2 text-[12px] font-medium uppercase tracking-[0.04em] transition-all rounded-[8px] cursor-pointer ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-[#E5E5E5] text-black hover:border-black bg-white"
                  }`}
                >
                  {variant.colorHex && (
                    <span
                      className="h-3.5 w-3.5 shrink-0 border border-black/20 rounded-[2px]"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  )}
                  <span>{variant.colorName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Stock Status */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 border border-[#E5E5E5] bg-[#F7F7F7] px-3.5 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-black rounded-[8px]">
            <AlertCircle className="h-4 w-4 stroke-[1.5]" />
            <span>Currently Out of Stock</span>
          </div>
        ) : isLowStock ? (
          <div className="flex items-center gap-2 border border-[#A6843D] bg-[#FFF4F0] px-3.5 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-[#A6843D] rounded-[8px]">
            <span>Only 3 left</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 font-sans text-[12px] text-[#6B6B6B]">
            <span className="inline-block h-2 w-2 bg-black" />
            <span>In Stock — Ready for dispatch</span>
          </div>
        )}
      </div>

      {/* 8. Quantity + ADD TO BAG + Outlined BUY IT NOW */}
      <div id="product-action-buttons" className="flex flex-col gap-2.5 pt-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Quantity Stepper */}
          {!isOutOfStock && (
            <div className="flex items-center border border-[#E5E5E5] bg-white self-start sm:self-auto rounded-[8px] overflow-hidden">
              <button
                type="button"
                onClick={decrementQty}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-3 text-black hover:bg-[#F7F7F7] transition-colors disabled:opacity-30 cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
              <span className="w-10 text-center font-sans text-[13px] font-medium text-black">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQty}
                aria-label="Increase quantity"
                className="p-3 text-black hover:bg-[#F7F7F7] transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            variant="primary"
            size="lg"
            className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[13px] cursor-pointer"
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 stroke-[2]" />
                <span>Added to Bag</span>
              </>
            ) : isOutOfStock ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
                <span>Add to Bag</span>
              </>
            )}
          </Button>
        </div>

        {/* 9. ORDER VIA WHATSAPP button */}
        {!isOutOfStock && (
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${product.name} directly via WhatsApp`}
            className="flex w-full items-center justify-center gap-2.5 border border-[#25D366] bg-[#25D366] hover:bg-[#20BA5A] py-3.5 px-6 font-sans text-[13px] font-semibold tracking-[0.08em] uppercase text-white transition-all select-none rounded-[8px] cursor-pointer shadow-none"
          >
            {/* Authentic Official WhatsApp Icon */}
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              className="h-4.5 w-4.5 fill-white shrink-0"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span>Order via WhatsApp</span>
          </a>
        )}
      </div>

      {/* 10. Trust Row: 3 equal columns */}
      <ProductTrustBadges />

      {/* 11. Accordion with 1px dividers and plus/minus icon, first open by default */}
      <div className="flex flex-col border-t border-[#E5E5E5]">
        {/* Accordion 1: Description (open by default) */}
        <div className="border-b border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => toggleSection("description")}
            aria-expanded={openSections.description}
            className="flex w-full items-center justify-between py-4 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black hover:text-[#6B6B6B] transition-colors cursor-pointer"
          >
            <span>Description</span>
            {openSections.description ? (
              <Minus className="h-4 w-4 stroke-[1.5] shrink-0" />
            ) : (
              <Plus className="h-4 w-4 stroke-[1.5] shrink-0" />
            )}
          </button>
          {openSections.description && (
            <div className="pb-5 pt-1 text-[13px] leading-relaxed text-[#6B6B6B]">
              {product.description ? (
                <div className="prose max-w-none space-y-3">
                  {typeof product.description === "string" ? (
                    product.description.split("\n").filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : Array.isArray(product.description) ? (
                    product.description.map((block: any, i: number) => {
                      if (typeof block === "string") return <p key={i}>{block}</p>;
                      const text = block?.children?.map((c: any) => c.text).join("") || "";
                      return text ? <p key={i}>{text}</p> : null;
                    })
                  ) : null}
                </div>
              ) : (
                <p>
                  {product.shortDescription ||
                    "Handcrafted for modern elegance with premium materials, precision stitching, and custom anti-tarnish hardware."}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Accordion 2: Details & Size */}
        <div className="border-b border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => toggleSection("details")}
            aria-expanded={openSections.details}
            className="flex w-full items-center justify-between py-4 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black hover:text-[#6B6B6B] transition-colors cursor-pointer"
          >
            <span>Details &amp; Size</span>
            {openSections.details ? (
              <Minus className="h-4 w-4 stroke-[1.5] shrink-0" />
            ) : (
              <Plus className="h-4 w-4 stroke-[1.5] shrink-0" />
            )}
          </button>
          {openSections.details && (
            <div className="pb-5 pt-1 font-sans text-[13px] text-[#6B6B6B]">
              <dl className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                {product.category?.title && (
                  <>
                    <dt className="font-medium text-black">Style</dt>
                    <dd>{product.category.title}</dd>
                  </>
                )}
                {product.material && (
                  <>
                    <dt className="font-medium text-black">Material</dt>
                    <dd>{product.material}</dd>
                  </>
                )}
                {selectedVariant?.colorName && (
                  <>
                    <dt className="font-medium text-black">Color</dt>
                    <dd>{selectedVariant.colorName}</dd>
                  </>
                )}
                {parsedDim?.length && (
                  <>
                    <dt className="font-medium text-black">Length</dt>
                    <dd>{parsedDim.length}</dd>
                  </>
                )}
                {parsedDim?.height && (
                  <>
                    <dt className="font-medium text-black">Height</dt>
                    <dd>{parsedDim.height}</dd>
                  </>
                )}
                {parsedDim?.depth && (
                  <>
                    <dt className="font-medium text-black">Depth</dt>
                    <dd>{parsedDim.depth}</dd>
                  </>
                )}
                {product.dimensions && !parsedDim?.length && (
                  <>
                    <dt className="font-medium text-black">Dimensions</dt>
                    <dd>{product.dimensions}</dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Accordion 3: Care Instructions */}
        <div className="border-b border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => toggleSection("care")}
            aria-expanded={openSections.care}
            className="flex w-full items-center justify-between py-4 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black hover:text-[#6B6B6B] transition-colors cursor-pointer"
          >
            <span>Care Instructions</span>
            {openSections.care ? (
              <Minus className="h-4 w-4 stroke-[1.5] shrink-0" />
            ) : (
              <Plus className="h-4 w-4 stroke-[1.5] shrink-0" />
            )}
          </button>
          {openSections.care && (
            <div className="pb-5 pt-1 font-sans text-[13px] leading-relaxed text-[#6B6B6B]">
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Store in the provided breathable dust bag when not in use.</li>
                <li>Keep away from direct heat, sunlight, and moist environments.</li>
                <li>Clean gently with a soft, dry cotton cloth.</li>
                <li>Avoid exposure to harsh chemicals, perfumes, oils, or makeup.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 4: Shipping & Returns */}
        <div className="border-b border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => toggleSection("shipping")}
            aria-expanded={openSections.shipping}
            className="flex w-full items-center justify-between py-4 text-left font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black hover:text-[#6B6B6B] transition-colors cursor-pointer"
          >
            <span>Shipping &amp; Returns</span>
            {openSections.shipping ? (
              <Minus className="h-4 w-4 stroke-[1.5] shrink-0" />
            ) : (
              <Plus className="h-4 w-4 stroke-[1.5] shrink-0" />
            )}
          </button>
          {openSections.shipping && (
            <div className="pb-5 pt-1 font-sans text-[13px] leading-relaxed text-[#6B6B6B]">
              <div className="space-y-2">
                <p>
                  <strong className="text-black font-medium">Nationwide Delivery:</strong> Orders dispatched within 24 hours. Estimated delivery 2–4 business days across Pakistan. Flat shipping PKR 200.
                </p>
                <p>
                  <strong className="text-black font-medium">Payment Methods:</strong> Cash on Delivery (COD) and direct Bank Transfer / EasyPaisa supported.
                </p>
                <p>
                  <strong className="text-black font-medium">7-Day Easy Returns:</strong> Hassle-free exchanges or returns within 7 days of delivery for unused items with original packaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 12. Share Row: WhatsApp, Facebook, Copy Link */}
      <div className="flex items-center gap-3 pt-1">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B6B6B]">
          Share:
        </span>
        <div className="flex items-center gap-2">
          {/* Share WhatsApp */}
          <button
            type="button"
            onClick={shareOnWhatsApp}
            aria-label="Share this product on WhatsApp"
            className="flex h-8 w-8 items-center justify-center border border-[#E5E5E5] bg-white text-black hover:border-black transition-colors rounded-[8px] cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 stroke-[1.5]" />
          </button>

          {/* Share Facebook */}
          <button
            type="button"
            onClick={shareOnFacebook}
            aria-label="Share this product on Facebook"
            className="flex h-8 w-8 items-center justify-center border border-[#E5E5E5] bg-white text-black hover:border-black transition-colors rounded-[8px] cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              className="fill-black"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={copyProductLink}
            aria-label="Copy product link"
            className="flex items-center gap-1.5 border border-[#E5E5E5] bg-white px-2.5 h-8 text-[11px] font-sans font-medium uppercase tracking-[0.04em] text-black hover:border-black transition-colors rounded-[8px] cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2] text-black" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductActions;
