"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

export interface CategorySliderItem {
  id: string;
  title: string;
  href: string;
  imageUrl: string | null;
  alt: string;
}

interface CircularCategorySliderProps {
  items: CategorySliderItem[];
}

// Speed: ~45px per second (slow, calm continuous marquee)
const SPEED_PX_PER_SEC = 45;

/**
 * CircularCategorySlider
 *
 * Full-width continuous auto-moving circular category slider on the homepage (marquee-style).
 * - Full-width edge-to-edge track without container clipping or horizontal page scrollbars.
 * - Sizing (bagx.pk inspired): 176px desktop (76px gap), 130px tablet (48px gap), 96px mobile (28px gap).
 * - Single-line bold labels (14px desktop, 13px tablet, 12px mobile, tracking 0.04em).
 * - Continuous infinite loop with GPU-accelerated translate3d.
 * - Pauses on hover, touch/press, and keyboard focus; resumes when released (2s delay after drag/swipe).
 * - Accessible: duplicates marked aria-hidden="true" and tabIndex={-1}.
 */
export function CircularCategorySlider({ items }: CircularCategorySliderProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const primarySetRef = React.useRef<HTMLDivElement>(null);

  // Motion & measurements
  const offsetRef = React.useRef(0);
  const singleSetWidthRef = React.useRef(0);
  const lastTimeRef = React.useRef<number | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  // States
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [isInView, setIsInView] = React.useState(true);
  const [isTabVisible, setIsTabVisible] = React.useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  // Dragging state
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startOffsetRef = React.useRef(0);
  const [hasDragged, setHasDragged] = React.useState(false);
  const resumeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // 1. Reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // 2. Measure widths and check overflow
  const measure = React.useCallback(() => {
    if (!primarySetRef.current || !containerRef.current || !trackRef.current) return;

    const primaryWidth = primarySetRef.current.offsetWidth;
    const computedStyle = window.getComputedStyle(trackRef.current);
    const gap = parseFloat(computedStyle.columnGap || computedStyle.gap || "76") || 76;
    const singleWidth = primaryWidth + gap;

    singleSetWidthRef.current = singleWidth;
    const containerWidth = containerRef.current.clientWidth;

    setIsOverflowing(primaryWidth > containerWidth);
  }, []);

  React.useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items]);

  // 3. IntersectionObserver & Tab Visibility
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 4. Continuous animation loop with requestAnimationFrame
  React.useEffect(() => {
    const shouldAnimate =
      isOverflowing &&
      !prefersReducedMotion &&
      !isHovered &&
      !isFocused &&
      !isInteracting &&
      isInView &&
      isTabVisible;

    lastTimeRef.current = null;

    if (!shouldAnimate) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }

      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      const singleWidth = singleSetWidthRef.current;
      if (singleWidth > 0 && trackRef.current) {
        offsetRef.current = (offsetRef.current + SPEED_PX_PER_SEC * delta) % singleWidth;
        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [
    isOverflowing,
    prefersReducedMotion,
    isHovered,
    isFocused,
    isInteracting,
    isInView,
    isTabVisible,
  ]);

  // Hide slider if fewer than 3 items
  if (!items || items.length < 3) {
    return null;
  }

  // 5. Pointer & Touch Drag handlers (scrubbing & continuity)
  const handleDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    setHasDragged(false);
    startXRef.current = clientX;
    startOffsetRef.current = offsetRef.current;
    setIsInteracting(true);

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current) return;

    const dx = clientX - startXRef.current;
    if (Math.abs(dx) > 6) {
      setHasDragged(true);
    }

    const single = singleSetWidthRef.current;
    if (single > 0 && trackRef.current) {
      offsetRef.current = ((startOffsetRef.current - dx) % single + single) % single;
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    }
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2000);
  };

  // Mouse event wrappers
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Primary click only
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    setIsHovered(false);
    handleDragEnd();
  };

  // Touch event wrappers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Prevent accidental link clicks when dragging
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      setHasDragged(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Category Navigation"
      className="w-full max-w-[100vw] overflow-hidden border-b border-[#E5E5E5] bg-white py-10 sm:py-12 min-h-[190px] sm:min-h-[240px] lg:min-h-[300px] flex flex-col justify-center relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
    >
      <div
        ref={containerRef}
        className="w-full overflow-hidden relative"
      >
        {/* ── REDUCED MOTION STATIC SCROLLER ── */}
        {prefersReducedMotion ? (
          <div
            className={`flex items-start gap-[28px] sm:gap-[48px] lg:gap-[76px] overflow-x-auto snap-x snap-mandatory py-1 px-4 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full ${
              isOverflowing ? "justify-start" : "justify-center"
            }`}
          >
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex flex-col items-center flex-shrink-0 snap-start focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none py-1 select-none"
              >
                <div className="relative w-[92px] h-[122px] sm:w-[124px] sm:h-[164px] lg:w-[156px] lg:h-[206px] rounded-[4px] overflow-hidden border border-[#E4D5C3] bg-[#F7F1E6] flex-shrink-0">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 176px, (min-width: 640px) 130px, 96px"
                      loading="lazy"
                      className="object-cover object-center transition-transform duration-200 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-2 text-center">
                      <span className="font-sans text-[11px] uppercase tracking-wider text-[#6B6B6B]">
                        {item.title}
                      </span>
                    </div>
                  )}
                </div>
                <span className="mt-3 text-center font-sans text-[12px] sm:text-[13px] lg:text-[14px] font-bold uppercase tracking-[0.04em] text-black group-hover:underline whitespace-nowrap">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          /* ── CONTINUOUS FULL-WIDTH AUTO-MOVING TRACK (MARQUEE) ── */
          <div
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`flex items-start gap-[28px] sm:gap-[48px] lg:gap-[76px] py-1 cursor-grab active:cursor-grabbing will-change-transform ${
              isOverflowing ? "w-max justify-start" : "w-full justify-center"
            }`}
          >
            {/* 1. Primary Set of Items (Accessible to screen readers & keyboard) */}
            <div
              ref={primarySetRef}
              className="flex items-start gap-[28px] sm:gap-[48px] lg:gap-[76px] flex-shrink-0"
            >
              {items.map((item) => (
                <Link
                  key={`primary-${item.id}`}
                  href={item.href}
                  onClickCapture={handleClickCapture}
                  className="group flex flex-col items-center flex-shrink-0 focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none py-1 select-none"
                >
                  <div className="relative w-[92px] h-[122px] sm:w-[124px] sm:h-[164px] lg:w-[156px] lg:h-[206px] rounded-[4px] overflow-hidden border border-[#E4D5C3] bg-[#F7F1E6] flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 176px, (min-width: 640px) 130px, 96px"
                        loading="lazy"
                        className="object-cover object-center transition-transform duration-200 ease-out group-hover:scale-[1.04] pointer-events-none"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-2 text-center">
                        <span className="font-sans text-[11px] uppercase tracking-wider text-[#6B6B6B]">
                          {item.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="mt-3 text-center font-sans text-[12px] sm:text-[13px] lg:text-[14px] font-bold uppercase tracking-[0.04em] text-black group-hover:underline whitespace-nowrap pointer-events-none">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>

            {/* 2. Duplicate Sets for Seamless Infinite Loop (Hidden from screen readers & tab order) */}
            {isOverflowing && (
              <>
                {[1, 2, 3].map((copyIndex) => (
                  <div
                    key={`dup-group-${copyIndex}`}
                    aria-hidden="true"
                    className="flex items-start gap-[28px] sm:gap-[48px] lg:gap-[76px] flex-shrink-0"
                  >
                    {items.map((item) => (
                      <Link
                        key={`dup-${copyIndex}-${item.id}`}
                        href={item.href}
                        tabIndex={-1}
                        onClickCapture={handleClickCapture}
                        className="group flex flex-col items-center flex-shrink-0 py-1 select-none pointer-events-auto"
                      >
                        <div className="relative w-[92px] h-[122px] sm:w-[124px] sm:h-[164px] lg:w-[156px] lg:h-[206px] rounded-[4px] overflow-hidden border border-[#E4D5C3] bg-[#F7F1E6] flex-shrink-0">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt=""
                              fill
                              sizes="(min-width: 1024px) 176px, (min-width: 640px) 130px, 96px"
                              loading="lazy"
                              className="object-cover object-center transition-transform duration-200 ease-out group-hover:scale-[1.04] pointer-events-none"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center p-2 text-center">
                              <span className="font-sans text-[11px] uppercase tracking-wider text-[#6B6B6B]">
                                {item.title}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="mt-3 text-center font-sans text-[12px] sm:text-[13px] lg:text-[14px] font-bold uppercase tracking-[0.04em] text-black group-hover:underline whitespace-nowrap pointer-events-none">
                          {item.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
