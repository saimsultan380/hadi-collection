"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { CONTACT, CONTACT_DETAILS, isSocialPlaceholder } from "@/content/home";
import { SOCIAL_ITEMS, WhatsAppGlyph } from "@/components/ui/social-icons";
import { cn } from "@/lib/utils";

// =============================================================================
// SAZAIRA — /contact PAGE (Redesigned)
// Two-column layout: Contact Info (left) + Message Form (right), plus Map.
// Flat, bold editorial style: solid palette colours, NO gradients, NO glassmorphism.
// All data from central config in content/home.ts.
// Form → WhatsApp submission (opens pre-filled message on separate lines).
// =============================================================================

// ── Subject options ───────────────────────────────────────────────────────────
const SUBJECT_OPTIONS = [
  "Order help",
  "Delivery question",
  "Exchange or return",
  "Product question",
  "Other",
] as const;

// ── Zod schema ────────────────────────────────────────────────────────────────
const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name (at least 2 characters)."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.enum(SUBJECT_OPTIONS, { message: "Please select a subject." }),
  message: z
    .string()
    .min(20, "Please write at least 20 characters so we can help you best."),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// ── Shared styles ─────────────────────────────────────────────────────────────
const CARD_CLS =
  "border border-[#E5E5E5] bg-white rounded-[8px] p-7 md:p-8 flex flex-col justify-between";

const LABEL_CLS =
  "mb-1.5 block font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black";

const inputCls = (hasError?: boolean) =>
  cn(
    "h-[48px] w-full rounded-[8px] border bg-white px-4 font-sans text-[16px] text-black placeholder:text-[#AAAAAA]",
    "focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors",
    hasError ? "border-[#A6843D] ring-1 ring-[#A6843D]" : "border-[#E5E5E5]"
  );

const selectCls = (hasError?: boolean) =>
  cn(
    "h-[48px] w-full rounded-[8px] border bg-white px-4 font-sans text-[16px] text-black",
    "focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors appearance-none",
    hasError ? "border-[#A6843D] ring-1 ring-[#A6843D]" : "border-[#E5E5E5]"
  );

// ── FieldError ────────────────────────────────────────────────────────────────
function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1.5 font-sans text-[12px] text-[#A6843D]"
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  );
}

// ── Inline SVG line icons (stroke: 1.5) ───────────────────────────────────────
function PhoneLineIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
    </svg>
  );
}

function MailLineIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  );
}

function MapPinLineIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockLineIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ── Map URL helpers ───────────────────────────────────────────────────────────
const mapQuery = CONTACT_DETAILS.MAP_QUERY;
const encodedMapQuery = encodeURIComponent(mapQuery || "");
const mapEmbedSrc = mapQuery
  ? `https://www.google.com/maps?q=${encodedMapQuery}&output=embed`
  : "";
const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodedMapQuery}`;
const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedMapQuery}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    // Pre-filled WhatsApp text formatted on separate lines
    const message = `Salam Hadi Collection! 📩 Customer enquiry

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}`;

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  // Real social links only
  const socialItems = SOCIAL_ITEMS.filter((s) => !isSocialPlaceholder(s.href));

  return (
    <div className="bg-[#F7F7F7] pb-28 sm:pb-16">
      {/* ================================================================ */}
      {/* 1. HEADER BAND                                                   */}
      {/* ================================================================ */}
      <section className="bg-white border-b border-[#E5E5E5] py-14 sm:py-20 text-center">
        <Container>
          <p className="mb-2 font-sans text-[12px] font-semibold uppercase tracking-[0.15em] text-[#6B6B6B]">
            Customer Support · Pakistan
          </p>
          <h1 className="mb-4 font-sans text-3xl sm:text-4xl font-semibold uppercase tracking-[0.02em] text-black">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-lg font-sans text-[15px] leading-[1.6] text-[#6B6B6B]">
            Questions about an order, a print, or an exchange? Message
            us and our team will help you.
          </p>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 2. QUICK CONTACT CARDS                                           */}
      {/* 3 equal cards in a row on desktop, stacked on mobile.            */}
      {/* 1px border, flat, hover lift on desktop only, min 44px tap area. */}
      {/* ================================================================ */}
      <section aria-label="Quick contact options" className="py-8 sm:py-10 bg-[#F7F7F7]">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* WhatsApp Card */}
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat on WhatsApp with Hadi Collection at ${CONTACT.phoneDisplay}`}
              className="group flex flex-col items-center justify-center gap-3 p-6 sm:p-7 rounded-[8px] border border-[#1FA855] bg-[#1FA855] text-white transition-all duration-150 md:hover:-translate-y-1 min-h-[110px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1FA855]"
            >
              <WhatsAppGlyph className="h-6 w-6" />
              <div className="text-center">
                <p className="font-sans text-[18px] sm:text-[20px] font-semibold leading-tight">
                  Chat on WhatsApp
                </p>
                <p className="mt-1 font-sans text-[14px] font-normal opacity-90">
                  {CONTACT.phoneDisplay}
                </p>
              </div>
            </a>

            {/* Call Us Card */}
            <a
              href={CONTACT.telHref}
              aria-label={`Call Hadi Collection at ${CONTACT.phoneDisplay}`}
              className="group flex flex-col items-center justify-center gap-3 p-6 sm:p-7 rounded-[8px] border border-black bg-black text-white transition-all duration-150 md:hover:-translate-y-1 min-h-[110px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
            >
              <PhoneLineIcon className="h-6 w-6" />
              <div className="text-center">
                <p className="font-sans text-[18px] sm:text-[20px] font-semibold leading-tight">
                  Call Us
                </p>
                <p className="mt-1 font-sans text-[14px] font-normal opacity-90">
                  {CONTACT.phoneDisplay}
                </p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={CONTACT.emailHref}
              aria-label={`Email Hadi Collection at ${CONTACT.email}`}
              className="group flex flex-col items-center justify-center gap-3 p-6 sm:p-7 rounded-[8px] border border-[#A6843D] bg-[#A6843D] text-white transition-all duration-150 md:hover:-translate-y-1 min-h-[110px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A6843D]"
            >
              <MailLineIcon className="h-6 w-6" />
              <div className="text-center">
                <p className="font-sans text-[18px] sm:text-[20px] font-semibold leading-tight">
                  Email
                </p>
                <p className="mt-1 font-sans text-[14px] font-normal opacity-90 break-all">
                  {CONTACT.email}
                </p>
              </div>
            </a>
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 3. TWO-COLUMN MAIN AREA                                          */}
      {/* Desktop ≥1024px: two equal columns, 32-40px gap, equal height.   */}
      {/* Mobile/tablet: single column with Info Card first, then Form.    */}
      {/* ================================================================ */}
      <section aria-label="Contact information and message form" className="py-6 sm:py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {/* ── LEFT: Contact Information ── */}
            <div className={CARD_CLS}>
              <div>
                <h2 className="mb-6 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-black">
                  Contact Information
                </h2>

                <ul className="flex flex-col gap-6 list-none p-0 m-0">
                  {/* Location (hidden if empty) */}
                  {CONTACT_DETAILS.address && (
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 text-[#6B6B6B]">
                        <MapPinLineIcon />
                      </span>
                      <div>
                        <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black mb-0.5">
                          Location
                        </p>
                        <p className="font-sans text-[14px] text-[#6B6B6B] leading-[1.5]">
                          {CONTACT_DETAILS.address}
                        </p>
                      </div>
                    </li>
                  )}

                  {/* Support Hours (hidden if empty) */}
                  {CONTACT_DETAILS.hours && (
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 text-[#6B6B6B]">
                        <ClockLineIcon />
                      </span>
                      <div>
                        <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black mb-0.5">
                          Support Hours
                        </p>
                        <p className="font-sans text-[14px] text-[#6B6B6B] leading-[1.5]">
                          {CONTACT_DETAILS.hours}
                        </p>
                      </div>
                    </li>
                  )}

                  {/* Email */}
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#6B6B6B]">
                      <MailLineIcon className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black mb-0.5">
                        Email
                      </p>
                      <a
                        href={CONTACT.emailHref}
                        className="font-sans text-[14px] text-[#6B6B6B] hover:text-black hover:underline transition-colors break-all"
                      >
                        {CONTACT.email}
                      </a>
                    </div>
                  </li>

                  {/* WhatsApp / Call (shows 0303 7321336 once) */}
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#6B6B6B]">
                      <PhoneLineIcon className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black mb-0.5">
                        WhatsApp / Call
                      </p>
                      <p className="font-sans text-[14px] text-[#6B6B6B] flex flex-wrap items-center gap-1.5">
                        <span className="font-medium text-black">{CONTACT.phoneDisplay}</span>
                        <span className="text-[#CCCCCC]">·</span>
                        <a
                          href={CONTACT.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-black hover:underline transition-colors"
                        >
                          WhatsApp
                        </a>
                        <span className="text-[#CCCCCC]">/</span>
                        <a
                          href={CONTACT.telHref}
                          className="hover:text-black hover:underline transition-colors"
                        >
                          Call
                        </a>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Follow Us (4 official brand logo buttons, 44px, no raw URLs) */}
              {socialItems.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                  <h3 className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-black">
                    Follow Us
                  </h3>
                  <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
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
                              "flex h-11 w-11 items-center justify-center rounded-[8px] text-white transition-all duration-150 md:hover:-translate-y-0.5",
                              bgClass,
                              hoverClass,
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
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

            {/* ── RIGHT: Send Us a Message ── */}
            <div className={CARD_CLS}>
              <div>
                <h2 className="mb-2 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-black">
                  Send Us a Message
                </h2>
                <p className="mb-6 font-sans text-[13px] text-[#6B6B6B]">
                  Fill in the form — on submit, your message opens in WhatsApp.
                </p>

                {submitted ? (
                  /* Success state */
                  <div className="flex flex-col items-center gap-4 border border-[#E5E5E5] bg-[#F7F7F7] rounded-[8px] px-6 py-10 text-center">
                    <CheckCircle2 className="h-9 w-9 stroke-[1.5] text-black" />
                    <p className="font-sans text-[15px] font-semibold text-black">
                      Your message has been opened in WhatsApp.
                    </p>
                    <p className="font-sans text-[13px] text-[#6B6B6B]">
                      Send it from WhatsApp to complete your enquiry.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-1 font-sans text-[13px] text-black underline hover:text-[#6B6B6B] transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate id="contact-form">
                    <div className="flex flex-col gap-5">
                      {/* Full Name */}
                      <div>
                        <label htmlFor="contact-name" className={LABEL_CLS}>
                          Full Name <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          placeholder="Fatima Ahmed"
                          autoComplete="name"
                          aria-required="true"
                          aria-describedby={errors.name ? "contact-name-error" : undefined}
                          {...register("name")}
                          className={inputCls(!!errors.name)}
                        />
                        <FieldError id="contact-name-error" message={errors.name?.message} />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label htmlFor="contact-email" className={LABEL_CLS}>
                          Email Address <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          placeholder="fatima@example.com"
                          autoComplete="email"
                          aria-required="true"
                          aria-describedby={errors.email ? "contact-email-error" : undefined}
                          {...register("email")}
                          className={inputCls(!!errors.email)}
                        />
                        <FieldError id="contact-email-error" message={errors.email?.message} />
                      </div>

                      {/* Subject dropdown */}
                      <div>
                        <label htmlFor="contact-subject" className={LABEL_CLS}>
                          Subject <span aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="contact-subject"
                            aria-required="true"
                            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                            {...register("subject")}
                            className={selectCls(!!errors.subject)}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Select a topic…
                            </option>
                            {SUBJECT_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {/* Custom chevron */}
                          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6B6B6B]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <FieldError id="contact-subject-error" message={errors.subject?.message} />
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="contact-message" className={LABEL_CLS}>
                          Message <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          rows={5}
                          placeholder="Describe your query so we can help you best…"
                          aria-required="true"
                          aria-describedby={errors.message ? "contact-message-error" : undefined}
                          {...register("message")}
                          className={cn(
                            "w-full rounded-[8px] border bg-white px-4 py-3 font-sans text-[16px] text-black placeholder:text-[#AAAAAA] resize-none",
                            "focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors",
                            errors.message ? "border-[#A6843D] ring-1 ring-[#A6843D]" : "border-[#E5E5E5]"
                          )}
                        />
                        <FieldError id="contact-message-error" message={errors.message?.message} />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex flex-col gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        id="contact-submit"
                        className="w-full"
                      >
                        <WhatsAppGlyph className="h-[18px] w-[18px] mr-2" />
                        Send via WhatsApp
                      </Button>
                      <p className="font-sans text-[12px] text-[#6B6B6B] text-center">
                        Opens WhatsApp with your message pre-filled.
                      </p>
                    </div>

                    {/* Privacy Note */}
                    <p className="mt-4 font-sans text-[12px] text-[#6B6B6B] text-center">
                      We only use your details to reply to your message.{" "}
                      <Link
                        href="/policies/privacy"
                        className="underline hover:text-black transition-colors"
                      >
                        See our Privacy Policy.
                      </Link>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 4. MAP (H2 "Find Us")                                             */}
      {/* Hidden if MAP_QUERY is empty.                                    */}
      {/* ================================================================ */}
      {mapEmbedSrc && (
        <section aria-labelledby="map-heading" className="py-6 sm:py-8">
          <Container>
            <h2
              id="map-heading"
              className="mb-4 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-black"
            >
              Find Us
            </h2>

            {/* Map iframe */}
            <div className="overflow-hidden rounded-[8px] border border-[#E5E5E5] h-[300px] sm:h-[420px]">
              <iframe
                src={mapEmbedSrc}
                title="Map showing Hadi Collection location in Lahore"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                aria-label="Google Maps embed showing Gulberg III, Lahore"
              />
            </div>

            {/* Map action buttons: black and outlined */}
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={mapOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-[8px] bg-black px-5 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#222222] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
              >
                Open in Google Maps
              </a>
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-[8px] border border-black bg-white px-5 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
              >
                Get Directions
              </a>
            </div>
          </Container>
        </section>
      )}

      {/* ================================================================ */}
      {/* 5. QUICK ANSWERS                                                 */}
      {/* 4 short Q&A cards in a 2x2 grid (1 col on mobile)                 */}
      {/* ================================================================ */}
      <section aria-labelledby="quick-answers-heading" className="py-8 sm:py-12">
        <Container>
          <h2
            id="quick-answers-heading"
            className="mb-6 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-black"
          >
            Quick Answers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Q1 */}
            <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-6">
              <p className="font-sans text-[13px] font-semibold text-black mb-2">
                How do I pay?
              </p>
              <p className="font-sans text-[14px] text-[#6B6B6B] leading-[1.5]">
                We accept Cash on Delivery nationwide across Pakistan — no
                advance payment required.
              </p>
            </div>

            {/* Q2 */}
            <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-6">
              <p className="font-sans text-[13px] font-semibold text-black mb-2">
                How long does delivery take?
              </p>
              <p className="font-sans text-[14px] text-[#6B6B6B] leading-[1.5]">
                Standard delivery is 2–4 working days to cities nationwide.
              </p>
            </div>

            {/* Q3 */}
            <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-6">
              <p className="font-sans text-[13px] font-semibold text-black mb-2">
                Can I exchange a suit?
              </p>
              <p className="font-sans text-[14px] text-[#6B6B6B] leading-[1.5]">
                Yes — we offer a 7-day easy exchange policy.{" "}
                <Link
                  href="/policies/returns"
                  className="text-black underline hover:text-[#A6843D] transition-colors"
                >
                  See Exchange Policy →
                </Link>
              </p>
            </div>

            {/* Q4 */}
            <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-6">
              <p className="font-sans text-[13px] font-semibold text-black mb-2">
                How do I place an order?
              </p>
              <p className="font-sans text-[14px] text-[#6B6B6B] leading-[1.5]">
                Browse the collection, add your favourites to the cart and
                checkout.{" "}
                <Link
                  href="/shop"
                  className="text-black underline hover:text-[#A6843D] transition-colors"
                >
                  Shop now →
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/faq"
              className="inline-flex items-center font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-black hover:text-[#A6843D] transition-colors"
            >
              View all FAQs →
            </Link>
          </div>
        </Container>
      </section>

      {/* ================================================================ */}
      {/* 6. CLOSING CTA BAND                                              */}
      {/* Terracotta background, white centered text, compact               */}
      {/* ================================================================ */}
      <section
        aria-label="Shop call to action"
        className="bg-[#A6843D] py-14 sm:py-16 text-center"
      >
        <Container>
          <h2 className="mb-4 font-sans text-2xl sm:text-3xl font-semibold uppercase tracking-[0.02em] text-white">
            Ready to choose a suit?
          </h2>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-[8px] bg-white px-8 font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#F5EFE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#A6843D]"
          >
            Shop all suits
          </Link>
        </Container>
      </section>
    </div>
  );
}
