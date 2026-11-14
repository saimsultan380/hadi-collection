import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  HOW_TO_ORDER_STEPS,
  WHATSAPP_URL,
} from "@/content/home";

// =============================================================================
// SECTION 7 — HOW TO ORDER  (card redesign, single DOM, fully responsive)
// Flat, zero-gradient, editorial style. Pure white background.
// Each step is a card: image on top (4:3 tablet/desktop / 16:10 mobile),
// text below. Step-number badge overlaps the top-left corner of the image.
//
// ≥1024px: 3-col grid with flat terracotta right-chevrons between.
// <1024px: single column (centred) with downward chevrons between cards.
// =============================================================================

/** White WhatsApp logo SVG — official path, 18px on mobile / 20px on desktop */
function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
      focusable="false"
      className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// ── Flat SVG chevrons ─────────────────────────────────────────────────────────

/** Right-pointing flat terracotta chevron — between cards on desktop */
function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A6843D"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/** Down-pointing flat terracotta chevron — between cards on mobile */
function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A6843D"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ── Single card component ────────────────────────────────────────────────────

type StepCardProps = {
  step: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition: string;
};

function StepCard({
  step,
  title,
  description,
  imageSrc,
  imageAlt,
  objectPosition,
}: StepCardProps) {
  return (
    <article
      className="
        group
        flex flex-col h-full
        bg-white border border-[#E5E5E5]
        rounded-[8px] overflow-hidden
        transition-transform duration-200 ease-out
        hover:-translate-y-[3px] hover:border-[#C8B8A8]
      "
    >
      {/* ── Image wrapper ───────────────────────────────────────────── */}
      {/*
        Explicit aspect-ratio keeps CLS at 0 (space reserved before load).
        Mobile  (<640px): 16:10, capped at 220px so the section stays compact.
        Tablet+ (≥640px): 4:3 — matches the 1200×900 source exactly.
        `position:relative` is required for next/image fill;
        `overflow-hidden` clips the badge to the card's rounded corner.
      */}
      <div
        className="
          relative w-full overflow-hidden
          rounded-t-[8px]
          [aspect-ratio:16/10] max-h-[220px]
          sm:max-h-none sm:[aspect-ratio:4/3]
        "
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          loading="lazy"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 520px, 400px"
          className="object-cover"
          style={{ objectPosition }}
        />

        {/*
          Step number badge — solid terracotta square overlapping the
          top-left corner of the image. rounded-tl matches the card radius;
          rounded-br gives the interior diagonal cut.
        */}
        <div
          className="
            absolute top-0 left-0
            w-9 h-9
            bg-[#A6843D]
            flex items-center justify-center
            rounded-tl-[8px] rounded-br-[8px]
          "
          aria-hidden="true"
        >
          <span className="font-sans text-[13px] font-bold text-white leading-none tracking-wider">
            {step}
          </span>
        </div>
      </div>

      {/* ── Text area ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-5 gap-2">
        {/* Terracotta short divider */}
        <div className="h-[2px] w-7 bg-[#A6843D] shrink-0" aria-hidden="true" />

        {/* Step title — H3, uppercase */}
        <h3 className="font-sans text-[15px] lg:text-[16px] font-semibold uppercase tracking-[0.05em] text-black leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="font-sans text-[15px] lg:text-[14px] text-[#6B6B6B] leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}

// ── Main section component ───────────────────────────────────────────────────

export function HowToOrder() {
  return (
    <section
      className="border-t border-[#E8E8E8] bg-white pt-14 pb-12 sm:py-20"
      aria-labelledby="how-to-order-heading"
    >
      <Container>
        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-8 sm:mb-11 text-center">
          <p className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-[#A6843D] mb-2">
            Three steps
          </p>
          <h2
            id="how-to-order-heading"
            className="font-display text-4xl sm:text-5xl font-medium text-[#2C2118]"
          >
            How a suit reaches you
          </h2>
        </div>

        {/* ── Steps grid ─────────────────────────────────────────────── */}
        {/*
          Single DOM, responsive CSS only.

          <1024px (mobile + tablet): one column, centred and capped at 520px
            from 640px up, with a downward terracotta chevron sitting in the
            gap between consecutive cards.
          ≥1024px (desktop): 3 equal-height columns, 24px gap, with a right
            chevron centred in each column gap to show the 1 → 2 → 3 flow.

          The <li> is position:relative so the decorative chevrons can be
          absolutely positioned into the gaps without affecting layout.
        */}
        <ol
          className="
            list-none p-0 m-0
            flex flex-col gap-5
            sm:mx-auto sm:max-w-[520px]
            lg:mx-0 lg:max-w-none lg:grid lg:grid-cols-3 lg:gap-6 lg:items-stretch
          "
          role="list"
        >
          {HOW_TO_ORDER_STEPS.map((step, i) => (
            <li key={step.id} className="relative flex flex-col">
              {/* <1024px: downward chevron centred in the gap above this card */}
              {i > 0 && (
                <div
                  className="
                    lg:hidden
                    absolute left-1/2 top-0
                    -translate-x-1/2 -translate-y-1/2
                    z-10 flex items-center justify-center
                    pointer-events-none select-none
                  "
                  aria-hidden="true"
                >
                  <ChevronDown />
                </div>
              )}

              {/* The card itself — takes full remaining height */}
              <div className="flex-1 flex flex-col">
                <StepCard
                  step={step.step}
                  title={step.title}
                  description={step.description}
                  imageSrc={step.imageSrc}
                  imageAlt={step.imageAlt}
                  objectPosition={step.objectPosition}
                />
              </div>

              {/*
                Desktop right-chevron after col 1 and col 2, centred in the
                24px column gap (left edge of the li + 12px).
              */}
              {i < HOW_TO_ORDER_STEPS.length - 1 && (
                <div
                  className="
                    hidden lg:flex
                    absolute left-full top-1/2
                    -translate-x-1/2 -translate-y-1/2 ml-3
                    z-10 pointer-events-none select-none
                  "
                  aria-hidden="true"
                >
                  <ChevronRight />
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* ── CTA buttons ────────────────────────────────────────────── */}
        {/*
          Mobile (<640px): both buttons sit in ONE row, each exactly 50% wide
          (flex-1 + min-width:0) with a 10px gap, so they never wrap. Labels are
          kept on one line with a smaller font / tighter tracking; the WhatsApp
          button shows the short label "WhatsApp" while the full wording is kept
          for screen readers (sr-only span) and shown again at ≥640px.
          ≥640px: unchanged — natural-width buttons centred in a row.
        */}
        <div className="mt-6 sm:mt-10 flex flex-row items-stretch justify-center gap-[10px] sm:items-center sm:gap-3">
          <Link
            href="/shop"
            className="inline-flex min-h-[48px] flex-1 min-w-0 sm:flex-none sm:w-auto items-center justify-center whitespace-nowrap bg-[#1A1A1A] hover:bg-[#333333] text-white px-2 sm:px-8 py-3 font-sans text-[12px] sm:text-[11px] font-bold uppercase tracking-[0.05em] sm:tracking-[0.16em] transition-colors duration-200 rounded-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]"
          >
            Start Shopping
          </Link>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Hadi Collection on WhatsApp"
            className="inline-flex min-h-[48px] flex-1 min-w-0 sm:flex-none sm:w-auto items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap bg-[#25D366] hover:bg-[#20BD5A] text-white px-2 sm:px-8 py-3 font-sans text-[12px] sm:text-[11px] font-bold uppercase tracking-[0.05em] sm:tracking-[0.16em] transition-colors duration-200 rounded-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          >
            <WhatsAppIcon />
            <span className="sr-only sm:not-sr-only">{"Chat on "}</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
