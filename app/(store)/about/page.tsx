import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, HeartHandshake, MapPin } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Hadi Collection is a ladies clothing house for unstitched lawn, embroidered and festive suits in Pakistan.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our Story | Hadi Collection",
    description:
      "Elegance in every thread. Unstitched 2-piece and 3-piece suits from Lahore.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white py-16 text-[#2C2118] md:py-24">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A6843D]">
            The house
          </p>
          <h1 className="mb-4 font-display text-5xl font-medium md:text-6xl">
            Elegance in every thread
          </h1>
          <p className="font-sans text-[15px] leading-relaxed text-[#5C4A3A]">
            Hadi Collection designs ladies unstitched suits for Pakistan — lawn for the day,
            embroidery and gold borders for the celebrations.
          </p>
        </div>

        <div className="mb-20 grid grid-cols-1 items-center gap-10 md:mb-28 lg:grid-cols-12">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F5] lg:col-span-5">
            <Image
              src="/images/hadi/gul-embroidered.jpg"
              alt="Embroidered plum floral suit from Hadi Collection"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6 lg:col-span-7">
            <h2 className="font-display text-4xl font-medium md:text-5xl">
              Cloth first. The cut is yours.
            </h2>
            <div className="space-y-4 font-sans text-[15px] leading-relaxed text-[#5C4A3A]">
              <p>
                The house started with a simple brief: print and embroidery that feel finished
                before a single stitch is sewn. Every suit leaves as fabric — a shirt length, a
                trouser, and a dupatta — so it can be cut for the person who will wear it.
              </p>
              <p>
                Lawn prints cover everyday dressing. Botanical and embroidered pieces sit between
                day and evening. The festive edit is for Eid, mehndi, barat and walima, with gold
                borders and deeper colours.
              </p>
              <p>
                Prices stay clear. Delivery runs nationwide. You pay the courier when the parcel
                arrives, and unused fabric can be exchanged within 7 days.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-20 border-y border-[#E8E8E8] py-16 md:mb-28">
          <div className="mb-12">
            <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A6843D]">
              What we stand on
            </p>
            <h2 className="font-display text-4xl font-medium">Three promises</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-[#FFFBF5] p-8">
              <Shield className="mb-4 h-6 w-6 stroke-[1.5] text-[#A6843D]" />
              <h3 className="mb-2 font-display text-2xl">Cloth you can stitch</h3>
              <p className="font-sans text-sm leading-relaxed text-[#5C4A3A]">
                Lawn and festive fabrics chosen to hold a print, a border and a tailor&apos;s seam
                without looking thin on the body.
              </p>
            </div>
            <div className="bg-[#FFFBF5] p-8">
              <Sparkles className="mb-4 h-6 w-6 stroke-[1.5] text-[#A6843D]" />
              <h3 className="mb-2 font-display text-2xl">A festive hand</h3>
              <p className="font-sans text-sm leading-relaxed text-[#5C4A3A]">
                Embroidery and gold borders for the days that ask for more than a plain lawn —
                without turning the suit into costume.
              </p>
            </div>
            <div className="bg-[#FFFBF5] p-8">
              <HeartHandshake className="mb-4 h-6 w-6 stroke-[1.5] text-[#A6843D]" />
              <h3 className="mb-2 font-display text-2xl">A simple order</h3>
              <p className="font-sans text-sm leading-relaxed text-[#5C4A3A]">
                Cash on delivery, a WhatsApp confirmation, and a 7-day window if the fabric is
                still unused and uncut.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 border border-[#E8E8E8] bg-[#F5F5F5] px-4 py-2">
            <MapPin className="h-4 w-4 stroke-[1.5]" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em]">
              Packed in Lahore, sent across Pakistan
            </span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-medium">See the current edit</h2>
          <p className="mb-8 font-sans text-sm leading-relaxed text-[#5C4A3A]">
            Six unstitched suits are in the shop now, from ice-blue floral lawn to navy and maroon
            festive borders.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Shop Suits
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Write to the Studio
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
