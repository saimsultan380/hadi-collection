import { Banknote, RefreshCw, Truck } from "lucide-react";

// =============================================================================
// PRODUCT TRUST ROW
// Three equal columns, icon on top, short label below, never cut off.
// Clean square styling with 1px dividers matching brand design system.
// =============================================================================

export function ProductTrustBadges() {
  const TRUST_ITEMS = [
    {
      icon: Banknote,
      title: "Cash on Delivery",
    },
    {
      icon: RefreshCw,
      title: "Easy 7-Day Returns",
    },
    {
      icon: Truck,
      title: "Nationwide Delivery",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 border-y border-[#E5E5E5] py-4 text-center">
      {TRUST_ITEMS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex flex-col items-center justify-center gap-1.5 px-1"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#E5E5E5] bg-white text-[#A6843D]">
              <Icon className="h-4 w-4 stroke-[1.5] text-[#A6843D]" />
            </div>
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.04em] text-black leading-tight text-center break-words">
              {item.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ProductTrustBadges;
