"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Small flat arrow used inside the "Shop Now" CTA. */
function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-200 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

interface CategoryTileProps {
  slug: string;
  title: string;
  imageUrl?: string | null;
  altText: string;
  hoverImageUrl?: string | null;
  hoverImageObjectPosition?: string;
}

export function CategoryTile({
  slug,
  title,
  imageUrl,
  altText,
  hoverImageUrl,
  hoverImageObjectPosition = "center",
}: CategoryTileProps) {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPreviewingRef = useRef(false);
  const preventNextClickRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    // Only handle touch pointers (mobile/tablet thumb press)
    if (e.pointerType !== "touch") return;

    startPosRef.current = { x: e.clientX, y: e.clientY };
    isPreviewingRef.current = false;
    preventNextClickRef.current = false;

    // Show model image immediately on touch press
    setIsPressed(true);

    // If held for >= 400ms, mark as preview so lifting doesn't navigate
    clearTimer();
    pressTimerRef.current = setTimeout(() => {
      isPreviewingRef.current = true;
    }, 400);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "touch" || !startPosRef.current) return;

    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    const dist = Math.hypot(dx, dy);

    // If finger moves more than 10px (e.g. vertical scroll gesture), cancel preview
    if (dist > 10) {
      clearTimer();
      setIsPressed(false);
      isPreviewingRef.current = false;
      startPosRef.current = null;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "touch") return;

    clearTimer();
    startPosRef.current = null;

    // If held long enough (>= 400ms), prevent the subsequent click event
    if (isPreviewingRef.current) {
      preventNextClickRef.current = true;
      isPreviewingRef.current = false;
    }

    // Fade back to the product image
    setIsPressed(false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "touch") return;

    clearTimer();
    startPosRef.current = null;
    isPreviewingRef.current = false;
    setIsPressed(false);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "touch") return;

    clearTimer();
    startPosRef.current = null;
    isPreviewingRef.current = false;
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (preventNextClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      preventNextClickRef.current = false;
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent long-press context menu / image-save popup on touch devices
    e.preventDefault();
  };

  return (
    <Link
      href={`/category/${slug}`}
      className="group category-tile flex flex-col items-center text-center select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "pan-y",
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F7F7F7]">
        {/* Base Product Image */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="(max-width: 1023px) 50vw, 25vw"
            className="object-cover object-center"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4">
            <span className="font-sans text-xs tracking-widest uppercase text-[#6B6B6B]">
              {title}
            </span>
          </div>
        )}

        {/* Hover / Press-and-Hold Model Image */}
        {hoverImageUrl && (
          <Image
            src={hoverImageUrl}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 1023px) 50vw, 25vw"
            style={{ objectPosition: hoverImageObjectPosition }}
            className={`category-tile-hover-image object-cover pointer-events-none transition-opacity duration-350 ease-out motion-reduce:transition-none ${
              isPressed ? "!opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        )}

        {/*
          Flat black shade over the model image — sits below the CTA so the
          button stands out. No gradient / blur / glassmorphism.
          Decorative and hidden from assistive tech, like the tile itself.
        */}
        <span
          aria-hidden="true"
          className={cn(
            "category-tile-shade absolute inset-0 z-[5] rounded-[8px] bg-[rgba(0,0,0,0.25)]",
            isPressed && "is-visible"
          )}
        />

        {/*
          "Shop Now →" CTA — flat terracotta, centred in the image.
          Decorative only: the whole tile is the single <Link>, so this is a
          span (never a nested <a>) and is hidden from assistive tech.
          Visibility is driven by CSS (.category-tile-shop-now) for hover and
          keyboard focus; `is-visible` covers the touch press-and-hold preview.
        */}
        <span
          aria-hidden="true"
          className={cn(
            "category-tile-shop-now absolute top-1/2 left-1/2 z-10",
            "inline-flex min-h-[44px] items-center justify-center gap-1.5",
            "rounded-[8px] bg-[#A6843D] px-4 py-2.5 hover:bg-[#7A5E2A]",
            "font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white",
            isPressed && "is-visible"
          )}
        >
          <span>Shop Now</span>
          <ArrowRightIcon />
        </span>
      </div>

      <span className="mt-3 min-h-[2.6em] leading-[1.3] font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-black group-hover:underline">
        {title}
      </span>
    </Link>
  );
}
