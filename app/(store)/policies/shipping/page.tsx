import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Clock, MapPin, MessageCircle, Package } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getGeneralWhatsAppLink } from "@/lib/whatsapp";
import { SOCIAL_LINKS } from "@/content/home";

// Instagram handle derived from the single source of truth (no hardcoding).
const INSTAGRAM_HANDLE = SOCIAL_LINKS.instagram
  .replace("https://www.instagram.com/", "@")
  .replace(/\/$/, "");

// =============================================================================
// SAZAIRA — SHIPPING & DELIVERY POLICY (/policies/shipping)
// Flat editorial design. No gradients. No glassmorphism.
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "Hadi Collection delivers nationwide across Pakistan with flat-rate shipping. Learn about delivery timeframes, charges, and how we keep you updated via WhatsApp.",
  alternates: {
    canonical: "/policies/shipping",
  },
  openGraph: {
    title: "Shipping & Delivery Policy | Hadi Collection",
    description:
      "Hadi Collection delivers nationwide across Pakistan with flat-rate shipping. Learn about delivery timeframes, charges, and how we keep you updated via WhatsApp.",
    url: `${SITE_URL}/policies/shipping`,
    type: "website",
  },
};

// ── Section divider ──────────────────────────────────────────────────────────
function PolicySection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[#E5E5E5] py-10">
      <div className="mb-5 flex items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 stroke-[1.5] text-black" />
        <h2 className="text-base font-semibold uppercase tracking-[0.08em] text-black">
          {title}
        </h2>
      </div>
      <div className="space-y-3 text-sm leading-[1.6] text-[#6B6B6B]">
        {children}
      </div>
    </section>
  );
}

export default function ShippingPolicyPage() {
  const whatsappUrl = getGeneralWhatsAppLink(
    "Salam Hadi Collection! I have a question about my delivery status."
  );

  return (
    <div className="bg-white py-16 md:py-24">
      <Container size="narrow">
        {/* Editorial Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
            Hadi Collection · Pakistan
          </p>
          <h1 className="mb-4 text-3xl font-semibold uppercase tracking-[0.02em] text-black md:text-4xl">
            Shipping &amp; Delivery
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-[1.6] text-[#6B6B6B]">
            We deliver to every corner of Pakistan — from Karachi to Gilgit —
            with a flat shipping fee and WhatsApp order tracking.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="border border-[#E5E5E5] bg-white px-8 py-2 md:px-14">
          {/* Delivery Areas */}
          <PolicySection icon={MapPin} title="Delivery Areas">
            <p>
              Hadi Collection ships{" "}
              <strong className="text-black">
                nationwide across Pakistan
              </strong>{" "}
              — all provinces, including Punjab, Sindh, Khyber Pakhtunkhwa,
              Balochistan, Azad Kashmir, and Gilgit-Baltistan.
            </p>
            <p>
              We currently do not offer international shipping. For inquiries
              about international orders, please{" "}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline hover:text-[#6B6B6B]"
              >
                contact us on WhatsApp
              </a>
              .
            </p>
          </PolicySection>

          {/* Delivery Timeframes */}
          <PolicySection icon={Clock} title="Delivery Timeframes">
            <p>
              Orders are typically dispatched within{" "}
              <strong className="text-black">1–2 business days</strong> of
              order confirmation. Delivery times thereafter:
            </p>
            <ul className="mt-3 space-y-3 border-l-2 border-[#E5E5E5] pl-5">
              <li>
                <span className="font-semibold text-black">
                  Major cities
                </span>{" "}
                (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan):{" "}
                <span className="font-semibold text-black">
                  3–5 business days
                </span>
              </li>
              <li>
                <span className="font-semibold text-black">
                  Other cities &amp; towns
                </span>
                :{" "}
                <span className="font-semibold text-black">
                  5–7 business days
                </span>
              </li>
              <li>
                <span className="font-semibold text-black">
                  Remote &amp; rural areas
                </span>
                : May take up to{" "}
                <span className="font-semibold text-black">
                  7–10 business days
                </span>
              </li>
            </ul>
            <p className="mt-4 border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3 text-xs text-[#6B6B6B]">
              <strong className="text-black">Note:</strong> Delivery
              estimates are indicative. Actual times may vary during peak
              seasons (Eid, sales events), public holidays, or due to courier
              network conditions. We will notify you of any significant delays
              via WhatsApp.
            </p>
          </PolicySection>

          {/* Delivery Charges */}
          <PolicySection icon={Truck} title="Delivery Charges">
            <p>
              Hadi Collection charges a flat delivery fee of{" "}
              <strong className="text-black">PKR 200</strong> on all orders,
              regardless of order size or delivery location within Pakistan.
            </p>
            <p>
              This fee is displayed transparently at checkout before you confirm
              your order — there are no hidden charges.
            </p>
            <p className="mt-2 border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3 text-xs text-[#6B6B6B]">
              We periodically offer free shipping promotions. Follow us on
              Instagram{" "}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline hover:text-[#6B6B6B]"
              >
                {INSTAGRAM_HANDLE}
              </a>{" "}
              to stay updated.
            </p>
          </PolicySection>

          {/* Order Packaging */}
          <PolicySection icon={Package} title="Packaging">
            <p>
              Every Hadi Collection order is carefully packed in branded packaging with
              tissue wrap and a seal so the fabric arrives clean
              condition. If you are gifting, please let us know via WhatsApp and
              we will add a complimentary gift note.
            </p>
          </PolicySection>

          {/* Order Tracking */}
          <PolicySection
            icon={MessageCircle}
            title="Order Tracking &amp; Updates"
          >
            <p>
              We use a WhatsApp-first communication approach for order updates.
              After placing your order:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                You will receive an order confirmation via WhatsApp with your
                order number.
              </li>
              <li>
                Once dispatched, we will share your courier tracking number and
                a direct tracking link.
              </li>
              <li>
                For any delivery queries, message us directly on{" "}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline hover:text-[#6B6B6B]"
                >
                  WhatsApp
                </a>{" "}
                with your order number.
              </li>
            </ol>
          </PolicySection>

          {/* Footer CTA */}
          <div className="border-t border-[#E5E5E5] py-10 text-center">
            <p className="mb-4 text-xs text-[#6B6B6B]">
              Questions about your delivery?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#25D366] bg-[#25D366] px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1ebe5e]"
            >
              <MessageCircle className="h-4 w-4" />
              Message Us on WhatsApp
            </a>
          </div>
        </div>

        {/* Related policies */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium text-[#6B6B6B]">
          <Link
            href="/policies/returns"
            className="text-black hover:underline"
          >
            Returns &amp; Exchanges →
          </Link>
          <Link
            href="/faq"
            className="text-black hover:underline"
          >
            FAQ →
          </Link>
          <Link
            href="/contact"
            className="text-black hover:underline"
          >
            Contact Us →
          </Link>
        </div>
      </Container>
    </div>
  );
}
