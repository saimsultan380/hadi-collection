import { Truck, RefreshCw, ShieldCheck, Lock } from "lucide-react";

// =============================================================================
// BENEFITS STRIP (4 COLUMNS)
// Thin line icons, small uppercase title and one gray line each:
// Fast Delivery, Easy Returns, Premium Quality, Secure Payment.
// =============================================================================

export function ProductBenefitsStrip() {
  const BENEFITS = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "2–4 business days across Pakistan",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "7-day hassle-free exchange & return",
    },
    {
      icon: ShieldCheck,
      title: "Premium Quality",
      description: "Handcrafted with high-grade materials",
    },
    {
      icon: Lock,
      title: "Secure Payment",
      description: "Cash on delivery & verified bank transfers",
    },
  ];

  return (
    <section className="w-full border-y border-[#E5E5E5] py-8 sm:py-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
        {BENEFITS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-4 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E5E5E5] bg-white text-[#A6843D]">
                <Icon className="h-4.5 w-4.5 stroke-[1.5] text-[#A6843D]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black">
                  {item.title}
                </h3>
                <p className="mt-1 font-sans text-[12px] text-[#6B6B6B] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProductBenefitsStrip;
