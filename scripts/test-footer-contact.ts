import { SOCIAL_LINKS, CONTACT, isSocialPlaceholder, getSocialSameAs } from "../content/home";
import { SOCIAL_ITEMS } from "../components/ui/social-icons";
import { CATEGORIES } from "../data/categories";
import fs from "fs";

let failures = 0;
function assert(condition: unknown, message: string): void {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log("=== 1. VERIFYING CENTRAL CONTACT & SOCIAL DATA ===");

assert(SOCIAL_LINKS.instagram === "https://www.instagram.com/hadicollection.pk/", "Instagram URL matches");
assert(SOCIAL_LINKS.tiktok === "https://YOUR_tiktok", "TikTok URL is unset");
assert(SOCIAL_LINKS.facebook === "https://YOUR_facebook", "Facebook URL is unset");
assert(SOCIAL_LINKS.pinterest === "https://YOUR_pinterest", "Pinterest URL is unset");

assert(CONTACT.email === "hello@hadicollection.pk", "Support email is hello@hadicollection.pk");
assert(CONTACT.emailHref === "mailto:hello@hadicollection.pk", "Support emailHref is mailto:hello@hadicollection.pk");
assert(CONTACT.phoneDisplay === "0330 9862474", "phoneDisplay is 0330 9862474");
assert(CONTACT.telephone === "+923309862474", "telephone is +923309862474");
assert(CONTACT.telHref === "tel:+923309862474", "telHref is tel:+923309862474");
assert(CONTACT.whatsappNumber === "923309862474", "whatsappNumber is 923309862474");

assert(CONTACT.whatsappUrl.startsWith("https://wa.me/923309862474?text="), "whatsappUrl uses existing wa.me link helper");
assert(CONTACT.whatsappUrl.includes("Salam%20Hadi Collection!"), "whatsappUrl includes prefilled support message");

console.log("\n=== 2. VERIFYING PLACEHOLDER LOGIC ===");
assert(!isSocialPlaceholder(SOCIAL_LINKS.instagram), "Instagram is not marked placeholder");
assert(isSocialPlaceholder(SOCIAL_LINKS.tiktok), "TikTok is a placeholder until a real profile exists");
assert(isSocialPlaceholder(SOCIAL_LINKS.facebook), "Facebook is a placeholder until a real profile exists");
assert(isSocialPlaceholder(SOCIAL_LINKS.pinterest), "Pinterest is a placeholder until a real profile exists");
assert(isSocialPlaceholder("https://instagram.com/YOUR_HANDLE"), "Placeholder detection works for YOUR_");

const sameAs = getSocialSameAs();
assert(sameAs.length === 1, "getSocialSameAs returns the live Instagram profile only");
assert(sameAs.includes("https://www.instagram.com/hadicollection.pk/"), "sameAs includes Instagram");

console.log("\n=== 3. VERIFYING SOCIAL_ITEMS CONFIG & OFFICIAL BRAND COLORS ===");
assert(SOCIAL_ITEMS.length === 4, "SOCIAL_ITEMS contains 4 social profiles");

const ig = SOCIAL_ITEMS.find((s) => s.id === "instagram");
assert(ig && ig.bgHex === "#E1306C" && ig.hoverBgHex === "#C1275B", "Instagram brand color #E1306C and hover #C1275B");

const tt = SOCIAL_ITEMS.find((s) => s.id === "tiktok");
assert(tt && tt.bgHex === "#000000" && tt.hoverBgHex === "#1F1F1F", "TikTok brand color #000000 and hover #1F1F1F");

const fb = SOCIAL_ITEMS.find((s) => s.id === "facebook");
assert(fb && fb.bgHex === "#1877F2" && fb.hoverBgHex === "#145DBF", "Facebook brand color #1877F2 and hover #145DBF");

const pin = SOCIAL_ITEMS.find((s) => s.id === "pinterest");
assert(pin && pin.bgHex === "#E60023" && pin.hoverBgHex === "#B8001C", "Pinterest brand color #E60023 and hover #B8001C");

for (const item of SOCIAL_ITEMS) {
  assert(item.ariaLabel.startsWith("Follow Hadi Collection on "), `${item.label} ariaLabel has correct accessible format: ${item.ariaLabel}`);
  assert(typeof item.Icon === "function", `${item.label} has inline SVG glyph component`);
}

console.log("\n=== 4. VERIFYING FOOTER CODEBASE ===");
const footerSource = fs.readFileSync("components/layout/footer.tsx", "utf-8");

// Tagline check
assert(
  footerSource.includes("Ladies unstitched suits. Lawn, embroidery and festive edits, stitched to your own cut.") &&
  !footerSource.includes("Designed in Lahore"),
  "Tagline removes 'Designed in Lahore' from footer"
);

// Customer Support check
assert(
  !footerSource.includes('href="/contact" className={FOOTER_LINK}') &&
  !footerSource.includes('href="/faq" className={FOOTER_LINK}'),
  "Contact Us and FAQ removed from Customer Support column"
);
assert(footerSource.includes("WhatsApp:"), "WhatsApp label present in Customer Support");
assert(footerSource.includes("Call:"), "Call label present in Customer Support");
assert(footerSource.includes("Email:"), "Email label present in Customer Support");

// Terms & Conditions consistency
assert(footerSource.includes("Terms &amp; Conditions"), "Footer bottom bar uses 'Terms & Conditions'");
assert(!footerSource.includes("Terms of Service"), "Footer bottom bar removed 'Terms of Service'");

// Shop column categories
const activeCategories = CATEGORIES.filter((c) => c.isActive !== false);
assert(activeCategories.length === 4, "4 active clothing categories defined in categories data");
for (const cat of activeCategories) {
  assert(footerSource.includes(cat.title), `Footer includes active category: ${cat.title}`);
  assert(footerSource.includes(`/category/${cat.slug}`), `Footer links to slug: /category/${cat.slug}`);
}

assert(!footerSource.includes("Order on WhatsApp"), "Footer order banner removed");
assert(!footerSource.includes("Enter your email"), "Footer email newsletter removed");
assert(footerSource.includes("WhatsApp:"), "WhatsApp remains in customer support");

console.log("\n=== 5. VERIFYING FOOTER TYPOGRAPHY & DESKTOP GRID ===");
assert(footerSource.includes("text-[14px] font-normal leading-[1.4] text-[#6B6B6B]"), "FOOTER_LINK uses 14px, 400 weight, leading 1.4, #6B6B6B");
assert(footerSource.includes("text-[14px] font-normal leading-[1.4] max-w-sm"), "Tagline uses 14px 400 weight");
assert(!footerSource.includes("text-[15px]"), "No leftover 15px text in footer links");
assert(!footerSource.includes("text-[16px]"), "No leftover 16px text in footer links");
assert(!footerSource.includes("min-h-[36px]"), "No min-h-[36px] forcing excessive row height");
assert(footerSource.includes("h-[18px] w-[18px]"), "Customer Support icons are ~18px");
assert(footerSource.includes("font-semibold text-black text-[14px] leading-[1.4]"), "Customer support labels are 14px font-semibold text-black");
assert(footerSource.includes("font-normal text-[#6B6B6B] text-[14px] leading-[1.4]"), "Customer support values are 14px font-normal text-[#6B6B6B]");
assert(footerSource.includes("whitespace-nowrap"), "Footer links have whitespace-nowrap");
assert(footerSource.includes("lg:grid-cols-[2.1fr_1fr_0.8fr_1.15fr_1.6fr]"), "Desktop grid uses rebalanced column proportions");
assert(!footerSource.includes("SHOP_COL_1") && !footerSource.includes("SHOP_COL_2"), "Shop categories are in ONE single vertical list without sub-columns");
assert(footerSource.includes("min-w-0 flex-1") && footerSource.includes("max-w-md"), "Newsletter input is wide (min-w-0 flex-1 max-w-md)");

console.log("\n=== 6. VERIFYING CONTACT PAGE & LAYOUT ===");
const contactPageSource = fs.readFileSync("app/(store)/contact/page.tsx", "utf-8");
const contactLayoutSource = fs.readFileSync("app/(store)/contact/layout.tsx", "utf-8");

// No mentions of obsolete phrases
assert(!contactPageSource.includes("custom bridal potlis"), "No mention of 'custom bridal potlis' in contact page");
assert(!contactPageSource.includes("corporate gifting"), "No mention of 'corporate gifting' in contact page");
assert(!contactPageSource.includes("size advice"), "No mention of 'size advice' in contact page");
assert(!contactLayoutSource.includes("custom bridal potlis"), "No mention of 'custom bridal potlis' in contact layout");
assert(!contactLayoutSource.includes("corporate gifting"), "No mention of 'corporate gifting' in contact layout");
assert(!contactLayoutSource.includes("size advice"), "No mention of 'size advice' in contact layout");

// No old links
assert(!contactPageSource.includes("Browse Handbag Catalog"), "Old 'Browse Handbag Catalog' removed");
assert(!contactPageSource.includes("Live WhatsApp Chat"), "Old 'Live WhatsApp Chat' removed");

// Header band
assert(contactPageSource.includes("Customer Support · Pakistan"), "Header band eyebrow present");
assert(contactPageSource.includes("Get in Touch"), "H1 'Get in Touch' present");

// Quick contact cards
assert(contactPageSource.includes("#1FA855"), "WhatsApp card uses #1FA855");
assert(contactPageSource.includes("Chat on WhatsApp"), "WhatsApp card text present");
assert(contactPageSource.includes("Call Us"), "Call Us card text present");
assert(contactPageSource.includes("#A6843D"), "Email card uses the gold accent");

// Two-column layout
assert(contactPageSource.includes("Contact Information"), "Left column H2 'Contact Information' present");
assert(contactPageSource.includes("Send Us a Message"), "Right column H2 'Send Us a Message' present");

// Map
assert(contactPageSource.includes("Find Us"), "Map section H2 'Find Us' present");
assert(contactPageSource.includes("output=embed"), "Google Maps iframe uses output=embed");
assert(contactPageSource.includes("loading=\"lazy\""), "Google Maps iframe has loading='lazy'");
assert(contactPageSource.includes("referrerPolicy=\"no-referrer-when-downgrade\""), "Google Maps iframe has referrerPolicy");
assert(contactPageSource.includes("Open in Google Maps"), "'Open in Google Maps' button present");
assert(contactPageSource.includes("Get Directions"), "'Get Directions' button present");

// Quick answers & Closing CTA
assert(contactPageSource.includes("Quick Answers"), "Quick Answers section H2 present");
assert(contactPageSource.includes("Ready to choose a suit?"), "Closing CTA H2 present");
assert(contactPageSource.includes("Shop all suits"), "Closing CTA shop button present");

// Layout JSON-LD & meta
assert(contactLayoutSource.includes("ContactPage"), "ContactPage JSON-LD present in layout");
assert(contactLayoutSource.includes("contactPoint"), "contactPoint JSON-LD present in layout");
assert(contactLayoutSource.includes("sameAs"), "sameAs JSON-LD present in layout");

if (failures > 0) {
  console.error(`\n❌ Total failures: ${failures}`);
  process.exit(1);
} else {
  console.log("\n🎉 ALL TESTS PASSED!");
}
