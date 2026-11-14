"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { X, ChevronDown, Search, Truck, RotateCcw } from "lucide-react";
import Logo from "@/components/layout/Logo";
import type { Category } from "@/types/product";
import { getStylesForCategory } from "@/lib/category-styles";
import { getGeneralWhatsAppLink } from "@/lib/whatsapp";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  categories: Category[];
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

// Brand Green WhatsApp Glyph for Button
function WhatsAppSolidGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className={className}
      fill="#25D366"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// Thin line WhatsApp icon (20px) matching thin line icons style
function WhatsAppLineIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

/**
 * MobileNavDrawer
 *
 * Full-height slide-in navigation drawer for mobile and tablet screens (< 1024px).
 * - Portaled to document.body at z-[100] so Floating WhatsApp & Cart Badge never overlap.
 * - Width: 88% of screen (max 400px), dim backdrop, body scroll lock, swipe-to-close.
 * - Header: Logo on left, 44px tap target X close button on right, 1px bottom divider.
 * - Search: Roomy quick search entry (16px spacing above and below).
 * - Main Links: 52px row height, 15px uppercase font-semibold with SHOP accordion & category style sub-accordions.
 * - Secondary Links: 13px uppercase gray links (#6B6B6B, weight 500) for verified existing pages.
 * - Bottom Block: Pinned to bottom, outlined WhatsApp order button, trust lines, footer social icons, brand note.
 * - Fully accessible dialog with focus trap, Escape handler, aria-expanded, and >= 44px tap targets.
 */
export function MobileNavDrawer({
  isOpen,
  onClose,
  onOpenSearch,
  categories,
  triggerRef,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = React.useState(false);
  const [isRendered, setIsRendered] = React.useState(isOpen);
  const [isVisible, setIsVisible] = React.useState(false);

  const drawerRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Mount detection for React portal
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Animate slide-in (250ms) and unmount cleanly on slide-out
  React.useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(r2);
      });
      return () => cancelAnimationFrame(r1);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Accordion state: SHOP opens on first tap, stays open when navigating back
  const [isShopExpanded, setIsShopExpanded] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("sazaira_mobile_nav_shop_expanded");
      if (stored !== null) return stored === "true";
    }
    return false;
  });

  const toggleShop = () => {
    setIsShopExpanded((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("sazaira_mobile_nav_shop_expanded", String(next));
      }
      return next;
    });
  };

  // Only one category style accordion opens at a time
  const [expandedCategorySlug, setExpandedCategorySlug] = React.useState<string | null>(null);

  const toggleCategoryStyles = (slug: string) => {
    setExpandedCategorySlug((prev) => (prev === slug ? null : slug));
  };

  // Active state detection
  const sortParam = searchParams?.get("sort");
  const bestsellerParam = searchParams?.get("bestseller");
  const saleParam = searchParams?.get("sale");
  const styleParam = searchParams?.get("style");

  const isNewArrivalsActive = pathname === "/shop" && sortParam === "newest";
  const isBestSellersActive = pathname === "/shop" && bestsellerParam === "true";
  const isSaleActive = pathname === "/shop" && saleParam === "true";

  // Filter active categories with products ordered by sortOrder
  const sortedCategories = React.useMemo(() => {
    return categories
      .filter((c) => c.isActive !== false && (c.productCount ?? 0) > 0)
      .sort((a, b) => {
        const orderA = a.sortOrder ?? a.displayOrder ?? 999;
        const orderB = b.sortOrder ?? b.displayOrder ?? 999;
        return orderA - orderB;
      });
  }, [categories]);

  // 1. Lock Body Scroll when Drawer is Open
  React.useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const originalOverflow = document.body.style.overflow;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      // Focus close button on open
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.overflow = originalOverflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // 2. Return focus to trigger button on close
  React.useEffect(() => {
    if (!isOpen && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  // 3. Auto-close if resized to desktop (>= 1024px)
  React.useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  // 4. Escape key & Focus Trap
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 5. Swipe Left to Close Gesture
  const touchStartRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDeltaRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    touchDeltaRef.current = { x: 0, y: 0 };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaRef.current = {
      x: e.touches[0].clientX - touchStartRef.current.x,
      y: e.touches[0].clientY - touchStartRef.current.y,
    };
  };

  const handleTouchEnd = () => {
    const { x, y } = touchDeltaRef.current;
    // Swiped left by > 45px and predominantly horizontal
    if (x < -45 && Math.abs(x) > Math.abs(y)) {
      onClose();
    }
    touchDeltaRef.current = { x: 0, y: 0 };
  };

  if (!mounted || !isRendered) return null;

  const whatsappUrl = getGeneralWhatsAppLink();

  const drawerContent = (
    <div
      className={`fixed inset-0 z-[100] flex lg:hidden ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Dimmed Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-250 ease-out motion-reduce:transition-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Shell (Slides in from left, 88% width, max 400px, full height, no shadows) */}
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative z-10 flex h-full h-[100dvh] w-[88%] max-w-[400px] flex-col border-r border-[#E5E5E5] bg-white shadow-none transition-transform duration-250 ease-out motion-reduce:transition-none pt-[env(safe-area-inset-top,0px)] ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Row: Logo + "SAZAIRA" on left, 44px tap target X close on right, 1px divider below */}
        <div className="flex h-14 min-h-[56px] shrink-0 items-center justify-between border-b border-[#E5E5E5] px-5">
          <div onClick={onClose} className="cursor-pointer">
            <Logo size="sm" />
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center -mr-2 text-black hover:opacity-70 transition-opacity rounded-[8px] focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none"
          >
            <X className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Search: Roomy quick search entry (16px spacing above and below) */}
        <div className="shrink-0 px-5 py-4 border-b border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            aria-label="Search suits"
            className="flex h-11 min-h-[44px] w-full items-center gap-3 border border-[#E5E5E5] bg-[#FAF8F5] px-3.5 font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-[#6B6B6B] hover:border-black hover:text-black transition-colors rounded-[8px] focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none"
          >
            <Search className="h-4 w-4 stroke-[1.5]" />
            <span>Search suits...</span>
          </button>
        </div>

        {/* Scrollable Main Navigation Content */}
        <div className="flex-1 overflow-y-auto px-5 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="flex flex-col font-sans" aria-label="Mobile main navigation">
            {/* ── 1. SHOP (Accordion with rotating chevron) ── */}
            <div className="border-b border-[#E5E5E5]">
              <div className="flex h-[52px] min-h-[52px] items-center justify-between">
                <button
                  type="button"
                  onClick={toggleShop}
                  aria-expanded={isShopExpanded}
                  className="flex h-[52px] min-h-[52px] w-full items-center justify-between font-sans text-[15px] font-semibold tracking-[0.06em] uppercase text-black hover:opacity-70 transition-opacity text-left rounded-[8px] focus-visible:outline-none"
                >
                  <span>Shop</span>
                  <div className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center">
                    <ChevronDown
                      className={`h-4 w-4 stroke-[1.75] transition-transform duration-200 ease-in-out motion-reduce:transition-none ${
                        isShopExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Indented Subcategories (16px indent, normal case, 15px, weight 400, animated 200ms) */}
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none ${
                  isShopExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pl-4 pb-3 pt-1 flex flex-col space-y-0.5 border-l border-black/10 ml-2 mb-2">
                    {/* "Shop All" (/shop) */}
                    <Link
                      href="/shop"
                      onClick={onClose}
                      className={`flex min-h-[44px] items-center font-sans text-[15px] font-normal normal-case text-black hover:font-medium transition-all ${
                        pathname === "/shop" && !sortParam && !bestsellerParam && !saleParam
                          ? "font-semibold underline"
                          : ""
                      }`}
                    >
                      Shop All
                    </Link>

                    {/* Active Categories from database ordered by sortOrder */}
                    {sortedCategories.map((cat) => {
                      const isCatActive = pathname === `/category/${cat.slug}`;
                      const styles = getStylesForCategory(cat.slug);
                      const hasStyles = styles.length > 0;
                      const isCategoryExpanded = expandedCategorySlug === cat.slug;

                      return (
                        <div key={cat._id || cat.slug} className="flex flex-col">
                          <div className="flex min-h-[44px] items-center justify-between">
                            <Link
                              href={`/category/${cat.slug}`}
                              onClick={onClose}
                              className={`flex min-h-[44px] flex-1 items-center font-sans text-[15px] font-normal normal-case text-black hover:font-medium transition-all ${
                                isCatActive ? "font-semibold underline" : ""
                              }`}
                            >
                              {cat.title}
                            </Link>

                            {hasStyles && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCategoryStyles(cat.slug);
                                }}
                                aria-expanded={isCategoryExpanded}
                                aria-label={`Toggle ${cat.title} styles`}
                                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center text-black hover:opacity-70 transition-opacity rounded-[8px] focus-visible:outline-none"
                              >
                                <ChevronDown
                                  className={`h-3.5 w-3.5 stroke-[1.75] transition-transform duration-200 ease-in-out motion-reduce:transition-none ${
                                    isCategoryExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Nested category styles accordion (only one open at a time, animated 200ms) */}
                          {hasStyles && (
                            <div
                              className={`grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none ${
                                isCategoryExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="pl-4 pb-2 pt-0.5 flex flex-col space-y-0.5 border-l border-[#E5E5E5] ml-2">
                                  {styles.map((st) => {
                                    const isStyleActive =
                                      isCatActive && styleParam === st.value;
                                    return (
                                      <Link
                                        key={st.value}
                                        href={`/category/${cat.slug}?style=${st.value}`}
                                        onClick={onClose}
                                        className={`flex min-h-[44px] items-center font-sans text-[13px] tracking-[0.04em] uppercase transition-colors ${
                                          isStyleActive
                                            ? "font-semibold text-black underline"
                                            : "text-[#6B6B6B] hover:text-black"
                                        }`}
                                      >
                                        {st.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2. NEW ARRIVALS (Plain link) ── */}
            <Link
              href="/shop?sort=newest"
              onClick={onClose}
              className={`flex h-[52px] min-h-[52px] items-center border-b border-[#E5E5E5] font-sans text-[15px] font-semibold tracking-[0.06em] uppercase text-black hover:opacity-70 transition-opacity ${
                isNewArrivalsActive ? "underline" : ""
              }`}
            >
              New Arrivals
            </Link>

            {/* ── 3. BEST SELLERS (Plain link) ── */}
            <Link
              href="/shop?bestseller=true"
              onClick={onClose}
              className={`flex h-[52px] min-h-[52px] items-center border-b border-[#E5E5E5] font-sans text-[15px] font-semibold tracking-[0.06em] uppercase text-black hover:opacity-70 transition-opacity ${
                isBestSellersActive ? "underline" : ""
              }`}
            >
              Best Sellers
            </Link>

            {/* ── 4. SALE (Plain link in terracotta accent #A6843D) ── */}
            <Link
              href="/shop?sale=true"
              onClick={onClose}
              className={`flex h-[52px] min-h-[52px] items-center border-b border-[#E5E5E5] font-sans text-[15px] font-semibold tracking-[0.06em] uppercase text-[#A6843D] hover:opacity-70 transition-opacity ${
                isSaleActive ? "underline" : ""
              }`}
            >
              Sale
            </Link>
          </nav>

          {/* ── SECONDARY LINKS (13px, weight 500, uppercase, #6B6B6B, only existing pages) ── */}
          <div className="pt-5 pb-4 flex flex-col">
            <Link
              href="/about"
              onClick={onClose}
              className="flex min-h-[44px] items-center font-sans text-[13px] font-medium tracking-[0.06em] uppercase text-[#6B6B6B] hover:text-black transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex min-h-[44px] items-center font-sans text-[13px] font-medium tracking-[0.06em] uppercase text-[#6B6B6B] hover:text-black transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/policies/shipping"
              onClick={onClose}
              className="flex min-h-[44px] items-center font-sans text-[13px] font-medium tracking-[0.06em] uppercase text-[#6B6B6B] hover:text-black transition-colors"
            >
              Shipping &amp; Returns
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className="flex min-h-[44px] items-center font-sans text-[13px] font-medium tracking-[0.06em] uppercase text-[#6B6B6B] hover:text-black transition-colors"
            >
              FAQs
            </Link>
          </div>
        </div>

        {/* ── BOTTOM BLOCK (Pinned to bottom of drawer, 1px top border, 24px gap above safe area) ── */}
        <div className="shrink-0 mt-auto border-t border-[#E5E5E5] bg-white px-5 pt-4 flex flex-col gap-3">
          {/* Outlined WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 min-h-[44px] w-full items-center justify-center gap-2.5 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-sans text-[12px] font-semibold uppercase tracking-[0.08em] rounded-[8px] focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none"
          >
            <WhatsAppSolidGlyph className="h-5 w-5 shrink-0" />
            <span>Order on WhatsApp</span>
          </a>

          {/* Trust Highlights Lines */}
          <div className="flex flex-col gap-1.5 font-sans text-[12px] text-[#6B6B6B] pt-0.5">
            <div className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 stroke-[1.5] text-[#6B6B6B] shrink-0" />
              <span>Cash on delivery across Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 stroke-[1.5] text-[#6B6B6B] shrink-0" />
              <span>Easy 7-day returns</span>
            </div>
          </div>

          {/* Social Icons Row (Thin line icons, 20px, only for social links in footer) */}
          <div className="flex items-center gap-2 pt-0.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Care"
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center text-black hover:opacity-70 transition-opacity"
            >
              <WhatsAppLineIcon className="h-5 w-5" />
            </a>
          </div>

          {/* Single small gray line (no "luxury" wording), 24px gap above safe area */}
          <p className="font-sans text-[11px] text-[#6B6B6B] tracking-[0.02em] pb-[calc(24px+env(safe-area-inset-bottom,0px))]">
            Hadi Collection · Unstitched suits, Pakistan
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
