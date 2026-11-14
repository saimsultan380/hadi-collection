"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getGeneralWhatsAppLink } from "@/lib/whatsapp";

// =============================================================================
// SAZAIRA — FAQ PAGE (/faq)
// Accordion-style. useState per item. Chevron rotates 180° on open.
// Flat borders between items. Zero shadows. Zero gradients.
// FAQPage JSON-LD is injected via FaqJsonLd (server component pattern handled
// by exporting metadata from a layout or using a script tag here).
// =============================================================================

// ── FAQ data — matches the JSON-LD exactly ────────────────────────────────────
const FAQS: { question: string; answer: string }[] = [
  {
    question: "How long does delivery take?",
    answer:
      "We dispatch orders within 1–2 business days of confirmation. Delivery to major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan) takes 3–5 business days. Other cities and towns receive orders within 5–7 business days. Remote areas may take up to 7–10 business days. You will receive a tracking update via WhatsApp once your order is dispatched.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes. Cash on Delivery is available nationwide across Pakistan. You pay in cash directly to the courier at the time of delivery — no advance payment required. We also accept Bank Transfer and EasyPaisa/JazzCash for prepaid orders.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes. You may request a return or exchange within 7 days of delivery, provided the item is unused, in its original condition, with all tags and packaging intact. To initiate a return, message us on WhatsApp with your order number and photographs of the item. Please review our full Returns & Exchange Policy for complete details.",
  },
  {
    question: "How do I track my order?",
    answer:
      "We use a WhatsApp-first tracking approach. Once your order is dispatched, our team will send you the courier tracking number and a direct tracking link via WhatsApp. For any delivery queries, message us on WhatsApp with your order number and we will assist you promptly.",
  },
  {
    question: "Do you ship nationwide across Pakistan?",
    answer:
      "Yes. Hadi Collection delivers to all provinces and regions of Pakistan, including Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Azad Kashmir, and Gilgit-Baltistan. We currently do not offer international shipping.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept: (1) Cash on Delivery (COD) — pay when your order arrives; (2) Bank Transfer to our Meezan Bank account — order dispatched after payment confirmation; (3) EasyPaisa/JazzCash mobile wallet — transfer to our registered number and share a screenshot for confirmation. All prices are in Pakistani Rupees (PKR).",
  },
  {
    question: "Are the suits stitched?",
    answer:
      "No. Every suit is unstitched fabric: a shirt length, a trouser and a dupatta, so your tailor can cut it to your measurements. Message us on WhatsApp if you want help reading a print or border before you order.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Browse the shop, choose a suit, add it to your cart, and checkout with your delivery details. Our team confirms the order on WhatsApp.",
  },
  {
    question: "Can I cancel or modify my order after placing it?",
    answer:
      "You can request a cancellation or modification by messaging us on WhatsApp as soon as possible after placing your order. We will do our best to accommodate changes if your order has not yet been dispatched. Once dispatched, cancellations are no longer possible, but you may initiate a return after receiving the item.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently do not offer international shipping. Hadi Collection ships within Pakistan only. If you are based outside Pakistan but would like to place an order, please message us on WhatsApp to discuss arrangements.",
  },
  {
    question: "How should I handle the fabric before stitching?",
    answer:
      "Keep the suit folded, dry and out of direct sun until it is stitched. Do not wash unstitched lawn before the tailor cuts it. If a piece arrives with a fold mark, a light press on the reverse is enough.",
  },
  {
    question: "Do you offer gift wrapping or custom orders?",
    answer:
      "Yes, we can add a complimentary gift note to your order — just mention it when messaging us on WhatsApp after placing your order. For custom colour requests, bridal gifting sets, or corporate bulk orders, please contact us directly on WhatsApp to discuss requirements and availability.",
  },
];

// ── Individual accordion item ─────────────────────────────────────────────────
function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className="border-b border-[#E5E5E5]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-black transition-colors hover:text-[#6B6B6B]"
      >
        <span>{question}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-[#6B6B6B] transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        />
      </button>
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        hidden={!isOpen}
        className="pb-5 text-sm leading-[1.6] text-[#6B6B6B]"
      >
        {answer}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* FAQPage JSON-LD — matches visible content exactly */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
            })),
          }),
        }}
      />

      <div className="bg-white py-16 md:py-24">
        <Container size="narrow">
          {/* Editorial Header */}
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
              Answers &amp; Guidance
            </p>
            <h1 className="mb-4 text-3xl font-semibold uppercase tracking-[0.02em] text-black md:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-[1.6] text-[#6B6B6B]">
              Everything you need to know about ordering, delivery, returns, and
              our unstitched suits. Can&apos;t find your answer? Message us on
              WhatsApp.
            </p>
          </div>

          {/* Accordion */}
          <div className="border border-[#E5E5E5] bg-white px-8 py-2 md:px-14">
            <div className="border-t border-[#E5E5E5]">
              {FAQS.map((faq, index) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                  index={index}
                />
              ))}
            </div>

            {/* Still have questions CTA */}
            <div className="border-t border-[#E5E5E5] py-10 text-center">
              <p className="mb-1 text-sm font-semibold text-black">
                Still have questions?
              </p>
              <p className="mb-5 text-xs text-[#6B6B6B]">
                Our team is here to assist you with any questions about our collection or your order.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={getGeneralWhatsAppLink(
                    "Salam Hadi Collection! I have a question about your unstitched suits."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="faq-whatsapp-cta"
                  className="inline-flex items-center gap-2 border border-[#25D366] bg-[#25D366] px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1ebe5e]"
                >
                  Chat on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center border border-black bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-white"
                >
                  Contact Form
                </Link>
              </div>
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
              href="/policies/returns"
              className="text-black hover:underline"
            >
              Returns Policy →
            </Link>
            <Link
              href="/shop"
              className="text-black hover:underline"
            >
              Browse Collection →
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
