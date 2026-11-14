import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { OCCASION_TILES } from "@/content/home";

// =============================================================================
// SECTION 6 — SHOP BY OCCASION
// 4 flat tiles in a 2x2 (mobile) / 4-column (desktop) grid.
// Each tile is a single <Link> (whole tile clickable) with image, text, and
// a pinned flat terracotta "Shop Now" button aligned across all cards.
// Solid palette backgrounds, object-fit: cover images, flat editorial style.
// =============================================================================

export function ShopByOccasion() {
  return (
    <section
      className="border-t border-[#E8E8E8] bg-white py-14 sm:py-20"
      aria-labelledby="shop-by-occasion-heading"
    >
      <Container>
        <div className="mb-8 sm:mb-11 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-[#A6843D] mb-2">
              Shop by cloth
            </p>
            <h2
              id="shop-by-occasion-heading"
              className="font-display text-4xl sm:text-5xl font-medium text-[#2C2118]"
            >
              Choose a print
            </h2>
          </div>
          <p className="max-w-xs font-sans text-[13px] leading-relaxed text-[#7A6858]">
            Lawn for the day, gold borders for the evening. Every suit is unstitched.
          </p>
        </div>

        {/* 2-col mobile → 4-col desktop grid with equal height cards */}
        <ul
          className="grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4 list-none p-0 m-0 items-stretch"
          role="list"
        >
          {OCCASION_TILES.map((tile) => (
            <li key={tile.id} className="flex flex-col h-full">
              <Link
                href={tile.href}
                aria-label={tile.ariaLabel}
                className="group flex flex-col h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6843D]"
              >
                {/* Image block */}
                <div
                  className="relative w-full overflow-hidden rounded-2xl shrink-0"
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: tile.bg,
                  }}
                >
                  <Image
                    src={tile.imageSrc}
                    alt={tile.imageAlt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{
                      objectPosition:
                        (tile as { objectPosition?: string }).objectPosition ||
                        "center center",
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Text & Button block: flex-1 flex-col so button pins to bottom */}
                <div className="flex flex-1 flex-col pt-3 pb-1">
                  <h3 className="font-sans text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.06em] text-black group-hover:text-[#A6843D] transition-colors">
                    {tile.title}
                  </h3>
                  <p className="mt-1 font-sans text-[11px] sm:text-[12px] text-[#6B6B6B] leading-snug">
                    {tile.description}
                  </p>

                  {/* Pinned flat terracotta button */}
                  <div className="mt-auto pt-3 sm:pt-3.5">
                    <span className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full bg-[#2C2118] px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 group-hover:bg-[#A6843D]">
                      <span>Shop Now</span>
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
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
