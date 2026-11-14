"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, Search } from "lucide-react";
import Logo from "@/components/layout/Logo";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SearchModal from "@/components/layout/SearchModal";
import { Container } from "@/components/ui/container";
import { useCart } from "@/context/CartContext";
import type { Category } from "@/types/product";
import { CATEGORIES } from "@/data/categories";
import { getStylesForCategory } from "@/lib/category-styles";

// =============================================================================
// SAZAIRA HEADER — Minimal Fashion Retail (Aldo Inspired)
// White background, 1px #E5E5E5 border, clean uppercase nav, black thin icons.
// =============================================================================

interface HeaderProps {
  categories?: Category[];
}

function HeaderNavigation({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortParam = searchParams?.get("sort");
  const bestsellerParam = searchParams?.get("bestseller");
  const saleParam = searchParams?.get("sale");
  const categoryParam = searchParams?.get("category");

  const isNewArrivalsActive = pathname === "/shop" && sortParam === "newest";
  const isBestSellersActive =
    pathname === "/shop" && bestsellerParam === "true";
  const isSaleActive = pathname === "/shop" && saleParam === "true";

  const isShopActive =
    pathname === "/shop" &&
    !isNewArrivalsActive &&
    !isBestSellersActive &&
    !isSaleActive;

  return (
    <nav
      className="hidden items-center gap-6 lg:gap-8 font-sans text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.08em] text-black lg:flex"
      aria-label="Main navigation"
    >
      {/* Shop Link + Categories Dropdown Toggle */}
      <div
        ref={dropdownRef}
        className="relative flex items-center"
        onMouseEnter={() => setCategoriesOpen(true)}
        onMouseLeave={() => setCategoriesOpen(false)}
      >
        <div className="flex items-center gap-1">
          <Link
            href="/shop"
            className={`py-1 transition-colors hover:underline ${
              isShopActive ? "underline font-semibold" : ""
            }`}
          >
            Shop
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCategoriesOpen((prev) => !prev);
            }}
            aria-expanded={categoriesOpen}
            aria-haspopup="true"
            aria-label="Toggle categories menu"
            className="p-0.5 text-black hover:opacity-70 transition-opacity"
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-150 ${
                categoriesOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Dropdown Menu Panel (Clean white, 1px border, 0 shadow) */}
        {categoriesOpen && (
          <div className="absolute top-full left-0 z-50 min-w-[200px] max-h-80 overflow-y-auto border border-[#E5E5E5] bg-white py-1 shadow-none">
            <Link
              href="/shop"
              onClick={() => setCategoriesOpen(false)}
              className="block border-b border-[#E5E5E5] px-4 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase text-black hover:bg-[#F7F7F7] transition-colors"
            >
              All Suits
            </Link>
            {categories
              .filter((c) => c.isActive !== false)
              .map((cat) => {
                const isSelected =
                  pathname === `/category/${cat.slug}` ||
                  (pathname === "/shop" && categoryParam === cat.slug);
                const styles = getStylesForCategory(cat.slug);

                return (
                  <div
                    key={cat._id || cat.slug}
                    className="border-b border-[#F7F7F7] last:border-b-0"
                  >
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className={`block px-4 py-2 text-[12px] tracking-[0.08em] uppercase transition-colors ${
                        isSelected
                          ? "bg-[#F7F7F7] font-semibold text-black"
                          : "text-black hover:bg-[#F7F7F7] font-normal"
                      }`}
                    >
                      {cat.title}
                    </Link>
                    {styles.length > 0 && (
                      <div className="pl-6 pb-2 pt-0.5 flex flex-col space-y-1">
                        {styles.map((st) => (
                          <Link
                            key={st.value}
                            href={`/category/${cat.slug}?style=${st.value}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="font-sans text-[11px] tracking-[0.04em] uppercase text-[#6B6B6B] hover:text-black transition-colors"
                          >
                            {st.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* New Arrivals */}
      <Link
        href="/shop?sort=newest"
        className={`py-1 transition-colors hover:underline ${
          isNewArrivalsActive ? "underline font-semibold" : ""
        }`}
      >
        New Arrivals
      </Link>

      {/* Best Sellers */}
      <Link
        href="/shop?bestseller=true"
        className={`py-1 transition-colors hover:underline ${
          isBestSellersActive ? "underline font-semibold" : ""
        }`}
      >
        Best Sellers
      </Link>

      {/* Sale — Accent color */}
      <Link
        href="/shop?sale=true"
        className={`py-1 font-semibold text-[#A6843D] transition-colors hover:underline ${
          isSaleActive ? "underline" : ""
        }`}
      >
        Sale
      </Link>
    </nav>
  );
}

import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";

export default function Header({
  categories = CATEGORIES,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const { totalItems, toggleCartDrawer } = useCart();
  const categoryList =
    categories && categories.length > 0 ? categories : CATEGORIES;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E8E8] bg-white">
      {/* Slim black announcement bar */}
      <AnnouncementBar />

      <Container>
        <div className="flex h-[84px] items-center justify-between sm:h-[92px]">
          {/* Mobile/Tablet Menu Trigger (< 1024px) */}
          <button
            ref={hamburgerButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center -ml-2 text-black hover:opacity-70 transition-opacity lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-5 w-5 stroke-[1.5]" />
          </button>

          {/* Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation (>= 1024px) */}
          <Suspense fallback={null}>
            <HeaderNavigation categories={categoryList} />
          </Suspense>

          {/* Action Icons (Thin line style) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center text-black hover:opacity-70 transition-opacity"
              aria-label="Search products"
            >
              <Search className="h-5 w-5 stroke-[1.5]" />
            </button>

            {/* Shopping Bag Trigger */}
            <button
              type="button"
              onClick={toggleCartDrawer}
              className="relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center text-black hover:opacity-70 transition-opacity"
              aria-label={`Shopping bag${totalItems > 0 ? ` (${totalItems} items)` : ""}`}
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="bg-[#6E2E3C] absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full font-sans text-[10px] leading-none font-bold text-[#FFFBF5] pointer-events-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Search Modal Overlay */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Mobile/Tablet Navigation Drawer (< 1024px) */}
      <Suspense fallback={null}>
        <MobileNavDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onOpenSearch={() => setSearchModalOpen(true)}
          categories={categoryList}
          triggerRef={hamburgerButtonRef}
        />
      </Suspense>
    </header>
  );
}
