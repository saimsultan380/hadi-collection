"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import type { Category, Product } from "@/types/product";
import {
  colorToSlug,
  matchesColor,
  getStylesForCategory,
} from "@/lib/category-styles";

// =============================================================================
// CONTEXT-AWARE FILTER SIDEBAR & MOBILE/TABLET FILTERING SYSTEM
// Minimal fashion-retail (Aldo inspired): black & white, square corners, 0 gradients.
// Desktop: Sticky sidebar with flat sections.
// Mobile/Tablet (<1024px):
//  - Sticky toolbar with equal-width FILTER (with active count badge) & SORT buttons
//  - Quick chips row (scrollable, in sync with filters)
//  - Active removable filter chips with "Clear all"
//  - 90vh Bottom filter sheet with accordions, live-count bottom bar "SHOW N PRODUCTS"
//  - Sort bottom sheet with active sort option checked
// =============================================================================

interface FilterSidebarProps {
  categories?: Category[];
  totalProducts: number;
  activeCategorySlug?: string;
  catalogProducts?: Product[];
  hideCategoriesSection?: boolean;
  hideStyleSection?: boolean;
}

const OCCASION_OPTIONS = [
  { label: "Everyday", value: "Everyday" },
  { label: "Casual Day", value: "Casual" },
  { label: "Eid & Festive", value: "Festive" },
  { label: "Wedding", value: "Wedding" },
];

const PRICE_PRESETS = [
  { id: "under-2000", label: "Under Rs. 2,000", min: 0, max: 2000 },
  { id: "2000-4000", label: "Rs. 2,000 – 4,000", min: 2000, max: 4000 },
  { id: "4000-7000", label: "Rs. 4,000 – 7,000", min: 4000, max: 7000 },
  { id: "above-7000", label: "Above Rs. 7,000", min: 7000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export function FilterSidebar({
  categories = [],
  totalProducts,
  activeCategorySlug,
  catalogProducts = [],
  hideCategoriesSection = false,
  hideStyleSection = true,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mobile sheet states
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  // Accordion state: first two sections start open, rest closed
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    occasion: true,
    price: false,
    color: false,
    availability: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Touch gesture support for dragging filter sheet down
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (deltaY > 75) {
        setMobileFilterOpen(false);
      }
    }
    setTouchStartY(null);
  };

  // Lock background scrolling while any mobile sheet is open
  useEffect(() => {
    if (mobileFilterOpen || mobileSortOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileFilterOpen, mobileSortOpen]);

  // Close sheet on Escape key & return focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileFilterOpen) {
          setMobileFilterOpen(false);
          filterButtonRef.current?.focus();
        }
        if (mobileSortOpen) {
          setMobileSortOpen(false);
          sortButtonRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileFilterOpen, mobileSortOpen]);

  // A page is a category page if activeCategorySlug is provided
  const isCategoryPage = Boolean(activeCategorySlug);

  // On category page: current category is in pathname / activeCategorySlug, and extra ones are in ?more=...
  const moreParam = searchParams.get("more");
  const extraCategories = moreParam
    ? moreParam.split(",").filter(Boolean)
    : [];

  // Parse active filter arrays from URL
  const selectedCategories = searchParams.get("category")
    ? searchParams.get("category")!.split(",").filter(Boolean)
    : [];

  const effectiveCategories = isCategoryPage
    ? (activeCategorySlug ? [activeCategorySlug, ...extraCategories] : extraCategories)
    : selectedCategories;

  const selectedOccasions = searchParams.get("occasion")
    ? searchParams.get("occasion")!.split(",").filter(Boolean)
    : [];

  const selectedStyles = searchParams.get("style")
    ? searchParams.get("style")!.split(",").filter(Boolean)
    : [];

  const selectedColors = searchParams.get("color")
    ? searchParams.get("color")!.split(",").filter(Boolean)
    : [];

  const selectedPrice = searchParams.get("price") || "";
  const customMinParam = searchParams.get("minPrice");
  const customMaxParam = searchParams.get("maxPrice");
  const customMin =
    customMinParam && !isNaN(Number(customMinParam))
      ? Math.max(0, Number(customMinParam))
      : undefined;
  const customMax =
    customMaxParam && !isNaN(Number(customMaxParam))
      ? Math.max(0, Number(customMaxParam))
      : undefined;
  const hasCustomPrice = customMin !== undefined || customMax !== undefined;

  // Local state for custom price inputs
  const [minInput, setMinInput] = useState(searchParams.get("minPrice") || "");
  const [maxInput, setMaxInput] = useState(searchParams.get("maxPrice") || "");
  const [priceError, setPriceError] = useState("");

  // Sync inputs with URL searchParams
  useEffect(() => {
    setMinInput(searchParams.get("minPrice") || "");
    setMaxInput(searchParams.get("maxPrice") || "");
    setPriceError("");
  }, [searchParams]);

  const selectedInStock =
    searchParams.get("instock") === "1" || searchParams.get("instock") === "true";
  const isSale = searchParams.get("sale") === "true";
  const isBestseller = searchParams.get("bestseller") === "true";
  const searchQuery = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const hasActiveFilters =
    (isCategoryPage ? extraCategories.length > 0 : selectedCategories.length > 0) ||
    selectedOccasions.length > 0 ||
    selectedStyles.length > 0 ||
    Boolean(selectedPrice) ||
    hasCustomPrice ||
    selectedColors.length > 0 ||
    selectedInStock ||
    isSale ||
    isBestseller ||
    Boolean(searchQuery.trim());

  // Active filter count for FILTER button badge
  const activeCategoriesCount = isCategoryPage
    ? extraCategories.length
    : selectedCategories.length;

  const activeFilterCount =
    activeCategoriesCount +
    selectedOccasions.length +
    selectedStyles.length +
    (selectedPrice || hasCustomPrice ? 1 : 0) +
    selectedColors.length +
    (selectedInStock ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (isSale ? 1 : 0) +
    (isBestseller ? 1 : 0);

  // Helper to update query string with scroll preserved
  const updateQuery = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length === 0) {
        params.delete(key);
      } else {
        params.set(key, values.join(","));
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggleCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("style"); // Reset style filter when categories change

    if (isCategoryPage && activeCategorySlug) {
      if (slug.toLowerCase() === activeCategorySlug.toLowerCase()) {
        // Customer unticked the primary category! Move to /shop with remaining categories
        params.delete("more");
        if (extraCategories.length > 0) {
          params.set("category", extraCategories.join(","));
          const qs = params.toString();
          router.push(`/shop?${qs}`, { scroll: false });
        } else {
          params.delete("category");
          const qs = params.toString();
          router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
        }
      } else {
        // Customer toggled an extra category (stored in 'more' param)
        const nextExtra = extraCategories.includes(slug)
          ? extraCategories.filter((c) => c !== slug)
          : [...extraCategories, slug];

        if (nextExtra.length === 0) {
          params.delete("more");
        } else {
          params.set("more", nextExtra.join(","));
        }
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
      return;
    }

    // Default /shop page behavior
    const currentList = selectedCategories;
    const next = currentList.includes(slug)
      ? currentList.filter((c) => c !== slug)
      : [...currentList, slug];

    if (next.length === 0) {
      params.delete("category");
      const qs = params.toString();
      router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    } else {
      params.set("category", next.join(","));
      const qs = params.toString();
      router.push(`/shop?${qs}`, { scroll: false });
    }
  };

  const toggleOccasion = (value: string) => {
    const next = selectedOccasions.includes(value)
      ? selectedOccasions.filter((o) => o !== value)
      : [...selectedOccasions, value];
    updateQuery("occasion", next);
  };

  const toggleColor = (slug: string) => {
    const next = selectedColors.includes(slug)
      ? selectedColors.filter((c) => c !== slug)
      : [...selectedColors, slug];
    updateQuery("color", next);
  };

  const toggleInStock = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedInStock) {
      params.delete("instock");
    } else {
      params.set("instock", "1");
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleMinChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    setMinInput(cleaned);
    if (priceError) setPriceError("");
  };

  const handleMaxChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    setMaxInput(cleaned);
    if (priceError) setPriceError("");
  };

  const handleApplyCustomPrice = () => {
    setPriceError("");
    const trimmedMin = minInput.trim();
    const trimmedMax = maxInput.trim();

    if (!trimmedMin && !trimmedMax) {
      if (hasCustomPrice) {
        clearCustomPrice();
      }
      return;
    }

    let minNum = trimmedMin ? parseInt(trimmedMin, 10) : undefined;
    let maxNum = trimmedMax ? parseInt(trimmedMax, 10) : undefined;

    if (minNum !== undefined && (isNaN(minNum) || minNum < 0)) {
      setPriceError("Positive numbers only");
      return;
    }
    if (maxNum !== undefined && (isNaN(maxNum) || maxNum < 0)) {
      setPriceError("Positive numbers only");
      return;
    }

    // If Min > Max, swap them (requirement 3)
    if (minNum !== undefined && maxNum !== undefined && minNum > maxNum) {
      const temp = minNum;
      minNum = maxNum;
      maxNum = temp;
      setMinInput(String(minNum));
      setMaxInput(String(maxNum));
    }

    const params = new URLSearchParams(searchParams.toString());
    // Requirement 5: Applying custom range deselects presets
    params.delete("price");

    if (minNum !== undefined) {
      params.set("minPrice", String(minNum));
    } else {
      params.delete("minPrice");
    }

    if (maxNum !== undefined) {
      params.set("maxPrice", String(maxNum));
    } else {
      params.delete("maxPrice");
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clearCustomPrice = () => {
    setMinInput("");
    setMaxInput("");
    setPriceError("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const togglePrice = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Requirement 5: Selecting a preset range clears custom values
    params.delete("minPrice");
    params.delete("maxPrice");
    setMinInput("");
    setMaxInput("");
    setPriceError("");

    if (selectedPrice === id) {
      params.delete("price");
    } else {
      params.set("price", id);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setMobileSortOpen(false);
    sortButtonRef.current?.focus();
  };

  // Reset / Clear all filters without leaving current category or page
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("more");
    params.delete("occasion");
    params.delete("style");
    params.delete("price");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("color");
    params.delete("instock");
    params.delete("bestseller");
    params.delete("sale");
    params.delete("search");
    setMinInput("");
    setMaxInput("");
    setPriceError("");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setMobileFilterOpen(false);
  };

  // ── FACETED COUNTS COMPUTATION ──────────────────────────────────────────────
  const matchCategory = (p: Product, cats: string[]) => {
    if (cats.length === 0) return true;
    return cats.some((c) => p.category?.slug.toLowerCase() === c.toLowerCase());
  };

  const matchStyle = (p: Product, styles: string[]) => {
    if (styles.length === 0) return true;
    return (
      p.styles?.some((s) =>
        styles.some((st) => st.toLowerCase() === s.toLowerCase())
      ) ?? false
    );
  };

  const matchOccasion = (p: Product, occs: string[]) => {
    if (occs.length === 0) return true;
    return occs.some((occ) => {
      const oLower = occ.toLowerCase();
      const hasOcc = p.occasion?.some(
        (o) =>
          o.toLowerCase() === oLower ||
          (oLower.includes("eid") && o.toLowerCase().includes("eid"))
      );
      const isEid = p.isEidCollection && oLower.includes("eid");
      return hasOcc || isEid;
    });
  };

  const matchPrice = (p: Product, priceId: string) => {
    if (!priceId) return true;
    const preset = PRICE_PRESETS.find((pr) => pr.id === priceId);
    if (!preset) return true;
    return p.price >= preset.min && p.price <= preset.max;
  };

  const matchPriceFilter = (p: Product) => {
    if (selectedPrice) {
      const preset = PRICE_PRESETS.find((pr) => pr.id === selectedPrice);
      if (preset) {
        return p.price >= preset.min && p.price <= preset.max;
      }
    }
    if (hasCustomPrice) {
      if (customMin !== undefined && p.price < customMin) return false;
      if (customMax !== undefined && p.price > customMax) return false;
      return true;
    }
    return true;
  };

  const matchColor = (p: Product, colors: string[]) => {
    if (colors.length === 0) return true;
    return (
      p.colorVariants?.some((v) => matchesColor(v.colorName, colors)) ?? false
    );
  };

  const matchInStock = (p: Product, inStockOnly: boolean) => {
    if (!inStockOnly) return true;
    return p.stockStatus !== "Out of Stock";
  };

  const matchSearch = (p: Product, q: string) => {
    if (!q.trim()) return true;
    const query = q.toLowerCase().trim();
    const text = `${p.name} ${p.shortDescription || ""} ${p.category?.title || ""}`.toLowerCase();
    return text.includes(query);
  };

  // 1. Categories (calculated against all other active filters)
  const productsForCategory = catalogProducts.filter(
    (p) =>
      matchOccasion(p, selectedOccasions) &&
      matchPriceFilter(p) &&
      matchColor(p, selectedColors) &&
      matchInStock(p, selectedInStock) &&
      matchSearch(p, searchQuery)
  );

  const visibleCategories = (categories || [])
    .map((cat) => {
      const count = productsForCategory.filter(
        (p) => p.category?.slug.toLowerCase() === cat.slug.toLowerCase()
      ).length;
      return { ...cat, calculatedCount: count };
    })
    .filter(
      (cat) =>
        cat.isActive !== false &&
        (cat.calculatedCount > 0 || effectiveCategories.includes(cat.slug))
    );

  // 2. Occasions (calculated against all other active filters including selected categories)
  const productsForOccasion = catalogProducts.filter(
    (p) =>
      matchCategory(p, effectiveCategories) &&
      matchStyle(p, selectedStyles) &&
      matchPriceFilter(p) &&
      matchColor(p, selectedColors) &&
      matchInStock(p, selectedInStock) &&
      matchSearch(p, searchQuery)
  );

  const visibleOccasions = OCCASION_OPTIONS.map((occ) => {
    const count = productsForOccasion.filter((p) =>
      matchOccasion(p, [occ.value])
    ).length;
    return { ...occ, count };
  }).filter((occ) => occ.count > 0 || selectedOccasions.includes(occ.value));

  // 3. Price presets (calculated against all other active filters including selected categories)
  const productsForPrice = catalogProducts.filter(
    (p) =>
      matchCategory(p, effectiveCategories) &&
      matchStyle(p, selectedStyles) &&
      matchOccasion(p, selectedOccasions) &&
      matchColor(p, selectedColors) &&
      matchInStock(p, selectedInStock) &&
      matchSearch(p, searchQuery)
  );

  const visiblePrices = PRICE_PRESETS.map((preset) => {
    const count = productsForPrice.filter((p) =>
      matchPrice(p, preset.id)
    ).length;
    return { ...preset, count };
  }).filter((preset) => preset.count > 0 || selectedPrice === preset.id);

  // 4. Color options (calculated against all other active filters including selected categories)
  const availableColorsMap = new Map<
    string,
    { name: string; hex: string; slug: string }
  >();
  const colorSourceProducts =
    effectiveCategories.length > 0
      ? catalogProducts.filter((p) => matchCategory(p, effectiveCategories))
      : catalogProducts;

  colorSourceProducts.forEach((p) => {
    p.colorVariants?.forEach((v) => {
      const slug = colorToSlug(v.colorName);
      if (!availableColorsMap.has(slug)) {
        availableColorsMap.set(slug, {
          name: v.colorName,
          hex: v.colorHex || "#111111",
          slug,
        });
      }
    });
  });

  const productsForColor = catalogProducts.filter(
    (p) =>
      matchCategory(p, effectiveCategories) &&
      matchStyle(p, selectedStyles) &&
      matchOccasion(p, selectedOccasions) &&
      matchPriceFilter(p) &&
      matchInStock(p, selectedInStock) &&
      matchSearch(p, searchQuery)
  );

  const visibleColors = Array.from(availableColorsMap.values())
    .map((color) => {
      const count = productsForColor.filter((p) =>
        matchColor(p, [color.slug])
      ).length;
      return { ...color, count };
    })
    .filter((color) => color.count > 0 || selectedColors.includes(color.slug));

  // 5. Availability (In stock only, calculated against all other active filters including selected categories)
  const productsForAvailability = catalogProducts.filter(
    (p) =>
      matchCategory(p, effectiveCategories) &&
      matchStyle(p, selectedStyles) &&
      matchOccasion(p, selectedOccasions) &&
      matchPriceFilter(p) &&
      matchColor(p, selectedColors) &&
      matchSearch(p, searchQuery)
  );

  const inStockCount = productsForAvailability.filter(
    (p) => p.stockStatus !== "Out of Stock"
  ).length;
  const showAvailabilitySection = inStockCount > 0 || selectedInStock;

  // Compute category style options for Quick Chips on category page
  const categoryStyleOptions =
    isCategoryPage && activeCategorySlug
      ? getStylesForCategory(activeCategorySlug)
      : [];

  const baseCategoryProducts =
    isCategoryPage && activeCategorySlug
      ? catalogProducts.filter(
          (p) => p.category?.slug.toLowerCase() === activeCategorySlug.toLowerCase()
        )
      : [];

  const stylesWithCounts = categoryStyleOptions
    .map((opt) => {
      const count = baseCategoryProducts.filter((p) =>
        p.styles?.includes(opt.value)
      ).length;
      return { label: opt.label, value: opt.value, count };
    })
    .filter((s) => s.count > 0);

  const hasMultipleCategories = isCategoryPage && extraCategories.length > 0;

  // Active filter removable chips list
  const activeChips: { id: string; label: string; onRemove: () => void }[] = [];

  if (isCategoryPage) {
    extraCategories.forEach((slug) => {
      const cat = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
      activeChips.push({
        id: `cat-${slug}`,
        label: cat?.title || slug,
        onRemove: () => toggleCategory(slug),
      });
    });
  } else {
    selectedCategories.forEach((slug) => {
      const cat = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
      activeChips.push({
        id: `cat-${slug}`,
        label: cat?.title || slug,
        onRemove: () => toggleCategory(slug),
      });
    });
  }

  selectedStyles.forEach((st) => {
    activeChips.push({
      id: `style-${st}`,
      label: st,
      onRemove: () => {
        const next = selectedStyles.filter((s) => s !== st);
        updateQuery("style", next);
      },
    });
  });

  selectedOccasions.forEach((occ) => {
    const opt = OCCASION_OPTIONS.find((o) => o.value === occ);
    activeChips.push({
      id: `occ-${occ}`,
      label: opt?.label || occ,
      onRemove: () => toggleOccasion(occ),
    });
  });

  if (selectedPrice) {
    const preset = PRICE_PRESETS.find((p) => p.id === selectedPrice);
    activeChips.push({
      id: `price-${selectedPrice}`,
      label: preset?.label || selectedPrice,
      onRemove: () => togglePrice(selectedPrice),
    });
  }

  if (hasCustomPrice) {
    let customLabel = "Custom Price";
    if (customMin !== undefined && customMax !== undefined) {
      customLabel = `Rs. ${customMin.toLocaleString()} – ${customMax.toLocaleString()}`;
    } else if (customMin !== undefined) {
      customLabel = `Min Rs. ${customMin.toLocaleString()}`;
    } else if (customMax !== undefined) {
      customLabel = `Max Rs. ${customMax.toLocaleString()}`;
    }

    activeChips.push({
      id: "price-custom",
      label: customLabel,
      onRemove: clearCustomPrice,
    });
  }

  selectedColors.forEach((slug) => {
    const col = availableColorsMap.get(slug);
    activeChips.push({
      id: `color-${slug}`,
      label: col?.name || slug,
      onRemove: () => toggleColor(slug),
    });
  });

  if (selectedInStock) {
    activeChips.push({
      id: "instock",
      label: "In Stock",
      onRemove: toggleInStock,
    });
  }

  if (searchQuery.trim()) {
    activeChips.push({
      id: "search",
      label: `"${searchQuery}"`,
      onRemove: clearSearch,
    });
  }

  // ── CUSTOM PRICE RANGE BOX COMPONENT ─────────────────────────────────────────
  const renderCustomPriceBox = (prefix: string) => (
    <div className="mt-3 pt-3 border-t border-[#E5E5E5]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-black">
          Custom (PKR)
        </span>
        {(hasCustomPrice || minInput || maxInput) && (
          <button
            type="button"
            onClick={clearCustomPrice}
            className="font-sans text-[11px] text-[#6B6B6B] hover:text-black uppercase tracking-[0.06em] underline underline-offset-2 transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="relative">
          <input
            id={`${prefix}-min-price`}
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            value={minInput}
            onChange={(e) => handleMinChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyCustomPrice();
              }
            }}
            aria-label="Minimum price in PKR"
            className="w-full rounded-[8px] border border-[#E5E5E5] bg-white px-2.5 py-1.5 font-sans text-[12px] text-black placeholder:text-[#9E9E9E] focus:border-black focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <span className="text-[#9E9E9E] text-[13px] font-medium select-none text-center">–</span>
        <div className="relative">
          <input
            id={`${prefix}-max-price`}
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            value={maxInput}
            onChange={(e) => handleMaxChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyCustomPrice();
              }
            }}
            aria-label="Maximum price in PKR"
            className="w-full rounded-[8px] border border-[#E5E5E5] bg-white px-2.5 py-1.5 font-sans text-[12px] text-black placeholder:text-[#9E9E9E] focus:border-black focus:outline-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleApplyCustomPrice}
          className="rounded-[8px] border border-black bg-black px-4 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-neutral-800 cursor-pointer min-h-[34px]"
        >
          Apply
        </button>
        {priceError && (
          <span className="font-sans text-[11px] text-[#A6843D] font-medium">
            {priceError}
          </span>
        )}
      </div>
    </div>
  );

  // ── DESKTOP SIDEBAR FLAT CONTENT ────────────────────────────────────────────
  const desktopFilterContent = (
    <div className="space-y-6">
      {/* Active Search Term Badge */}
      {searchQuery.trim() && (
        <div className="border border-[#E5E5E5] bg-[#F7F7F7] p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <span className="text-[#6B6B6B] block font-sans text-[10px] font-medium uppercase tracking-[0.08em]">
                Active Search
              </span>
              <p className="text-black font-sans text-[12px] font-semibold truncate">
                &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
            <button
              type="button"
              onClick={clearSearch}
              className="text-[#6B6B6B] hover:text-black p-1 border border-[#E5E5E5] bg-white transition-colors"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      )}

      {/* 1. CATEGORIES */}
      {!hideCategoriesSection && visibleCategories.length > 0 && (
        <div>
          <h3 className="text-black border-b border-[#E5E5E5] mb-3 flex items-center justify-between pb-2 font-sans text-[12px] font-semibold tracking-[0.08em] uppercase">
            <span>Categories</span>
            {effectiveCategories.length > 0 && (
              <span className="text-[#A6843D] text-[11px] font-semibold">
                ({effectiveCategories.length})
              </span>
            )}
          </h3>
          <div className="space-y-2">
            {visibleCategories.map((cat) => {
              const isChecked = effectiveCategories.includes(cat.slug);

              return (
                <label
                  key={cat._id}
                  onClick={() => toggleCategory(cat.slug)}
                  className="group flex cursor-pointer items-center justify-between text-[13px] text-black transition-colors select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                        isChecked
                          ? "border-black bg-black text-white"
                          : "border-[#E5E5E5] group-hover:border-black bg-white"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </div>
                    <span
                      className={
                        isChecked
                          ? "text-black font-semibold"
                          : "text-black/90 font-normal"
                      }
                    >
                      {cat.title}
                    </span>
                  </div>
                  <span className="text-[#6B6B6B] font-sans text-[12px]">
                    {cat.calculatedCount}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. OCCASION */}
      {visibleOccasions.length > 0 && (
        <div>
          <h3 className="text-black border-b border-[#E5E5E5] mb-3 flex items-center justify-between pb-2 font-sans text-[12px] font-semibold tracking-[0.08em] uppercase">
            <span>Occasion</span>
            {selectedOccasions.length > 0 && (
              <span className="text-[#A6843D] text-[11px] font-semibold">
                ({selectedOccasions.length})
              </span>
            )}
          </h3>
          <div className="space-y-2">
            {visibleOccasions.map((occ) => {
              const isChecked = selectedOccasions.includes(occ.value);
              return (
                <label
                  key={occ.value}
                  onClick={() => toggleOccasion(occ.value)}
                  className="group flex cursor-pointer items-center justify-between text-[13px] text-black transition-colors select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                        isChecked
                          ? "border-black bg-black text-white"
                          : "border-[#E5E5E5] group-hover:border-black bg-white"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </div>
                    <span
                      className={
                        isChecked
                          ? "text-black font-semibold"
                          : "text-black/90 font-normal"
                      }
                    >
                      {occ.label}
                    </span>
                  </div>
                  <span className="text-[#6B6B6B] font-sans text-[12px]">
                    {occ.count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PRICE RANGE (PKR) */}
      {(visiblePrices.length > 0 || hasCustomPrice) && (
        <div>
          <h3 className="text-black border-b border-[#E5E5E5] mb-3 pb-2 font-sans text-[12px] font-semibold tracking-[0.08em] uppercase">
            <span>Price (PKR)</span>
          </h3>
          <div className="flex flex-col gap-1.5">
            {visiblePrices.map((preset) => {
              const isSelected = selectedPrice === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => togglePrice(preset.id)}
                  className={`w-full rounded-[8px] border px-3 py-2 text-left text-[12px] font-medium tracking-[0.04em] uppercase transition-colors flex items-center justify-between ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-[#E5E5E5] text-black hover:border-black hover:bg-[#F7F7F7] bg-white"
                  }`}
                >
                  <span>{preset.label}</span>
                  <span
                    className={`text-[11px] ${
                      isSelected ? "text-white/80" : "text-[#6B6B6B]"
                    }`}
                  >
                    ({preset.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Price Range Inputs */}
          {renderCustomPriceBox("desktop")}
        </div>
      )}

      {/* 4. COLOR */}
      {visibleColors.length > 0 && (
        <div>
          <h3 className="text-black border-b border-[#E5E5E5] mb-3 flex items-center justify-between pb-2 font-sans text-[12px] font-semibold tracking-[0.08em] uppercase">
            <span>Color</span>
            {selectedColors.length > 0 && (
              <span className="text-[#A6843D] text-[11px] font-semibold">
                ({selectedColors.length})
              </span>
            )}
          </h3>
          <div className="space-y-2">
            {visibleColors.map((color) => {
              const isChecked = selectedColors.includes(color.slug);
              return (
                <label
                  key={color.slug}
                  onClick={() => toggleColor(color.slug)}
                  className="group flex cursor-pointer items-center justify-between text-[13px] text-black transition-colors select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                        isChecked
                          ? "border-black bg-black text-white"
                          : "border-[#E5E5E5] group-hover:border-black bg-white"
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </div>
                    <span
                      className="h-3.5 w-3.5 border border-black/20 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span
                      className={
                        isChecked
                          ? "text-black font-semibold"
                          : "text-black/90 font-normal"
                      }
                    >
                      {color.name}
                    </span>
                  </div>
                  <span className="text-[#6B6B6B] font-sans text-[12px]">
                    {color.count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. AVAILABILITY */}
      {showAvailabilitySection && (
        <div>
          <h3 className="text-black border-b border-[#E5E5E5] mb-3 pb-2 font-sans text-[12px] font-semibold tracking-[0.08em] uppercase">
            <span>Availability</span>
          </h3>
          <div className="space-y-2">
            <label
              onClick={toggleInStock}
              className="group flex cursor-pointer items-center justify-between text-[13px] text-black transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                    selectedInStock
                      ? "border-black bg-black text-white"
                      : "border-[#E5E5E5] group-hover:border-black bg-white"
                  }`}
                >
                  {selectedInStock && <Check className="h-3 w-3 stroke-[2.5]" />}
                </div>
                <span
                  className={
                    selectedInStock
                      ? "text-black font-semibold"
                      : "text-black/90 font-normal"
                  }
                >
                  In stock only
                </span>
              </div>
              <span className="text-[#6B6B6B] font-sans text-[12px]">
                {inStockCount}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Clear Filters CTA */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={clearAllFilters}
            className="w-full border border-black py-2.5 text-center font-sans text-[12px] font-medium tracking-[0.08em] uppercase transition-colors bg-white text-black hover:bg-black hover:text-white"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ===================================================================== */}
      {/* 1. MOBILE/TABLET STICKY TOOLBAR (<1024px)                             */}
      {/* ===================================================================== */}
      <div className="sticky top-[96px] z-30 bg-white border-b border-[#E5E5E5] pt-2 pb-2.5 lg:hidden w-full">
        <div className="grid grid-cols-2 gap-2">
          {/* FILTER Button */}
          <button
            ref={filterButtonRef}
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            aria-label="Open filter options"
            className="flex h-11 items-center justify-center gap-2 border border-[#E5E5E5] bg-white font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-black hover:border-black transition-colors rounded-[8px]"
          >
            <SlidersHorizontal className="h-4 w-4 stroke-[1.5]" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center px-1 rounded-[4px] bg-[#A6843D] font-sans text-[10px] font-bold leading-none text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* SORT Button */}
          <button
            ref={sortButtonRef}
            type="button"
            onClick={() => setMobileSortOpen(true)}
            aria-label="Open sort options"
            className="flex h-11 items-center justify-center gap-2 border border-[#E5E5E5] bg-white font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-black hover:border-black transition-colors rounded-[8px]"
          >
            <ArrowUpDown className="h-4 w-4 stroke-[1.5]" />
            <span>Sort</span>
          </button>
        </div>

        {/* Item count line directly under buttons */}
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-sans text-[11px] text-[#6B6B6B]">
            {totalProducts} {totalProducts === 1 ? "item found" : "items found"}
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MOBILE/TABLET QUICK CHIPS ROW (<1024px)                            */}
      {/* Styles (category pages) → Occasion → In Stock                        */}
      {/* ===================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden w-full">
        {/* On /category/[slug]: style chips (ALL (n), then each style with count) */}
        {isCategoryPage && !hasMultipleCategories && stylesWithCounts.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => updateQuery("style", [])}
              className={`shrink-0 rounded-[8px] border px-3 py-1.5 font-sans text-[11px] font-medium tracking-[0.04em] uppercase transition-colors select-none ${
                selectedStyles.length === 0
                  ? "border-black bg-black text-white"
                  : "border-[#E5E5E5] bg-white text-black hover:border-black"
              }`}
            >
              All ({baseCategoryProducts.length})
            </button>
            {stylesWithCounts.map((st) => {
              const isSelected = selectedStyles.includes(st.value);
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => {
                    const next = isSelected
                      ? selectedStyles.filter((s) => s !== st.value)
                      : [st.value];
                    updateQuery("style", next);
                  }}
                  className={`shrink-0 rounded-[8px] border px-3 py-1.5 font-sans text-[11px] font-medium tracking-[0.04em] uppercase transition-colors select-none ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-[#E5E5E5] bg-white text-black hover:border-black"
                  }`}
                >
                  {st.label} ({st.count})
                </button>
              );
            })}
          </>
        )}

        {/* Occasion chips (both /shop and /category pages) */}
        {visibleOccasions.map((occ) => {
          const isSelected = selectedOccasions.includes(occ.value);
          return (
            <button
              key={occ.value}
              type="button"
              onClick={() => toggleOccasion(occ.value)}
              className={`shrink-0 rounded-[8px] border px-3 py-1.5 font-sans text-[11px] font-medium tracking-[0.04em] uppercase transition-colors select-none ${
                isSelected
                  ? "border-black bg-black text-white"
                  : "border-[#E5E5E5] bg-white text-black hover:border-black"
              }`}
            >
              {occ.label} ({occ.count})
            </button>
          );
        })}

        {/* "In stock" chip — always last */}
        {showAvailabilitySection && (
          <button
            type="button"
            onClick={toggleInStock}
            className={`shrink-0 rounded-[8px] border px-3 py-1.5 font-sans text-[11px] font-medium tracking-[0.04em] uppercase transition-colors select-none ${
              selectedInStock
                ? "border-black bg-black text-white"
                : "border-[#E5E5E5] bg-white text-black hover:border-black"
            }`}
          >
            In Stock ({inStockCount})
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. ACTIVE REMOVABLE FILTER CHIPS (<1024px)                            */}
      {/* ===================================================================== */}
      {activeChips.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden w-full">
          {activeChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={chip.onRemove}
              className="inline-flex shrink-0 items-center gap-1.5 border border-black bg-white px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] uppercase text-black hover:bg-[#F7F7F7] select-none rounded-[8px] transition-colors"
            >
              <span>{chip.label}</span>
              <X className="h-3 w-3 stroke-[1.5]" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="shrink-0 font-sans text-[11px] font-medium tracking-[0.08em] uppercase text-[#6B6B6B] hover:text-black hover:underline pl-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. MOBILE FILTER BOTTOM SHEET (<1024px)                              */}
      {/* ===================================================================== */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter options"
          className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity motion-reduce:transition-none"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* 90vh Bottom Sheet */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative z-10 w-full bg-white border-t border-[#E5E5E5] flex flex-col max-h-[90vh] h-[90vh] shadow-none motion-reduce:transition-none"
          >
            {/* Drag Handle Indicator */}
            <div className="w-10 h-1 bg-[#D1D1D1] rounded-full mx-auto my-2 shrink-0" />

            {/* Header: FILTERS on left, CLEAR ALL and close X on right */}
            <div className="flex-none flex items-center justify-between border-b border-[#E5E5E5] px-6 py-3">
              <h2 className="font-sans text-[14px] font-semibold tracking-[0.08em] uppercase text-black">
                Filters
              </h2>
              <div className="flex items-center gap-4">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="font-sans text-[11px] font-medium tracking-[0.08em] uppercase text-[#6B6B6B] hover:text-black hover:underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileFilterOpen(false);
                    filterButtonRef.current?.focus();
                  }}
                  className="p-1 text-black hover:opacity-70"
                  aria-label="Close filters sheet"
                >
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>
            </div>

            {/* Scrollable Body with Collapsible Accordion Sections */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {/* Accordion a: CATEGORIES */}
              {!hideCategoriesSection && visibleCategories.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("categories")}
                    aria-expanded={Boolean(openSections.categories)}
                    className="w-full flex items-center justify-between py-3.5 border-b border-[#E5E5E5] text-left min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-black">
                        Categories
                      </span>
                      {effectiveCategories.length > 0 && (
                        <span className="text-[#A6843D] text-[11px] font-semibold">
                          ({effectiveCategories.length})
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 stroke-[1.5] text-black transition-transform duration-200 ${
                        openSections.categories ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSections.categories && (
                    <div className="space-y-1 py-2 border-b border-[#E5E5E5]">
                      {visibleCategories.map((cat) => {
                        const isChecked = effectiveCategories.includes(cat.slug);
                        return (
                          <label
                            key={cat._id}
                            onClick={() => toggleCategory(cat.slug)}
                            className="group flex min-h-[44px] cursor-pointer items-center justify-between py-2 text-[13px] text-black transition-colors select-none"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                                  isChecked
                                    ? "border-black bg-black text-white"
                                    : "border-[#E5E5E5] group-hover:border-black bg-white"
                                }`}
                              >
                                {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                              </div>
                              <span
                                className={
                                  isChecked
                                    ? "text-black font-semibold"
                                    : "text-black/90 font-normal"
                                }
                              >
                                {cat.title}
                              </span>
                            </div>
                            <span className="text-[#6B6B6B] font-sans text-[12px]">
                              {cat.calculatedCount}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion b: OCCASION */}
              {visibleOccasions.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("occasion")}
                    aria-expanded={Boolean(openSections.occasion)}
                    className="w-full flex items-center justify-between py-3.5 border-b border-[#E5E5E5] text-left min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-black">
                        Occasion
                      </span>
                      {selectedOccasions.length > 0 && (
                        <span className="text-[#A6843D] text-[11px] font-semibold">
                          ({selectedOccasions.length})
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 stroke-[1.5] text-black transition-transform duration-200 ${
                        openSections.occasion ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSections.occasion && (
                    <div className="space-y-1 py-2 border-b border-[#E5E5E5]">
                      {visibleOccasions.map((occ) => {
                        const isChecked = selectedOccasions.includes(occ.value);
                        return (
                          <label
                            key={occ.value}
                            onClick={() => toggleOccasion(occ.value)}
                            className="group flex min-h-[44px] cursor-pointer items-center justify-between py-2 text-[13px] text-black transition-colors select-none"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                                  isChecked
                                    ? "border-black bg-black text-white"
                                    : "border-[#E5E5E5] group-hover:border-black bg-white"
                                }`}
                              >
                                {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                              </div>
                              <span
                                className={
                                  isChecked
                                    ? "text-black font-semibold"
                                    : "text-black/90 font-normal"
                                }
                              >
                                {occ.label}
                              </span>
                            </div>
                            <span className="text-[#6B6B6B] font-sans text-[12px]">
                              {occ.count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion c: PRICE (PKR) */}
              {(visiblePrices.length > 0 || hasCustomPrice) && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("price")}
                    aria-expanded={Boolean(openSections.price)}
                    className="w-full flex items-center justify-between py-3.5 border-b border-[#E5E5E5] text-left min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-black">
                        Price (PKR)
                      </span>
                      {Boolean(selectedPrice || hasCustomPrice) && (
                        <span className="text-[#A6843D] text-[11px] font-semibold">
                          (1)
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 stroke-[1.5] text-black transition-transform duration-200 ${
                        openSections.price ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSections.price && (
                    <div className="flex flex-col gap-2 py-3 border-b border-[#E5E5E5]">
                      {visiblePrices.map((preset) => {
                        const isSelected = selectedPrice === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => togglePrice(preset.id)}
                            className={`w-full rounded-[8px] border px-3.5 py-2.5 text-left text-[12px] font-medium tracking-[0.04em] uppercase transition-colors flex items-center justify-between min-h-[44px] ${
                              isSelected
                                ? "border-black bg-black text-white"
                                : "border-[#E5E5E5] text-black hover:border-black hover:bg-[#F7F7F7] bg-white"
                            }`}
                          >
                            <span>{preset.label}</span>
                            <span
                              className={`text-[11px] ${
                                isSelected ? "text-white/80" : "text-[#6B6B6B]"
                              }`}
                            >
                              ({preset.count})
                            </span>
                          </button>
                        );
                      })}

                      {/* Custom Price Range Inputs for Mobile */}
                      {renderCustomPriceBox("mobile")}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion d: COLOR */}
              {visibleColors.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("color")}
                    aria-expanded={Boolean(openSections.color)}
                    className="w-full flex items-center justify-between py-3.5 border-b border-[#E5E5E5] text-left min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-black">
                        Color
                      </span>
                      {selectedColors.length > 0 && (
                        <span className="text-[#A6843D] text-[11px] font-semibold">
                          ({selectedColors.length})
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 stroke-[1.5] text-black transition-transform duration-200 ${
                        openSections.color ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSections.color && (
                    <div className="space-y-1 py-2 border-b border-[#E5E5E5]">
                      {visibleColors.map((color) => {
                        const isChecked = selectedColors.includes(color.slug);
                        return (
                          <label
                            key={color.slug}
                            onClick={() => toggleColor(color.slug)}
                            className="group flex min-h-[44px] cursor-pointer items-center justify-between py-2 text-[13px] text-black transition-colors select-none"
                          >
                            <div className="flex items-center gap-3">
                              <div
                              className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                                  isChecked
                                    ? "border-black bg-black text-white"
                                    : "border-[#E5E5E5] group-hover:border-black bg-white"
                                }`}
                              >
                                {isChecked && <Check className="h-3 w-3 stroke-[2.5]" />}
                              </div>
                              <span
                                className="h-3.5 w-3.5 border border-black/20 shrink-0"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span
                                className={
                                  isChecked
                                    ? "text-black font-semibold"
                                    : "text-black/90 font-normal"
                                }
                              >
                                {color.name}
                              </span>
                            </div>
                            <span className="text-[#6B6B6B] font-sans text-[12px]">
                              {color.count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion e: AVAILABILITY */}
              {showAvailabilitySection && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("availability")}
                    aria-expanded={Boolean(openSections.availability)}
                    className="w-full flex items-center justify-between py-3.5 border-b border-[#E5E5E5] text-left min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-black">
                        Availability
                      </span>
                      {selectedInStock && (
                        <span className="text-[#A6843D] text-[11px] font-semibold">
                          (1)
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 stroke-[1.5] text-black transition-transform duration-200 ${
                        openSections.availability ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSections.availability && (
                    <div className="space-y-1 py-2 border-b border-[#E5E5E5]">
                      <label
                        onClick={toggleInStock}
                        className="group flex min-h-[44px] cursor-pointer items-center justify-between py-2 text-[13px] text-black transition-colors select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${
                              selectedInStock
                                ? "border-black bg-black text-white"
                                : "border-[#E5E5E5] group-hover:border-black bg-white"
                            }`}
                          >
                            {selectedInStock && <Check className="h-3 w-3 stroke-[2.5]" />}
                          </div>
                          <span
                            className={
                              selectedInStock
                                ? "text-black font-semibold"
                                : "text-black/90 font-normal"
                            }
                          >
                            In stock only
                          </span>
                        </div>
                        <span className="text-[#6B6B6B] font-sans text-[12px]">
                          {inStockCount}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Bottom Bar inside Filter Sheet: subtle 1px border, safe-area padding */}
            <div className="flex-none border-t border-[#E5E5E5] bg-white px-6 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {totalProducts > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileFilterOpen(false);
                    filterButtonRef.current?.focus();
                  }}
                  className="w-full bg-black hover:bg-[#222222] py-3.5 font-sans text-[12px] font-semibold tracking-[0.08em] text-white uppercase transition-colors rounded-[8px]"
                >
                  SHOW {totalProducts} {totalProducts === 1 ? "PRODUCT" : "PRODUCTS"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full bg-[#E5E5E5] py-3.5 font-sans text-[12px] font-semibold tracking-[0.08em] text-[#6B6B6B] uppercase cursor-not-allowed rounded-[8px]"
                >
                  NO PRODUCTS MATCH
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. MOBILE SORT BOTTOM SHEET (<1024px)                                 */}
      {/* ===================================================================== */}
      {mobileSortOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sort options"
          className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity motion-reduce:transition-none"
            onClick={() => setMobileSortOpen(false)}
          />

          {/* Small Bottom Sheet */}
          <div className="relative z-10 w-full bg-white border-t border-[#E5E5E5] flex flex-col max-h-[50vh] shadow-none motion-reduce:transition-none">
            {/* Header */}
            <div className="flex-none flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
              <h2 className="font-sans text-[13px] font-semibold tracking-[0.08em] uppercase text-black">
                Sort By
              </h2>
              <button
                type="button"
                onClick={() => {
                  setMobileSortOpen(false);
                  sortButtonRef.current?.focus();
                }}
                className="p-1 text-black hover:opacity-70"
                aria-label="Close sort sheet"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Options List */}
            <div className="flex-1 overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = currentSort === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSortChange(opt.value)}
                    className="w-full min-h-[48px] px-6 py-3.5 flex items-center justify-between border-b border-[#F0F0F0] text-left transition-colors hover:bg-[#F9F9F9]"
                  >
                    <span
                      className={`font-sans text-[13px] tracking-[0.04em] uppercase ${
                        isSelected ? "font-semibold text-black" : "text-black/80 font-normal"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isSelected && <Check className="h-4 w-4 stroke-[2] text-black" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. DESKTOP STICKY SIDEBAR (>=1024px) — Kept exactly as it is           */}
      {/* ===================================================================== */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24 border border-[#E5E5E5] bg-white p-5">
          <div className="mb-5 flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <h2 className="font-sans text-[13px] font-semibold tracking-[0.08em] uppercase text-black">
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-sans text-[11px] font-medium tracking-[0.08em] uppercase text-[#6B6B6B] hover:text-black hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {desktopFilterContent}
        </div>
      </aside>
    </>
  );
}

export default FilterSidebar;
