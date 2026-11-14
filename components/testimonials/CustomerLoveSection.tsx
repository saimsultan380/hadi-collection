"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, X, ZoomIn, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { Testimonial } from "@/types/testimonial";

interface CustomerLoveSectionProps {
  testimonials: Testimonial[];
}

/**
 * Text Review Card Component
 * - 1px border, white background, square corners, no shadows.
 * - Star rating only if rating exists.
 * - Max 5 lines text with "Read more" toggle.
 * - Customer first name and city.
 * - "Verified Buyer" badge only when isVerifiedBuyer is true.
 * - "View product" link if productLink exists.
 */
function TextReviewCard({ item }: { item: Testimonial }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const text = item.text || "";
  const isLongText = text.length > 200;

  return (
    <div className="flex h-full flex-col justify-between border border-[#E5E5E5] bg-white p-6 sm:p-7 rounded-[8px]">
      <div>
        {/* Star Rating — ONLY if rating exists */}
        {item.rating && (
          <div className="mb-3.5 flex items-center gap-1 text-black">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3.5 w-3.5 ${
                  s <= (item.rating || 0)
                    ? "fill-black stroke-black"
                    : "fill-transparent stroke-[#CCCCCC]"
                }`}
                aria-hidden="true"
              />
            ))}
            <span className="sr-only">{item.rating} out of 5 stars</span>
          </div>
        )}

        {/* Review Text — max 5 lines with toggle */}
        <p
          className={`font-sans text-[14px] leading-relaxed text-[#333333] ${
            !isExpanded ? "line-clamp-5" : ""
          }`}
        >
          &ldquo;{text}&rdquo;
        </p>

        {isLongText && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.06em] text-black hover:underline focus-visible:outline-none"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {/* Author Details & Verified Buyer */}
      <div className="mt-6 border-t border-[#E5E5E5] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-sans text-[13px] font-bold uppercase tracking-[0.04em] text-black">
              {item.customerName}
            </p>
            {item.city && (
              <p className="font-sans text-[12px] text-[#6B6B6B]">{item.city}</p>
            )}
          </div>

          {item.isVerifiedBuyer && (
            <span className="inline-flex items-center gap-1 border border-black bg-black px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-white">
              <Check className="h-2.5 w-2.5 stroke-[2.5]" />
              <span>Verified Buyer</span>
            </span>
          )}
        </div>

        {item.productLink && (
          <Link
            href={item.productLink}
            className="mt-2.5 inline-flex items-center gap-1 font-sans text-xs font-medium text-black hover:underline"
          >
            <span>View product</span>
            <span>&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * WhatsApp Screenshot Card Component
 * - Clean phone-chat style frame with soft light-green chat background (#E7F3E8).
 * - Rounded corners only on the screenshot frame.
 * - Customer first name and optional city underneath.
 * - Click opens screenshot in a full-size lightbox.
 */
function WhatsAppScreenshotCard({
  item,
  onOpenLightbox,
}: {
  item: Testimonial;
  onOpenLightbox: (imageUrl: string, alt: string) => void;
}) {
  const altText = `Customer feedback from ${item.customerName}`;
  const imageUrl = item.screenshotImage || "";

  return (
    <div className="flex h-full flex-col justify-between border border-[#E5E5E5] bg-white p-5 sm:p-6 rounded-[8px]">
      {/* Phone-Chat Style Frame */}
      <button
        type="button"
        onClick={() => onOpenLightbox(imageUrl, altText)}
        className="group relative flex aspect-[9/16] max-h-[380px] w-full cursor-pointer flex-col overflow-hidden rounded-[8px] border border-[#D0E5D2] bg-[#E7F3E8] p-2 transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        aria-label={`View full chat screenshot from ${item.customerName}`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-white">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={altText}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover object-top"
              loading="lazy"
            />
          )}

          {/* Hover Tap Cue */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 border border-white bg-black/80 px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-white">
              <ZoomIn className="h-3.5 w-3.5" />
              <span>Tap to Expand</span>
            </span>
          </div>
        </div>
      </button>

      {/* Customer Name & City Underneath */}
      <div className="mt-5 border-t border-[#E5E5E5] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-sans text-[13px] font-bold uppercase tracking-[0.04em] text-black">
              {item.customerName}
            </p>
            {item.city && (
              <p className="font-sans text-[12px] text-[#6B6B6B]">{item.city}</p>
            )}
          </div>

          {item.isVerifiedBuyer && (
            <span className="inline-flex items-center gap-1 border border-black bg-black px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-white">
              <Check className="h-2.5 w-2.5 stroke-[2.5]" />
              <span>Verified Buyer</span>
            </span>
          )}
        </div>

        {item.productLink && (
          <Link
            href={item.productLink}
            className="mt-2.5 inline-flex items-center gap-1 font-sans text-xs font-medium text-black hover:underline"
          >
            <span>View product</span>
            <span>&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * CustomerLoveSection
 * - Displays ONLY published real customer reviews.
 * - Hides completely if fewer than 3 testimonials are published.
 * - Horizontal swipe/scroll slider with desktop prev/next controls.
 * - Structured data (JSON-LD) generated ONLY for text reviews tied to a product link.
 */
export function CustomerLoveSection({ testimonials }: CustomerLoveSectionProps) {
  // STRICT RULE: Hide the entire section on the homepage while there are fewer than 3 published testimonials
  if (!testimonials || testimonials.length < 3) {
    return null;
  }

  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [activeLightbox, setActiveLightbox] = React.useState<{ url: string; alt: string } | null>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  // Desktop Prev / Next scroll controls
  const handleScroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  // Optional slow auto-advance (pauses on hover/touch, disabled for prefers-reduced-motion)
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isPaused) return;

    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

      if (isAtEnd) {
        sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: clientWidth * 0.7, behavior: "smooth" });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Lightbox Escape key handler
  React.useEffect(() => {
    if (!activeLightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveLightbox(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightbox]);

  // Generate Review JSON-LD ONLY for real text testimonials tied to a specific product
  const productReviewsForSchema = testimonials.filter(
    (t) => t.type === "text" && t.text && t.productLink && t.rating
  );

  const reviewSchemaList =
    productReviewsForSchema.length > 0
      ? productReviewsForSchema.map((t) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          author: {
            "@type": "Person",
            name: t.customerName,
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: t.rating,
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: t.text,
          itemReviewed: {
            "@type": "Product",
            name: "Hadi Collection Suit",
            url: t.productLink,
          },
        }))
      : null;

  return (
    <section className="border-t border-[#E8E8E8] bg-white py-20 sm:py-28">
      {/* Review JSON-LD ONLY for product-tied text reviews */}
      {reviewSchemaList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(reviewSchemaList),
          }}
        />
      )}

      <Container>
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 flex items-end justify-between">
          <div>
            <p className="font-sans text-[12px] font-medium uppercase tracking-[0.15em] text-[#6B6B6B] mb-2">
              CUSTOMER LOVE
            </p>
            <h2 className="font-sans text-2xl sm:text-3xl font-semibold uppercase tracking-[0.02em] text-black">
              WHAT OUR CUSTOMERS SAY
            </h2>
          </div>

          {/* Desktop Small Square Arrows */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous customer feedback"
              className="flex h-9 w-9 items-center justify-center border border-[#E5E5E5] bg-white text-black hover:border-black transition-colors rounded-[8px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
            >
              <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next customer feedback"
              className="flex h-9 w-9 items-center justify-center border border-[#E5E5E5] bg-white text-black hover:border-black transition-colors rounded-[8px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
            >
              <ChevronRight className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Horizontally scrollable card slider:
            - Mobile: 1.2 cards (w-[82%])
            - Tablet: 2 cards (md:w-[calc(50%-12px)])
            - Desktop: 3 cards (lg:w-[calc(33.333%-16px)])
        */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="w-[82%] sm:w-[75%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start"
            >
              {item.type === "whatsapp_screenshot" ? (
                <WhatsAppScreenshotCard
                  item={item}
                  onOpenLightbox={(url, alt) => setActiveLightbox({ url, alt })}
                />
              ) : (
                <TextReviewCard item={item} />
              )}
            </div>
          ))}
        </div>
      </Container>

      {/* Lightbox Modal for WhatsApp Screenshots */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-none"
          role="dialog"
          aria-modal="true"
          aria-label="Full-size customer feedback screenshot"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative flex max-h-[92vh] max-w-lg flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 44px Tap Target Close Button */}
            <button
              type="button"
              onClick={() => setActiveLightbox(null)}
              aria-label="Close image lightbox"
              className="absolute -top-12 right-0 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center text-white hover:opacity-75 focus-visible:outline-none"
            >
              <X className="h-6 w-6 stroke-[1.5]" />
            </button>

            {/* Lightbox Screenshot Image */}
            <div className="relative max-h-[85vh] w-full overflow-hidden rounded-[8px] border border-white/20 bg-[#E7F3E8] shadow-2xl">
              <Image
                src={activeLightbox.url}
                alt={activeLightbox.alt}
                width={800}
                height={1200}
                className="max-h-[82vh] w-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
