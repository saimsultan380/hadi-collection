import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/products";
import { urlForImage } from "@/lib/image";

/**
 * =============================================================================
 * SAZAIRA CUSTOM 404 NOT FOUND PAGE
 * =============================================================================
 * Flat editorial 404 page that preserves brand aesthetics (ivory background,
 * espresso typography, terracotta accents, zero gradients/glassmorphism).
 *
 * Keeps visitors engaged rather than bouncing back to Google search results
 * by offering direct navigation to popular handbag categories.
 * =============================================================================
 */

export const metadata = {
  title: "Page Not Found (404)",
  description:
    "That page is not in the shop. Browse Hadi Collection lawn, embroidered and festive suits.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function NotFound() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <Container>
        {/* Main 404 Banner */}
        <div className="mx-auto max-w-3xl border border-[#E5E5E5] bg-white p-8 text-center md:p-14">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#E5E5E5] bg-[#F7F7F7]">
            <ShoppingBag className="h-7 w-7 stroke-[1.5] text-black" />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
            Error 404 · Page Not Found
          </p>

          <h1 className="mb-4 text-3xl font-semibold uppercase tracking-[0.02em] text-black md:text-4xl">
            Looking for a Piece?
          </h1>

          <p className="mx-auto max-w-lg text-sm leading-[1.6] text-[#6B6B6B] md:text-base">
            That page may have moved. Browse the current edit of unstitched suits.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/shop">
              <Button variant="primary" size="lg">
                <span>Browse all suits</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span>Return to Home</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Popular Categories Section */}
        {categories && categories.length > 0 && (
          <div className="mt-16 md:mt-20">
            <div className="mb-8 text-center">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                Discover By Silhouette
              </p>
              <h2 className="text-xl font-semibold uppercase tracking-[0.02em] text-black md:text-2xl">
                Explore Popular Categories
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {categories.slice(0, 5).map((category) => {
                const categoryImgUrl = category.image
                  ? urlForImage(category.image)?.width(400).height(400).url()
                  : null;

                return (
                  <Link
                    key={category._id || category.slug}
                    href={`/category/${encodeURIComponent(category.slug)}`}
                    className="group flex flex-col border border-[#E5E5E5] bg-white p-3 transition-colors duration-200 hover:border-black"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-[#F7F7F7]">
                      {categoryImgUrl ? (
                        <Image
                          src={categoryImgUrl}
                          alt={category.image?.alt || category.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                          <span className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
                            {category.title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-black transition-colors group-hover:underline sm:text-sm">
                        {category.title}
                      </h3>
                      <ArrowRight className="h-3.5 w-3.5 text-[#6B6B6B] transition-transform group-hover:translate-x-1 group-hover:text-black" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
