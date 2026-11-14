import type { Metadata } from "next";

// =============================================================================
// FAQ route metadata — exported from layout so the "use client" page.tsx
// can still export the FAQPage JSON-LD via a script tag.
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers on delivery, cash on delivery, exchanges and unstitched suits from Hadi Collection.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Hadi Collection",
    description:
      "Answers on delivery, cash on delivery, exchanges and unstitched suits from Hadi Collection.",
    url: `${SITE_URL}/faq`,
    type: "website",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
