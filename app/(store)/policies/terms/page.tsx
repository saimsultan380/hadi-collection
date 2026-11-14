import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShoppingCart,
  Banknote,
  AlertTriangle,
  ImageIcon,
  Scale,
} from "lucide-react";
import { Container } from "@/components/ui/container";

// =============================================================================
// SAZAIRA — TERMS & CONDITIONS (/policies/terms)
// Flat editorial design. No gradients. No glassmorphism.
//
// ⚠️  LEGAL DISCLAIMER (for developer / store owner):
// This is a template Terms & Conditions document written based on standard
// Pakistani e-commerce practices. It is NOT a substitute for professional legal
// advice. Before handling real customer orders and payments at scale, this
// document should be reviewed and finalized by a qualified legal professional
// against Pakistani commercial law and applicable consumer protection
// regulations.
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";
const LAST_UPDATED = "September 2025";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read Hadi Collection's Terms & Conditions governing the use of our website, order placement, pricing in PKR, and customer rights in Pakistan.",
  alternates: {
    canonical: "/policies/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Hadi Collection",
    description:
      "Read Hadi Collection's Terms & Conditions governing the use of our website, order placement, pricing in PKR, and customer rights in Pakistan.",
    url: `${SITE_URL}/policies/terms`,
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

export default function TermsPage() {
  return (
    <div className="bg-white py-16 md:py-24">
      <Container size="narrow">
        {/* Editorial Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
            Website Usage
          </p>
          <h1 className="mb-4 text-3xl font-semibold uppercase tracking-[0.02em] text-black md:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-[1.6] text-[#6B6B6B]">
            By accessing and using hadicollection.pk and placing orders with us, you
            agree to the following terms. Please read them carefully.
          </p>
          <p className="mt-4 text-xs text-[#6B6B6B]">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="border border-[#E5E5E5] bg-white px-8 py-2 md:px-14">
          {/* Introduction */}
          <section className="py-10">
            <div className="space-y-3 text-sm leading-[1.6] text-[#6B6B6B]">
              <p>
                These Terms &amp; Conditions govern your use of{" "}
                <a href={SITE_URL} className="text-black underline hover:text-[#6B6B6B]">
                  hadicollection.pk
                </a>{" "}
                (the &quot;Website&quot;) operated by Hadi Collection (&quot;we,&quot;
                &quot;our,&quot; or &quot;us&quot;), based in Lahore, Pakistan.
                By placing an order or using this Website, you accept these
                terms in full.
              </p>
            </div>
          </section>

          {/* Order Acceptance */}
          <PolicySection icon={ShoppingCart} title="Order Acceptance">
            <p>
              Placing an order on Hadi Collection constitutes an offer to purchase the
              selected product(s) at the listed price. An order is{" "}
              <strong className="text-black">not confirmed</strong> until you
              receive a confirmation message from our team via WhatsApp.
            </p>
            <p>
              We reserve the right to decline or cancel an order at any time
              prior to dispatch for any reason, including but not limited to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Product being out of stock after order placement</li>
              <li>
                Inability to contact the customer for order confirmation within
                48 hours
              </li>
              <li>Suspected fraudulent or suspicious order activity</li>
              <li>Errors in pricing or product information on the Website</li>
            </ul>
            <p>
              If your order is cancelled, you will be notified via WhatsApp and
              any payment made will be fully refunded.
            </p>
          </PolicySection>

          {/* Pricing */}
          <PolicySection icon={Banknote} title="Pricing &amp; Currency">
            <p>
              All prices displayed on hadicollection.pk are in{" "}
              <strong className="text-black">Pakistani Rupees (PKR)</strong>{" "}
              and are inclusive of applicable taxes unless stated otherwise.
            </p>
            <p>
              Prices are subject to change without prior notice. The price
              applicable to your order is the price displayed at the time of
              checkout confirmation.
            </p>
            <p>
              A flat delivery fee of{" "}
              <strong className="text-black">PKR 200</strong> applies to all
              orders and is clearly displayed at checkout before payment.
            </p>
          </PolicySection>

          {/* Payment */}
          <PolicySection icon={FileText} title="Payment Methods">
            <p>We currently accept the following payment methods:</p>
            <ul className="mt-3 space-y-2">
              {[
                {
                  method: "Cash on Delivery (COD)",
                  detail:
                    "Pay in cash when your order is delivered to your doorstep. Available across Pakistan.",
                },
                {
                  method: "Bank Transfer",
                  detail:
                    "Direct bank transfer to our Meezan Bank account. Order is dispatched after payment verification.",
                },
                {
                  method: "EasyPaisa / JazzCash",
                  detail:
                    "Mobile wallet transfers accepted. Send to our registered number and share screenshot for confirmation.",
                },
              ].map(({ method, detail }) => (
                <li key={method} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" />
                  <span>
                    <strong className="text-black">{method}</strong> —{" "}
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </PolicySection>

          {/* Fraud & Cancellation */}
          <PolicySection
            icon={AlertTriangle}
            title="Fraudulent Orders &amp; Cancellations"
          >
            <p>
              Hadi Collection reserves the right to{" "}
              <strong className="text-black">cancel any order</strong> that
              we reasonably believe to be fraudulent, including orders with:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Repeated non-delivery or return abuse history</li>
              <li>
                False or unverifiable delivery address or contact information
              </li>
              <li>Multiple high-value COD orders from the same contact</li>
              <li>
                Orders placed with intent to manipulate stock or pricing systems
              </li>
            </ul>
            <p>
              Customers with a pattern of refusing COD deliveries without valid
              reason may have future COD access restricted and be required to
              pay in advance.
            </p>
          </PolicySection>

          {/* Intellectual Property */}
          <PolicySection icon={ImageIcon} title="Intellectual Property">
            <p>
              All content on hadicollection.pk — including but not limited to product
              photographs, brand logos, design artwork, website copy, and
              descriptive text — is the{" "}
              <strong className="text-black">
                exclusive intellectual property of Hadi Collection
              </strong>
              .
            </p>
            <p>
              Reproduction, redistribution, copying, or commercial use of any
              content from this Website without explicit written permission from
              Hadi Collection is strictly prohibited.
            </p>
          </PolicySection>

          {/* Governing Law */}
          <PolicySection icon={Scale} title="Governing Law">
            <p>
              These Terms &amp; Conditions are governed by and construed in
              accordance with the laws of the{" "}
              <strong className="text-black">
                Islamic Republic of Pakistan
              </strong>
              . Any disputes arising from these terms or your use of the Website
              shall be subject to the exclusive jurisdiction of the courts of
              Lahore, Punjab, Pakistan.
            </p>
          </PolicySection>

          {/* Changes to Terms */}
          <section className="border-t border-[#E5E5E5] py-10">
            <h2 className="mb-4 text-base font-semibold uppercase tracking-[0.08em] text-black">
              Changes to These Terms
            </h2>
            <p className="text-sm leading-[1.6] text-[#6B6B6B]">
              We reserve the right to update these Terms &amp; Conditions at any
              time. Changes will be posted on this page with an updated
              &quot;Last updated&quot; date. Continued use of the Website after
              changes constitutes acceptance of the revised terms.
            </p>
          </section>

          {/* Legal disclaimer footer inside card */}
          <div className="mt-2 border-t border-[#E5E5E5] py-8">
            <p className="text-xs leading-[1.6] text-[#6B6B6B]">
              <strong className="text-black">Legal Notice:</strong> These
              Terms &amp; Conditions are a template prepared based on standard
              Pakistani e-commerce practices. They are not certified legal text.
              Before handling real customer orders and payments at scale, this
              document should be reviewed and finalized by a qualified legal
              professional.
            </p>
          </div>
        </div>

        {/* Related links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium text-[#6B6B6B]">
          <Link
            href="/policies/privacy"
            className="text-black hover:underline"
          >
            Privacy Policy →
          </Link>
          <Link
            href="/policies/returns"
            className="text-black hover:underline"
          >
            Returns Policy →
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
