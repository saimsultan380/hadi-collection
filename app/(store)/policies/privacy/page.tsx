import type { Metadata } from "next";
import Link from "next/link";
import { Database, Eye, Lock, UserCheck, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { WHATSAPP_DISPLAY_INTERNATIONAL } from "@/lib/whatsapp";
import { CONTACT } from "@/content/home";

// =============================================================================
// SAZAIRA — PRIVACY POLICY (/policies/privacy)
// Flat editorial design. No gradients. No glassmorphism.
//
// ⚠️  LEGAL DISCLAIMER (for developer / store owner):
// This is a template Privacy Policy written to reflect the actual data handling
// practices implemented in this project (Supabase storage, WhatsApp comms,
// no third-party ad tracking). It is NOT a substitute for professional legal
// advice. Before launching and handling real customer data and payments at
// scale, this document should be reviewed against Pakistan's Personal Data
// Protection Bill and any applicable e-commerce regulations.
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";
const LAST_UPDATED = "September 2025";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Hadi Collection's Privacy Policy explains what customer data we collect, how it's used for order processing and delivery, and how we keep it secure.",
  alternates: {
    canonical: "/policies/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Hadi Collection",
    description:
      "Hadi Collection's Privacy Policy explains what customer data we collect, how it's used for order processing and delivery, and how we keep it secure.",
    url: `${SITE_URL}/policies/privacy`,
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

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-16 md:py-24">
      <Container size="narrow">
        {/* Editorial Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
            Your Data &amp; Trust
          </p>
          <h1 className="mb-4 text-3xl font-semibold uppercase tracking-[0.02em] text-black md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-[1.6] text-[#6B6B6B]">
            We respect your privacy. This policy explains exactly what
            information we collect, why we collect it, and how we protect it.
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
                Hadi Collection (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
                operates the website{" "}
                <a href={SITE_URL} className="text-black underline hover:text-[#6B6B6B]">
                  hadicollection.pk
                </a>{" "}
                and is committed to protecting the personal information you
                share with us when placing an order or contacting our team.
              </p>
              <p>
                By using our website and placing an order, you agree to the
                collection and use of information in accordance with this
                policy.
              </p>
            </div>
          </section>

          {/* What we collect */}
          <PolicySection icon={Database} title="Information We Collect">
            <p>
              We collect only the information necessary to process your order
              and provide customer support. This includes:
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                { label: "Full name", note: "to address your order" },
                {
                  label: "Phone number (mobile)",
                  note: "for order confirmation and delivery coordination via WhatsApp",
                },
                {
                  label: "Delivery address",
                  note: "including city and street address, for courier dispatch",
                },
                {
                  label: "Email address",
                  note: "(optional) if provided during checkout or contact form submission",
                },
                {
                  label: "Order details",
                  note: "items purchased, quantities, colour variants, order total",
                },
                {
                  label: "Payment method selection",
                  note: "Cash on Delivery or Bank Transfer — we do not store card or bank account numbers",
                },
              ].map(({ label, note }) => (
                <li key={label} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" />
                  <span>
                    <strong className="text-black">{label}</strong> — {note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We do not collect payment card numbers, bank account details, or
              EasyPaisa PINs. Any bank transfer details shared with us via
              WhatsApp are used solely to confirm payment receipt.
            </p>
          </PolicySection>

          {/* How we use it */}
          <PolicySection icon={Eye} title="How We Use Your Information">
            <p>Your information is used exclusively for:</p>
            <ul className="mt-3 list-decimal space-y-2 pl-5">
              <li>
                <strong className="text-black">Order fulfilment</strong> —
                processing your order, arranging courier dispatch, and tracking
                delivery.
              </li>
              <li>
                <strong className="text-black">
                  Customer communication
                </strong>{" "}
                — sending you order confirmation, dispatch notifications, and
                tracking updates via WhatsApp or email.
              </li>
              <li>
                <strong className="text-black">Customer support</strong> —
                responding to your queries, return requests, or complaints.
              </li>
              <li>
                <strong className="text-black">Fraud prevention</strong> —
                identifying and blocking suspicious or fraudulent order
                patterns.
              </li>
            </ul>
            <p className="mt-3">
              We will not use your personal information for marketing
              communications without your explicit consent.
            </p>
          </PolicySection>

          {/* Data storage */}
          <PolicySection icon={Lock} title="Data Storage &amp; Security">
            <p>
              Your order data is stored securely in{" "}
              <strong className="text-black">Supabase</strong>, a SOC
              2-compliant database platform with row-level security, end-to-end
              encryption in transit (TLS), and encrypted storage at rest. Access
              to your data is restricted to authorized Hadi Collection team members
              only.
            </p>
            <p>
              We retain order records for a minimum of 12 months for operational
              and accounting purposes. You may request deletion of your personal
              data at any time by contacting us.
            </p>
            <p className="mt-3 border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3 text-xs text-[#6B6B6B]">
              <strong className="text-black">
                WhatsApp communications:
              </strong>{" "}
              Customer support conversations on WhatsApp are subject to
              Meta&apos;s WhatsApp Business Privacy Policy in addition to this
              policy.
            </p>
          </PolicySection>

          {/* Third parties */}
          <PolicySection icon={UserCheck} title="Third-Party Sharing">
            <p>
              We{" "}
              <strong className="text-black">
                do not sell, rent, or share
              </strong>{" "}
              your personal information with third parties for advertising or
              marketing purposes.
            </p>
            <p>
              We share limited information only with service providers essential
              to fulfilling your order:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" />
                <span>
                  <strong className="text-black">Courier companies</strong>{" "}
                  (e.g. TCS, Leopards, Call Courier) — receive your name,
                  address, and phone number for delivery.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" />
                <span>
                  <strong className="text-black">Supabase</strong> — secure
                  database provider for order storage.
                </span>
              </li>
            </ul>
          </PolicySection>

          {/* Your rights */}
          <PolicySection icon={UserCheck} title="Your Rights">
            <p>You have the right to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of any future marketing communications</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us using the details
              below.
            </p>
          </PolicySection>

          {/* Contact */}
          <PolicySection icon={Mail} title="Privacy Contact">
            <p>
              For any privacy-related queries or data requests, contact us at:
            </p>
            <ul className="mt-3 space-y-1">
              <li>
                <strong className="text-black">Email:</strong>{" "}
                <a
                  href={CONTACT.emailHref}
                  className="text-black underline hover:text-[#6B6B6B]"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <strong className="text-black">WhatsApp:</strong>{" "}
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline hover:text-[#6B6B6B]"
                >
                  {WHATSAPP_DISPLAY_INTERNATIONAL}
                </a>
              </li>
              <li>
                <strong className="text-black">Location:</strong> Gulberg
                III, Lahore, Punjab, Pakistan
              </li>
            </ul>
          </PolicySection>

          {/* Legal disclaimer footer inside card */}
          <div className="mt-2 border-t border-[#E5E5E5] py-8">
            <p className="text-xs leading-[1.6] text-[#6B6B6B]">
              <strong className="text-black">Legal Notice:</strong> This
              Privacy Policy is a starting template prepared to reflect the data
              handling practices of this project. It is not certified legal
              text. Before handling real customer data and payments at scale,
              this policy should be reviewed by a qualified legal professional
              against applicable Pakistani law, including the Personal Data
              Protection Bill.
            </p>
          </div>
        </div>

        {/* Related links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium text-[#6B6B6B]">
          <Link
            href="/policies/terms"
            className="text-black hover:underline"
          >
            Terms &amp; Conditions →
          </Link>
          <Link
            href="/policies/shipping"
            className="text-black hover:underline"
          >
            Shipping Policy →
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
