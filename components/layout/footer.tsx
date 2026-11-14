"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import Logo from "@/components/layout/Logo";
import { CONTACT, isSocialPlaceholder } from "@/content/home";
import { SOCIAL_ITEMS, WhatsAppIconBadge } from "@/components/ui/social-icons";
import { cn } from "@/lib/utils";

// =============================================================================
// SAZAIRA FOOTER — Minimal Fashion Retail (Aldo Inspired)
// #F7F7F7 background, 1px #E5E5E5 border, clean uppercase columns, newsletter.
// All contact + social data comes from the central config in content/home.ts.
// Flat editorial style: zero gradients, zero glassmorphism, zero heavy shadows.
// =============================================================================

/** Shared column heading style (Shop / Company / Policies / Customer Support). */
const COLUMN_HEADING =
  "font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-black mb-3 leading-[1.4] whitespace-nowrap";

/** Shared link style for all footer navigation columns: 14px, 400 weight, #6B6B6B, nowrap. */
const FOOTER_LINK =
  "flex items-center text-[14px] font-normal leading-[1.4] text-[#6B6B6B] hover:text-black hover:underline transition-colors whitespace-nowrap";

/** Shared tappable row style for Customer Support contact rows: 14px, 1.4 line-height, vertically centered. */
const SUPPORT_ROW =
  "group flex items-center gap-[10px] text-[14px] font-normal leading-[1.4] text-[#6B6B6B] hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black rounded-[4px]";

/** All Handbags + 8 active category links in one single vertical list (exact slugs from data/categories.ts). */
const SHOP_LINKS = [
  { label: "All Suits", href: "/shop" },
  { label: "Lawn Prints", href: "/category/lawn-prints" },
  { label: "Botanical", href: "/category/botanical" },
  { label: "Embroidered", href: "/category/embroidered" },
  { label: "Festive Edit", href: "/category/festive-edit" },
];

const COMPANY_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

const POLICY_LINKS = [
  { label: "Shipping & Delivery", href: "/policies/shipping" },
  { label: "Returns & Exchanges", href: "/policies/returns" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms & Conditions", href: "/policies/terms" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Real profiles only — any URL still containing "YOUR_" stays hidden.
  const socialItems = SOCIAL_ITEMS.filter(
    (item) => !isSocialPlaceholder(item.href)
  );

  return (
    <footer className="w-full bg-white border-t border-[#E8E8E8] text-[#2C2118]">
      <Container>
        {/* Footer Top Grid — 5 columns on desktop: 2.1fr Brand, 1fr Shop, 0.8fr Company, 1.15fr Policies, 1.6fr Support */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-16 lg:grid-cols-[2.1fr_1fr_0.8fr_1.15fr_1.6fr] lg:gap-x-6 xl:gap-x-8 items-start">
          {/* Brand + Follow Us + Newsletter (full width on mobile, 2.1fr on lg; order 1) */}
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1 lg:order-1 lg:pr-4">
            <Logo size="md" theme="light" />
            <p className="text-[#6B6B6B] font-sans text-[14px] font-normal leading-[1.4] max-w-sm">
              Ladies unstitched suits. Lawn, embroidery and festive edits, stitched to your own cut.
            </p>

            {/* Follow Us — visible official brand icon buttons */}
            {socialItems.length > 0 && (
              <div className="mt-1">
                <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black mb-3">
                  Follow Us
                </p>
                <ul className="flex flex-wrap items-center gap-3 list-none p-0 m-0">
                  {socialItems.map(
                    ({
                      id,
                      href,
                      ariaLabel,
                      Icon,
                      bgClass,
                      hoverClass,
                      focusRingClass,
                    }) => (
                      <li key={id}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={ariaLabel}
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-150 md:hover:-translate-y-0.5 hover:shadow-none",
                            bgClass,
                            hoverClass,
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F7]",
                            focusRingClass
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          </div>

          {/* Customer Support (stacked 2nd on mobile, 5th column on desktop via lg:order-5) */}
          <div className="col-span-2 lg:col-span-1 lg:order-5">
            <p className={COLUMN_HEADING}>Customer Support</p>

            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {/* WhatsApp — opens the shared wa.me deep link in a new tab */}
              <li>
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Chat with Hadi Collection on WhatsApp at ${CONTACT.phoneDisplay}`}
                  className={SUPPORT_ROW}
                >
                  <WhatsAppIconBadge className="h-8 w-8" />
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-semibold text-black text-[14px] leading-[1.4]">
                      WhatsApp:
                    </span>
                    <span className="font-normal text-[#6B6B6B] text-[14px] leading-[1.4] group-hover:text-black transition-colors">
                      {CONTACT.phoneDisplay}
                    </span>
                  </span>
                </a>
              </li>

              {/* Call */}
              <li>
                <a
                  href={CONTACT.telHref}
                  aria-label={`Call Hadi Collection at ${CONTACT.phoneDisplay}`}
                  className={SUPPORT_ROW}
                >
                  <Phone
                    className="h-[18px] w-[18px] shrink-0 stroke-[1.5] text-black"
                    aria-hidden="true"
                  />
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-semibold text-black text-[14px] leading-[1.4]">
                      Call:
                    </span>
                    <span className="font-normal text-[#6B6B6B] text-[14px] leading-[1.4] group-hover:text-black transition-colors">
                      {CONTACT.phoneDisplay}
                    </span>
                  </span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href={CONTACT.emailHref}
                  aria-label={`Email Hadi Collection at ${CONTACT.email}`}
                  className={SUPPORT_ROW}
                >
                  <Mail
                    className="h-[18px] w-[18px] shrink-0 stroke-[1.5] text-black"
                    aria-hidden="true"
                  />
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-black text-[14px] leading-[1.4] whitespace-nowrap">
                      Email:
                    </span>
                    <span className="font-normal text-[#6B6B6B] text-[14px] leading-[1.4] group-hover:text-black transition-colors break-all sm:break-normal whitespace-normal sm:whitespace-nowrap">
                      {CONTACT.email}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Shop Links (All Handbags + 8 Categories in ONE single vertical list) */}
          <div className="col-span-1 row-span-2 lg:row-span-1 lg:col-span-1 lg:order-2">
            <p className={COLUMN_HEADING}>Shop</p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1 lg:col-span-1 lg:order-3">
            <p className={COLUMN_HEADING}>Company</p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="col-span-1 lg:col-span-1 lg:order-4">
            <p className={COLUMN_HEADING}>Policies</p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom — Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#E5E5E5] pt-6 pb-20 sm:pb-8 pr-20 sm:pr-28 text-[12px] text-[#6B6B6B]">
          <p className="font-sans text-[14px] font-normal leading-[1.4] text-[#6B6B6B]">
            &copy; {currentYear} Hadi Collection. All rights reserved. Pakistan.
          </p>
          <div className="flex flex-wrap items-center gap-6 font-sans">
            <Link
              href="/policies/privacy"
              className="text-[14px] font-normal leading-[1.4] text-[#6B6B6B] hover:text-black hover:underline transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              href="/policies/terms"
              className="text-[14px] font-normal leading-[1.4] text-[#6B6B6B] hover:text-black hover:underline transition-colors whitespace-nowrap"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
