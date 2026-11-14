import type { Metadata } from "next";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { getGeneralWhatsAppLink } from "@/lib/whatsapp";

// =============================================================================
// SAZAIRA — RETURNS & EXCHANGE POLICY (/policies/returns)
// Flat editorial design. No gradients. No glassmorphism.
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export const metadata: Metadata = {
  title: "Returns & Exchange Policy",
  description:
    "Hadi Collection offers a 7-day exchange on unused, uncut fabric. Start a return on WhatsApp.",
  alternates: {
    canonical: "/policies/returns",
  },
  openGraph: {
    title: "Returns & Exchange Policy | Hadi Collection",
    description:
      "Hadi Collection offers a 7-day exchange on unused, uncut fabric. Start a return on WhatsApp.",
    url: `${SITE_URL}/policies/returns`,
    type: "website",
  },
};

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

export default function ReturnsPage() {
  const whatsappUrl = getGeneralWhatsAppLink(
    "Salam Hadi Collection! I would like to initiate a return/exchange for my order."
  );

  return (
    <div className="bg-white py-16 md:py-24">
      <Container size="narrow">
        {/* Editorial Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
            Customer Assurance
          </p>
          <h1 className="mb-4 text-3xl font-semibold uppercase tracking-[0.02em] text-black md:text-4xl">
            Returns &amp; Exchanges
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-[1.6] text-[#6B6B6B]">
            Your satisfaction matters. If something isn&apos;t right with your
            order, we make it easy to return or exchange — via WhatsApp, no
            complicated forms required.
          </p>
        </div>

        <div className="border border-[#E5E5E5] bg-white px-8 py-2 md:px-14">
          {/* Return Window */}
          <PolicySection icon={RotateCcw} title="Return &amp; Exchange Window">
            <p>
              You may request a return or exchange within{" "}
              <strong className="text-black">7 days of delivery</strong> of
              your order. Requests submitted after this window unfortunately
              cannot be accommodated.
            </p>
            <p>
              The 7-day period begins from the date your order is marked as
              delivered by the courier, or from the date you physically receive
              it — whichever is earlier.
            </p>
          </PolicySection>

          {/* Eligibility Conditions */}
          <PolicySection
            icon={CheckCircle2}
            title="Return Eligibility Conditions"
          >
            <p>
              To be eligible for a return or exchange, your item must meet all
              of the following conditions:
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                "Item is unused, uncarried, and in its original condition",
                "The fabric is unused, uncut, and still in its original packing",
                "No visible signs of use, wear, staining, or damage caused after delivery",
                "Item is returned in its original Hadi Collection branded packaging",
                "Proof of purchase (order number via WhatsApp) is provided",
              ].map((condition) => (
                <li key={condition} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 stroke-[1.5] text-black" />
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </PolicySection>

          {/* How to Initiate */}
          <PolicySection icon={MessageCircle} title="How to Initiate a Return">
            <p>
              We handle all returns and exchanges through WhatsApp to keep the
              process simple and fast:
            </p>
            <ol className="mt-3 list-decimal space-y-2.5 pl-5">
              <li>
                Message us on{" "}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline hover:text-[#6B6B6B]"
                >
                  WhatsApp
                </a>{" "}
                with your order number and a brief reason for the return.
              </li>
              <li>
                Attach clear photographs of the item showing its current
                condition (all sides, tags, packaging).
              </li>
              <li>
                Our team will review and respond within 1 business day to
                confirm eligibility and provide the return address.
              </li>
              <li>
                Ship the item back at your own cost. We recommend using a
                tracked courier service.
              </li>
              <li>
                Once we receive and inspect the returned item, we will process
                your exchange or refund within 3–5 business days.
              </li>
            </ol>
          </PolicySection>

          {/* Refund Method */}
          <PolicySection
            icon={CreditCard}
            title="Refund Method &amp; Timeframe"
          >
            <p>
              Refunds are processed via{" "}
              <strong className="text-black">
                bank transfer or EasyPaisa
              </strong>{" "}
              to the account details you provide us on WhatsApp.
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <strong className="text-black">COD orders:</strong> Refunded
                to your bank account or EasyPaisa within 5–7 business days of
                return receipt.
              </li>
              <li>
                <strong className="text-black">Bank Transfer orders:</strong>{" "}
                Refunded to the original payment account within 5–7 business
                days of return receipt.
              </li>
            </ul>
            <p className="mt-3">
              The original shipping fee of PKR 200 is{" "}
              <strong className="text-black">non-refundable</strong> unless
              the return is due to a manufacturing defect or an error on our
              part.
            </p>
          </PolicySection>

          {/* Non-returnable exceptions */}
          <PolicySection icon={XCircle} title="Non-Returnable Items">
            <p>
              The following items are{" "}
              <strong className="text-black">not eligible</strong> for return
              or exchange:
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                "Items purchased during clearance sales or at a discounted price (unless defective)",
                "Items that show signs of use, wear, or damage after delivery",
                "Items returned after the 7-day window",
                "Custom or personalized orders (if applicable)",
                "Items where tags have been removed",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 stroke-[1.5] text-[#6B6B6B]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3 text-xs text-[#6B6B6B]">
              <strong className="text-black">Manufacturing defects:</strong>{" "}
              If your item arrives with a manufacturing defect or was damaged
              during transit, please photograph it immediately and contact us on
              WhatsApp within 48 hours of delivery. We will arrange a full
              replacement or refund at no additional cost to you.
            </p>
          </PolicySection>

          {/* Footer CTA */}
          <div className="border-t border-[#E5E5E5] py-10 text-center">
            <p className="mb-4 text-xs text-[#6B6B6B]">
              Ready to initiate a return or exchange?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#25D366] bg-[#25D366] px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1ebe5e]"
            >
              <MessageCircle className="h-4 w-4" />
              Start on WhatsApp
            </a>
          </div>
        </div>

        {/* Related links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium text-[#6B6B6B]">
          <Link
            href="/policies/shipping"
            className="text-black hover:underline"
          >
            Shipping Policy →
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
