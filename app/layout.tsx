import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "@/styles/globals.css";
import { CONTACT, getSocialSameAs } from "@/content/home";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// =============================================================================
// GLOBAL ROOT SEO METADATA
// =============================================================================

// Production base URL (Update this environment variable when deploying with custom domain)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hadicollection.pk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Hadi Collection",
    default:
      "Hadi Collection | Ladies Unstitched Suits, Lawn & Festive 3-Piece",
  },
  description:
    "Hadi Collection makes ladies unstitched suits in Pakistan. Shop lawn prints, embroidered florals and festive gold-border 2-piece and 3-piece sets, with cash on delivery.",
  keywords: [
    "unstitched suits Pakistan",
    "lawn suits online Pakistan",
    "3 piece suit Lahore",
    "festive suits Pakistan",
    "embroidered lawn Pakistan",
    "Hadi Collection",
    "ladies unstitched 2 piece",
    "Eid suits Pakistan",
  ],
  authors: [{ name: "Hadi Collection", url: SITE_URL }],
  creator: "Hadi Collection",
  publisher: "Hadi Collection",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Hadi Collection | Ladies Unstitched Suits in Pakistan",
    description:
      "Lawn, embroidered and festive unstitched suits. 2-piece and 3-piece, with cash on delivery across Pakistan.",
    url: SITE_URL,
    siteName: "Hadi Collection",
    locale: "en_PK",
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
      "Ladies unstitched lawn and festive suits, delivered across Pakistan with cash on delivery.",
    images: ["/hadi-og.png"],
  },
  icons: {
    icon: [
      { url: "/hadi-favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/hadi-favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    // Placeholder for Google Search Console verification token.
    // Replace with your site verification code in .env.local: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "google-site-verification-placeholder-token",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// =============================================================================
// STRUCTURED DATA (JSON-LD): Organization & LocalBusiness / Store Schema
// This is the ONLY Organization schema on the site — the homepage does not
// emit its own copy. Kept in sync with the visible footer / contact details.
// =============================================================================
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Hadi Collection",
  url: SITE_URL,
  telephone: CONTACT.telephone,
  email: CONTACT.email,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/hadi-logo.png`,
    caption: "Hadi Collection — Elegance in Every Thread",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: CONTACT.telephone,
    email: CONTACT.email,
    areaServed: "PK",
    availableLanguage: ["English", "Urdu"],
  },
  sameAs: getSocialSameAs(),
};

/**
 * Store / LocalBusiness schema:
 * Even for an online-first brand in Pakistan, declaring a Store schema with Pakistan
 * geographic coordinates and PKR priceRange helps Google establish clear local relevance
 * for queries originating within Pakistan ("handbags online in Lahore", "best purses in Pakistan").
 */
const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${SITE_URL}/#store`,
  name: "Hadi Collection",
  url: SITE_URL,
  image: `${SITE_URL}/hadi-og.png`,
  description:
    "Ladies unstitched suits — lawn prints, embroidered florals and festive 3-piece sets — from Lahore, Pakistan.",
  priceRange: "PKR 2,000 - PKR 15,000",
  currenciesAccepted: "PKR",
  paymentAccepted: "Cash on Delivery, Bank Transfer, EasyPaisa",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  areaServed: {
    "@type": "Country",
    name: "Pakistan",
  },
  parentOrganization: {
    "@id": `${SITE_URL}/#organization`,
  },
};

/**
 * RootLayout wraps every page in the app.
 * Both font CSS variables are injected here on the <html> element,
 * making them available globally via Tailwind's font-display and font-sans utilities.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable}`}>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {/* LocalBusiness / Store Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(storeJsonLd),
          }}
        />
      </head>
      <body className="text-[#2C2118] flex min-h-screen flex-col bg-white font-sans antialiased selection:bg-[#A6843D] selection:text-white">
        {children}
      </body>
    </html>
  );
}
