import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/ProductCard";
import { getCategories, getFeaturedProducts } from "@/lib/products";
import { urlForImage } from "@/lib/image";
import { ShopByOccasion } from "@/components/sections/ShopByOccasion";
import { CategoryTile } from "@/components/sections/CategoryTile";
import { HowToOrder } from "@/components/sections/HowToOrder";
import { HomepageFaq } from "@/components/sections/HomepageFaq";
import { HomepageSeoText } from "@/components/sections/HomepageSeoText";
import { WhatsAppGlyph } from "@/components/ui/social-icons";
import {
  CONTACT,
  HOME_FAQS,
  buildFaqAnswerText,
} from "@/content/home";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export const metadata: Metadata = {
  title: "Ladies Unstitched Suits in Pakistan",
  description:
    "Shop Hadi Collection lawn, embroidered and festive unstitched suits. 2-piece and 3-piece, cash on delivery, nationwide.",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-PK": SITE_URL,
    },
  },
  openGraph: {
    title: "Hadi Collection | Elegance in Every Thread",
    description:
      "Ladies unstitched suits — lawn prints, embroidery and festive gold borders — delivered across Pakistan.",
    url: SITE_URL,
    siteName: "Hadi Collection",
    locale: "en-PK",
    alternateLocale: ["en_PK"],
    type: "website",
    images: [
      {
        url: "/hadi-og.png",
        width: 1200,
        height: 630,
        alt: "Hadi Collection — Elegance in Every Thread",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hadi Collection | Elegance in Every Thread",
    description:
      "Ladies unstitched lawn and festive suits, with cash on delivery across Pakistan.",
    images: ["/hadi-og.png"],
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Hadi Collection",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: buildFaqAnswerText(faq),
      },
    })),
  };

  return (
    <div className="flex flex-col bg-white text-[#2C2118]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative isolate min-h-[58vh] w-full overflow-hidden sm:min-h-[62vh] lg:min-h-[66vh]">
        <Image
          src="/images/hadi/rani-festive.jpg"
          alt="Rani Festive unstitched suit with a gold paisley border"
          fill
          priority
          sizes="100vw"
          data-no-radius
          className="object-cover object-center scale-105 motion-safe:animate-[heroDrift_18s_ease-in-out_infinite_alternate]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[58vh] items-center sm:min-h-[62vh] lg:min-h-[66vh]">
          <Container className="w-full py-10 sm:py-12">
            <div className="max-w-2xl text-white">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.36em] text-[#E8C878]">
                Ladies Unstitched · Pakistan
              </p>
              <h1 className="mt-3 font-display text-5xl font-medium leading-[0.94] text-[#FFFBF5] [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
                Hadi
                <span className="mt-1 block italic text-[#F6E7C1]">
                  Collection
                </span>
              </h1>
              <p className="mt-5 font-display text-2xl italic text-[#E8C878] sm:text-3xl">
                Elegance in Every Thread
              </p>
              <p className="mt-5 max-w-lg font-sans text-[15px] leading-relaxed text-white/80 sm:text-base">
                Premium lawn, embroidered and festive suits — sold unstitched as
                2-piece and 3-piece sets, cut later to your measure.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[11px] uppercase tracking-[0.18em] text-white/70">
                <span>Cash on Delivery</span>
                <span className="h-1 w-1 rounded-full bg-[#E8C878]" />
                <span>2–4 Day Delivery</span>
                <span className="h-1 w-1 rounded-full bg-[#E8C878]" />
                <span>7-Day Exchange</span>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-[#A6843D] px-8 py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#F3E6C8] hover:text-[#2C2118]"
                >
                  Shop the Edit
                </Link>
                <Link
                  href="/category/festive-edit"
                  className="inline-flex items-center justify-center rounded-full border border-white/70 px-8 py-3.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#2C2118]"
                >
                  Festive Suits
                </Link>
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1EBE57]"
                >
                  <WhatsAppGlyph className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section className="bg-white pt-16 pb-20 sm:py-24">
        <Container className="max-w-[1440px]">
          <div className="mb-10 sm:mb-14 text-center">
            <p className="mb-2 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-[#A6843D]">
              The Edit
            </p>
            <h2 className="font-display text-4xl font-medium text-[#2C2118] sm:text-5xl">
              Four ways to dress
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {categories
              .filter((c) => c.isActive !== false && (c.productCount ?? 0) > 0)
              .map((category) => {
                const categoryImgUrl = category.image
                  ? urlForImage(category.image)?.width(600).height(600).url()
                  : null;

                return (
                  <CategoryTile
                    key={category._id || category.slug}
                    slug={category.slug}
                    title={category.title}
                    imageUrl={categoryImgUrl}
                    altText={
                      category.image?.alt ||
                      `Hadi Collection ${category.title} for women`
                    }
                    hoverImageUrl={category.hoverImage || null}
                    hoverImageObjectPosition={
                      category.hoverImageObjectPosition || "center"
                    }
                  />
                );
              })}
          </div>
        </Container>
      </section>

      <section className="border-t border-[#E8E8E8] bg-white pt-20 pb-10 sm:py-28">
        <Container>
          <div className="mb-10 sm:mb-14">
            <p className="mb-2 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-[#A6843D]">
              In the studio
            </p>
            <h2 className="font-display text-4xl font-medium text-[#2C2118] sm:text-5xl">
              Suits to stitch
            </h2>
          </div>

          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
                {featuredProducts.slice(0, 12).map((product) => (
                  <ProductCard
                    key={product._id || product.slug}
                    product={product}
                  />
                ))}
              </div>

              <div className="mt-7 flex justify-center sm:mt-10">
                <Link
                  href="/shop"
                  aria-label="View all Hadi Collection suits"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#2C2118] px-7 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-[#A6843D] sm:min-h-[48px] sm:px-9 sm:text-[13px]"
                >
                  <span>View all suits</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[1.5]" />
                </Link>
              </div>
            </>
          ) : (
            <div className="border border-[#E8E8E8] p-12 text-center">
              <p className="font-sans text-base font-semibold uppercase tracking-[0.08em] text-black">
                Products Coming Soon
              </p>
              <p className="mt-1 font-sans text-[13px] text-[#6B6B6B]">
                New arrivals are being added to our collection.
              </p>
            </div>
          )}
        </Container>
      </section>

      <ShopByOccasion />
      <HowToOrder />

      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] bg-[#2C2118] text-white lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image
              src="/images/hadi/zarah-botanical.jpg"
              alt="Zarah Botanical teal and gold unstitched suit"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-16">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A6843D]">
              The house
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-[#FFFBF5] sm:text-5xl">
              Suits for the day, and the celebration after it.
            </h2>
            <p className="mt-5 max-w-md font-sans text-[15px] leading-relaxed text-[#E7D7C3]">
              Hadi Collection is a ladies clothing house. Lawn prints for
              ordinary days. Embroidery and gold borders for Eid, mehndi and
              wedding week. Everything is unstitched, so the cut belongs to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full bg-[#A6843D] px-6 py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#2C2118]"
              >
                Read the story
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3.5 font-sans text-[12px] uppercase tracking-[0.16em] hover:bg-white hover:text-[#2C2118]"
              >
                Shop suits
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomepageFaq />
      <HomepageSeoText />

      <section className="bg-white px-4 pb-16 pt-4 sm:px-6 sm:pb-24">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-[#E8E8E8] bg-white shadow-[0_18px_50px_rgba(28,22,18,0.06)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[280px] sm:min-h-[360px]">
            <Image
              src="/images/hadi/gul-embroidered.jpg"
              alt="Gul Embroidered plum floral suit"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-14">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-[#A6843D]">
              Order from Pakistan
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-[#2C2118] sm:text-5xl">
              Ask, then we send the suit.
            </h2>
            <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-[#5C4A3A]">
              Message the studio on WhatsApp for a print, a colour, or a full
              order. Cash on delivery, packed in Lahore.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with Hadi Collection on WhatsApp at ${CONTACT.phoneDisplay}`}
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#1EBE57]"
              >
                <WhatsAppGlyph className="h-5 w-5" />
                <span>WhatsApp {CONTACT.phoneDisplay}</span>
              </a>
              <Link
                href="/shop"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#2C2118] px-6 py-3 font-sans text-[13px] font-medium text-[#2C2118] transition-colors hover:bg-[#2C2118] hover:text-white"
              >
                Browse the edit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
