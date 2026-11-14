"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { HOME_FAQS } from "@/content/home";

// =============================================================================
// SECTION 10 — HOMEPAGE FAQ ACCORDION
// Accessible: button + aria-expanded + aria-controls.
// Answer text is present in DOM (not loaded on click) so crawlers can read it.
// FAQPage JSON-LD is rendered by the parent (server component) and must match
// this visible content exactly.
// =============================================================================

type FaqItem = (typeof HOME_FAQS)[number];

function FaqAnswer({ faq }: { faq: FaqItem }) {
  // Render plain answer text, optionally with inline links
  return (
    <span>
      {faq.answer}
      {"answerLinks" in faq && faq.answerLinks ? (
        <>
          {faq.answerLinks.map((link, i) => (
            <span key={link.href}>
              {i > 0 && " and "}
              <Link
                href={link.href}
                className="underline underline-offset-2 hover:text-black"
              >
                {link.text}
              </Link>
            </span>
          ))}
        </>
      ) : null}
      {"answerLinkText" in faq && faq.answerLinkText ? (
        <Link
          href={(faq as { answerLinkHref: string }).answerLinkHref}
          className="underline underline-offset-2 hover:text-black"
        >
          {faq.answerLinkText}
        </Link>
      ) : null}
      {"answerSuffix" in faq ? (faq as { answerSuffix: string }).answerSuffix : ""}
    </span>
  );
}

function HomepageFaqItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answerId = `home-faq-answer-${faq.id}`;
  const questionId = `home-faq-question-${faq.id}`;

  return (
    <div className="border-b border-[#E5E5E5]">
      <button
        type="button"
        id={questionId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-[13px] sm:text-[14px] font-semibold text-black transition-colors hover:text-[#6B6B6B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        <span>{faq.question}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-[#6B6B6B] transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        />
      </button>

      {/*
        Answer is always in the DOM (hidden attribute) so search crawlers
        can read it. The hidden attribute is toggled by JS for visual show/hide.
      */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        hidden={!isOpen}
        className="pb-5 font-sans text-[12px] sm:text-[13px] leading-relaxed text-[#6B6B6B]"
      >
        <FaqAnswer faq={faq} />
      </div>
    </div>
  );
}

export function HomepageFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="border-t border-[#E5E5E5] py-14 sm:py-20 bg-white"
      aria-labelledby="homepage-faq-heading"
    >
      <Container size="narrow">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="font-sans text-[12px] font-medium uppercase tracking-[0.15em] text-[#6B6B6B] mb-2">
            Good to Know
          </p>
          <h2
            id="homepage-faq-heading"
            className="font-sans text-2xl sm:text-3xl font-semibold uppercase tracking-[0.02em] text-black"
          >
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="border-t border-[#E5E5E5]">
          {HOME_FAQS.map((faq, i) => (
            <HomepageFaqItem
              key={faq.id}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* View all FAQs */}
        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-black hover:underline underline-offset-2"
          >
            View all FAQs →
          </Link>
        </div>
      </Container>
    </section>
  );
}
