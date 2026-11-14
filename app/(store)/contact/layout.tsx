import type { Metadata } from "next";
import Script from "next/script";
import { CONTACT, CONTACT_DETAILS, getSocialSameAs } from "@/content/home";

// Contact page metadata — exported from layout since page.tsx is "use client"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Hadi Collection for help with orders, delivery, exchanges and product questions. Chat on WhatsApp, call or email our team in Lahore, Pakistan.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Hadi Collection",
    description:
      "Contact Hadi Collection for help with orders, delivery, exchanges and product questions. Chat on WhatsApp, call or email our team in Lahore, Pakistan.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

// ── ContactPage + Organization JSON-LD ───────────────────────────────────────
const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact#webpage`,
      url: `${SITE_URL}/contact`,
      name: "Contact Us | Hadi Collection",
      description:
        "Contact Hadi Collection for help with orders, delivery, exchanges and product questions. Chat on WhatsApp, call or email our team in Lahore, Pakistan.",
      isPartOf: { "@id": `${SITE_URL}#website` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "Hadi Collection",
      url: SITE_URL,
      telephone: CONTACT.telephone,
      email: CONTACT.email,
      ...(CONTACT_DETAILS.address
        ? {
            address: {
              "@type": "PostalAddress",
              addressLocality: "Lahore",
              addressRegion: "Punjab",
              addressCountry: "PK",
              streetAddress: CONTACT_DETAILS.address,
            },
          }
        : {}),
      ...(CONTACT_DETAILS.hours ? { openingHours: "Mo-Sa 10:00-19:00" } : {}),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: CONTACT.telephone,
        email: CONTACT.email,
        areaServed: "PK",
        availableLanguage: ["English", "Urdu"],
      },
      sameAs: getSocialSameAs(),
    },
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="contact-page-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      {children}
    </>
  );
}
