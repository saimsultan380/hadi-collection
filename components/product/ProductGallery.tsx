"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { urlForImage } from "@/lib/image";
import type { ProductImage } from "@/types/product";

// =============================================================================
// PRODUCT GALLERY COMPONENT — Amazon-Style Hover Zoom & Multi-Image Gallery
//
// Desktop Layout (Amazon-Style):
//   1. Left Column: Vertical thumbnail strip (supports 1 to 6+ images).
//   2. Center: High-resolution main product image.
//   3. Hover Lens: Semi-transparent square overlay follows cursor position.
//   4. Floating Zoom Window: Positioned directly to the right of the main image,
//      displaying ultra high-resolution 3× magnified detail in real-time.
//
// Mobile Layout:
//   1. Main image with tap-to-expand full-screen pinch-zoom modal.
//   2. Horizontal scrollable thumbnail carousel underneath.
// =============================================================================

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  categoryTitle?: string;
  activeVariantImage?: ProductImage | null;
}

// Lens dimensions (keeps 4:5 aspect ratio)
const LENS_WIDTH = 180;
const LENS_HEIGHT = 225;

// Zoom Window dimensions
const ZOOM_WINDOW_WIDTH = 540;
const ZOOM_WINDOW_HEIGHT = 675;

export function ProductGallery({
  images,
  productName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categoryTitle: _categoryTitle,
  activeVariantImage,
}: ProductGalleryProps) {
  // ── Image list ──────────────────────────────────────────────────────────────
  const allImages = useMemo(
    () => (images && images.length > 0 ? images : []),
    [images]
  );

  // ── State ───────────────────────────────────────────────────────────────────
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [containerDimensions, setContainerDimensions] = useState({
    width: 500,
    height: 625,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || allImages.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 40;
    if (diff > threshold) {
      setSelectedIndex((prev) => (prev + 1) % allImages.length);
    } else if (diff < -threshold) {
      setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
    touchStartX.current = null;
  };

  // ── Sync with color variant selection ──────────────────────────────────────
  useEffect(() => {
    if (activeVariantImage) {
      const idx = allImages.findIndex(
        (img) =>
          img.asset?._id === activeVariantImage.asset?._id ||
          img.alt === activeVariantImage.alt
      );
      if (idx !== -1) {
        setSelectedIndex(idx);
        setHoverIndex(null);
      }
    }
  }, [activeVariantImage, allImages]);

  // ── Derived display index ───────────────────────────────────────────────────
  const displayIndex = hoverIndex !== null ? hoverIndex : selectedIndex;
  const currentImage =
    allImages[displayIndex] || activeVariantImage || allImages[0] || null;

  // Optimized image URLs
  const mainImageUrl = currentImage
    ? urlForImage(currentImage)?.width(1000).height(1250).url()
    : null;

  const zoomImageUrl = currentImage
    ? urlForImage(currentImage)?.width(1800).height(2250).url()
    : null;

  // ── Mouse movement handler for Amazon-style Lens & Zoom ────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = mainRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    setContainerDimensions({ width, height });

    // Cursor position inside container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate lens top-left position and clamp within container boundaries
    let left = mouseX - LENS_WIDTH / 2;
    let top = mouseY - LENS_HEIGHT / 2;

    left = Math.max(0, Math.min(width - LENS_WIDTH, left));
    top = Math.max(0, Math.min(height - LENS_HEIGHT, top));

    setLensPos({ x: left, y: top });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (mainRef.current) {
      setContainerDimensions({
        width: mainRef.current.offsetWidth,
        height: mainRef.current.offsetHeight,
      });
    }
    setIsZooming(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
  }, []);

  // Compute zoom scale ratio
  const zoomRatioX = ZOOM_WINDOW_WIDTH / LENS_WIDTH; // 3.0x
  const zoomRatioY = ZOOM_WINDOW_HEIGHT / LENS_HEIGHT; // 3.0x

  const hasMultiple = allImages.length > 1;

  // ── Render Thumbnail ────────────────────────────────────────────────────────
  const renderThumbnail = (img: ProductImage, idx: number) => {
    const thumbUrl = urlForImage(img)?.width(160).height(200).url();
    const isActive = idx === (hoverIndex !== null ? hoverIndex : selectedIndex);

    return (
      <button
        key={img._key || idx}
        type="button"
        onMouseEnter={() => setHoverIndex(idx)}
        onMouseLeave={() => setHoverIndex(null)}
        onClick={() => {
          setSelectedIndex(idx);
          setHoverIndex(null);
        }}
        aria-label={`View photo ${idx + 1} of ${productName}`}
        aria-pressed={idx === selectedIndex}
        className={`group relative w-full aspect-[4/5] block cursor-pointer overflow-hidden border bg-[#F7F7F7] transition-all rounded-[8px] ${
          isActive
            ? "border-black ring-1 ring-black"
            : "border-[#E5E5E5] hover:border-black"
        }`}
      >
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={img.alt || `${productName} photo ${idx + 1}`}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="bg-[#F7F7F7] text-[#6B6B6B] flex h-full w-full items-center justify-center text-[10px] font-medium uppercase">
            {idx + 1}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="relative">
      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:flex lg:flex-row lg:items-start lg:gap-4">
        {/* Thumbnail column */}
        {hasMultiple && (
          <div className="flex max-h-[640px] w-[76px] shrink-0 flex-col gap-2.5 overflow-y-auto pr-1">
            {allImages.map((img, idx) => renderThumbnail(img, idx))}
          </div>
        )}

        {/* Main image container */}
        <div className="relative min-w-0 flex-1">
          <div
            ref={mainRef}
            className="group/main relative aspect-[4/5] w-full cursor-crosshair overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7] rounded-[8px]"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsModalOpen(true)}
          >
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={
                  currentImage?.alt ||
                  `${productName} – Hadi Collection`
                }
                fill
                priority
                sizes="(max-width: 1200px) 55vw, 640px"
                className="object-cover pointer-events-none select-none"
              />
            ) : (
              <div className="bg-[#F7F7F7] flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <span className="font-sans text-xs tracking-widest uppercase text-[#6B6B6B]">
                  Hadi Collection
                </span>
              </div>
            )}

            {/* Neutral Zoom Lens */}
            {mainImageUrl && isZooming && (
              <div
                className="pointer-events-none absolute z-20 border border-black/40 bg-black/10"
                style={{
                  left: `${lensPos.x}px`,
                  top: `${lensPos.y}px`,
                  width: `${LENS_WIDTH}px`,
                  height: `${LENS_HEIGHT}px`,
                }}
                aria-hidden="true"
              />
            )}

            {/* Hover hint */}
            {mainImageUrl && !isZooming && (
              <div className="pointer-events-none absolute right-3 bottom-3 z-10 bg-white px-2 py-1 text-[10px] font-medium tracking-widest text-black uppercase border border-[#E5E5E5]">
                Hover to zoom
              </div>
            )}
          </div>

          {/* Floating Zoom Window */}
          {mainImageUrl && isZooming && (
            <div
              className="pointer-events-none absolute left-[calc(100%+16px)] top-0 z-50 hidden overflow-hidden border border-[#E5E5E5] bg-white lg:block rounded-[8px]"
              style={{
                width: `${ZOOM_WINDOW_WIDTH}px`,
                height: `${ZOOM_WINDOW_HEIGHT}px`,
              }}
              aria-label="Zoomed detail view"
            >
              <div
                className="relative will-change-transform"
                style={{
                  width: `${containerDimensions.width * zoomRatioX}px`,
                  height: `${containerDimensions.height * zoomRatioY}px`,
                  transform: `translate(-${lensPos.x * zoomRatioX}px, -${lensPos.y * zoomRatioY}px)`,
                }}
              >
                {zoomImageUrl && (
                  <Image
                    src={zoomImageUrl}
                    alt={`${productName} zoomed detail`}
                    fill
                    sizes="1800px"
                    priority
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="flex flex-col gap-3 lg:hidden">
        {/* Main image */}
        <div
          className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7] rounded-[8px] select-none"
          onClick={() => setIsModalOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label="Tap to zoom image"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsModalOpen(true);
          }}
        >
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={
                currentImage?.alt ||
                `${productName} – Hadi Collection`
              }
              fill
              priority
              sizes="100vw"
              className="object-cover pointer-events-none"
            />
          ) : (
            <div className="bg-[#F7F7F7] flex h-full w-full flex-col items-center justify-center p-8 text-center">
              <span className="font-sans text-xs tracking-widest uppercase text-[#6B6B6B]">
                Hadi Collection
              </span>
            </div>
          )}

          {/* Active image counter badge */}
          {hasMultiple && (
            <div className="pointer-events-none absolute left-3 bottom-3 z-10 bg-white/95 px-2 py-1 text-[10px] font-sans font-semibold tracking-wider text-black border border-[#E5E5E5]">
              {selectedIndex + 1} / {allImages.length}
            </div>
          )}

          {mainImageUrl && (
            <div className="pointer-events-none absolute right-3 bottom-3 z-10 bg-white px-2 py-1 text-[10px] font-medium tracking-widest text-black uppercase border border-[#E5E5E5]">
              Tap to zoom
            </div>
          )}
        </div>

        {/* Horizontal thumbnails */}
        {hasMultiple && (
          <div
            className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 sm:gap-2.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allImages.map((img, idx) => (
              <div key={img._key || idx} className="w-[68px] sm:w-[76px] shrink-0">
                {renderThumbnail(img, idx)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL-SCREEN MODAL */}
      {isModalOpen && mainImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} full size image`}
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close image zoom"
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center bg-white text-black transition-colors hover:bg-[#F7F7F7] rounded-[8px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative h-[90dvh] w-[90dvw] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={zoomImageUrl || mainImageUrl}
              alt={currentImage?.alt || `${productName} – full size view`}
              fill
              sizes="95vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
