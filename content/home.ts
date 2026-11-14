/**
 * Hadi Collection — homepage and contact content.
 * Ladies unstitched suits. 2-piece and 3-piece.
 */

import {
  SAZAIRA_WHATSAPP_PHONE,
  WHATSAPP_DISPLAY_LOCAL,
  WHATSAPP_TELEPHONE_JSON_LD,
  getGeneralWhatsAppLink,
} from "@/lib/whatsapp";

export const HERO_CONFIG = {
  desktop: {
    src: "/images/hadi/rani-festive.jpg",
    alt: "Rani Festive unstitched suit with a gold paisley border by Hadi Collection",
    width: 1600,
    height: 1600,
    objectPosition: "center center",
  },
  mobile: {
    src: "/images/hadi/gul-embroidered.jpg",
    alt: "Gul Embroidered plum floral 3-piece by Hadi Collection",
    width: 1600,
    height: 1600,
    objectPosition: "center center",
  },
} as const;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/hadicollection.pk/",
  tiktok: "https://YOUR_tiktok",
  facebook: "https://YOUR_facebook",
  pinterest: "https://YOUR_pinterest",
} as const;

export function isSocialPlaceholder(url: string): boolean {
  return url.includes("YOUR_");
}

export function getSocialSameAs(): string[] {
  return Object.values(SOCIAL_LINKS).filter((url) => !isSocialPlaceholder(url));
}

export const CONTACT = {
  email: "hello@hadicollection.pk",
  emailHref: "mailto:hello@hadicollection.pk",
  phoneDisplay: WHATSAPP_DISPLAY_LOCAL,
  telephone: WHATSAPP_TELEPHONE_JSON_LD,
  telHref: `tel:${WHATSAPP_TELEPHONE_JSON_LD}`,
  whatsappUrl: getGeneralWhatsAppLink(),
  whatsappNumber: SAZAIRA_WHATSAPP_PHONE,
  location: "Lahore, Pakistan",
} as const;

export const CONTACT_DETAILS = {
  address: "Lahore, Pakistan",
  hours: "Monday to Saturday, 11:00 AM – 8:00 PM PKT",
  MAP_QUERY: "Lahore, Pakistan",
} as const;

export const OCCASION_TILES = [
  {
    id: "lawn",
    title: "Lawn Prints",
    description: "Daytime 3-piece lawn with printed shirts and easy trousers.",
    href: "/category/lawn-prints",
    ariaLabel: "Shop printed lawn suits",
    bg: "#F5F5F5",
    imageSrc: "/images/hadi/noor-floral.jpg",
    imageAlt: "Ice-blue floral lawn suit by Hadi Collection",
    objectPosition: "center center",
  },
  {
    id: "festive",
    title: "Festive Edit",
    description: "Gold borders and jewel tones for Eid and wedding week.",
    href: "/category/festive-edit",
    ariaLabel: "Shop festive unstitched suits",
    bg: "#F5F5F5",
    imageSrc: "/images/hadi/rani-festive.jpg",
    imageAlt: "Teal and maroon festive suit with a gold border",
    objectPosition: "center center",
  },
  {
    id: "embroidered",
    title: "Embroidered",
    description: "Floral embroidery for mehndi, barat and evening events.",
    href: "/category/embroidered",
    ariaLabel: "Shop embroidered suits",
    bg: "#F5F5F5",
    imageSrc: "/images/hadi/gul-embroidered.jpg",
    imageAlt: "Plum embroidered 3-piece suit by Hadi Collection",
    objectPosition: "center center",
  },
  {
    id: "botanical",
    title: "Botanical",
    description: "Leaf prints in teal and gold for a quieter festive look.",
    href: "/category/botanical",
    ariaLabel: "Shop botanical print suits",
    bg: "#F5F5F5",
    imageSrc: "/images/hadi/zarah-botanical.jpg",
    imageAlt: "Teal botanical suit with a gold leaf print",
    objectPosition: "center center",
  },
] as const;

export const HOW_TO_ORDER_STEPS = [
  {
    id: "step-1",
    step: "01",
    title: "Choose Your Suit",
    description:
      "Browse lawn, botanical, embroidered and festive edits. Each piece is an unstitched 2-piece or 3-piece you can stitch to your own cut.",
    imageSrc: "/hadi-step-choose.jpg",
    imageAlt: "Folded teal and gold unstitched suit ready to choose",
    objectPosition: "center center",
  },
  {
    id: "step-2",
    step: "02",
    title: "Place Your Order",
    description:
      "Add the suit to your cart and checkout with your delivery details. Message us on WhatsApp if you want help with fabric or colour.",
    imageSrc: "/hadi-step-order.jpg",
    imageAlt: "Phone checkout beside a plum embroidered dupatta",
    objectPosition: "center center",
  },
  {
    id: "step-3",
    step: "03",
    title: "Receive & Pay on Delivery",
    description:
      "Delivered in 2–4 working days nationwide. Pay cash when the parcel arrives, with a 7-day exchange if the suit is unused.",
    imageSrc: "/hadi-step-delivery.jpg",
    imageAlt: "Cream parcel with a navy festive suit in tissue",
    objectPosition: "center center",
  },
] as const;

export const WHATSAPP_URL = getGeneralWhatsAppLink();
export { SAZAIRA_WHATSAPP_PHONE };

export const HOME_FAQS = [
  {
    id: "faq-cod",
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes. Cash on Delivery is available nationwide across Pakistan. Pay the courier in cash when your suit arrives — no advance payment required.",
  },
  {
    id: "faq-delivery",
    question: "How long does delivery take?",
    answer:
      "Orders are typically delivered in 2–4 working days nationwide across Pakistan. You will receive a dispatch update on WhatsApp once your suit is on its way.",
  },
  {
    id: "faq-exchange",
    question: "Can I exchange or return a suit?",
    answer:
      "Yes. You may request a return or exchange within 7 days of delivery, provided the fabric is unused, uncut and in its original packing. See our ",
    answerLinkText: "Returns & Exchanges policy",
    answerLinkHref: "/policies/returns",
    answerSuffix: " for full details.",
  },
  {
    id: "faq-how-to-order",
    question: "How do I place an order?",
    answer:
      "Choose a suit, add it to your cart, and checkout with your delivery details. Our team confirms the order on WhatsApp. You can also ",
    answerLinkText: "visit the shop",
    answerLinkHref: "/shop",
    answerSuffix: " to start with the full edit.",
  },
  {
    id: "faq-unstiched",
    question: "Are the suits stitched or unstitched?",
    answer:
      "Every suit in this edit is unstitched, so you can stitch the shirt, trouser and dupatta to your own measurements. Browse ",
    answerLinks: [
      { text: "lawn prints", href: "/category/lawn-prints" },
      { text: "festive suits", href: "/category/festive-edit" },
    ],
    answerSuffix: " to see the current 3-piece sets.",
  },
  {
    id: "faq-festive",
    question: "Do you have suits for Eid and weddings?",
    answer: "Yes. The festive and embroidered edits are made for celebrations. See ",
    answerLinks: [
      { text: "festive gold borders", href: "/category/festive-edit" },
      { text: "embroidered florals", href: "/category/embroidered" },
    ],
    answerSuffix: " for Eid, mehndi, barat and walima.",
  },
] as const;

export function buildFaqAnswerText(faq: (typeof HOME_FAQS)[number]): string {
  let text: string = faq.answer;
  if ("answerLinks" in faq && Array.isArray((faq as { answerLinks?: readonly { text: string }[] }).answerLinks)) {
    const links = (faq as { answerLinks: readonly { text: string }[] }).answerLinks;
    text += links.map((l) => l.text).join(" and ");
  }
  if ("answerLinkText" in faq && (faq as { answerLinkText?: string }).answerLinkText) {
    text += (faq as { answerLinkText: string }).answerLinkText;
  }
  if ("answerSuffix" in faq && (faq as { answerSuffix?: string }).answerSuffix) {
    text += (faq as { answerSuffix: string }).answerSuffix;
  }
  return text;
}
