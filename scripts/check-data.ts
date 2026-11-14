#!/usr/bin/env node

/**
 * =============================================================================
 * SAZAIRA — DATA INTEGRITY VALIDATION SCRIPT
 * =============================================================================
 * Validates /data/products.ts and /data/categories.ts for:
 * 1. Duplicate product or category slugs
 * 2. Missing images (verifies local files in /public/)
 * 3. Products without a valid category reference
 * 4. Invalid styles for the given category
 *
 * Runs automatically prior to next build.
 * =============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";
import { CATEGORY_STYLES_MAP } from "../lib/category-styles";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

async function main() {
  console.log("🔍 Validating Hadi Collection local data integrity...\n");
  let hasErrors = false;

  console.log(`📁 Loaded ${CATEGORIES.length} categories and ${PRODUCTS.length} products.`);

  // 1. Check duplicate category slugs
  const categorySlugs = new Set<string>();
  for (const cat of CATEGORIES) {
    if (!cat.slug) {
      console.error(`❌ Category missing slug: "${cat.title}"`);
      hasErrors = true;
      continue;
    }
    const norm = cat.slug.toLowerCase().trim();
    if (categorySlugs.has(norm)) {
      console.error(`❌ Duplicate category slug found: "${cat.slug}"`);
      hasErrors = true;
    }
    categorySlugs.add(norm);

    // Check category image
    const imgUrl = cat.image?.asset?.url || cat.image?.url;
    if (imgUrl && imgUrl.startsWith("/")) {
      const imgPath = path.join(ROOT_DIR, "public", imgUrl);
      if (!fs.existsSync(imgPath)) {
        console.warn(`⚠️ Warning: Category image not found on disk: "${imgPath}"`);
      }
    }

    // Check category hover/model image
    if (cat.hoverImage && cat.hoverImage.startsWith("/")) {
      const hoverPath = path.join(ROOT_DIR, "public", cat.hoverImage);
      if (!fs.existsSync(hoverPath)) {
        console.warn(`⚠️ Warning: Category hover image not found on disk: "${hoverPath}"`);
      }
    }
  }

  // 2. Check product slugs & integrity
  const productSlugs = new Set<string>();
  for (const prod of PRODUCTS) {
    if (!prod.slug) {
      console.error(`❌ Product missing slug: "${prod.name}" (ID: ${prod._id})`);
      hasErrors = true;
      continue;
    }
    const norm = prod.slug.toLowerCase().trim();
    if (productSlugs.has(norm)) {
      console.error(`❌ Duplicate product slug found: "${prod.slug}"`);
      hasErrors = true;
    }
    productSlugs.add(norm);

    // 3. Check product category
    if (!prod.category || !prod.category.slug) {
      console.error(`❌ Product "${prod.name}" has no valid category!`);
      hasErrors = true;
    } else {
      const catSlug = prod.category.slug.toLowerCase().trim();
      if (!categorySlugs.has(catSlug)) {
        console.error(`❌ Product "${prod.name}" references non-existent category "${prod.category.slug}"`);
        hasErrors = true;
      }

      // 4. Check valid styles for category
      const allowedStyles = (CATEGORY_STYLES_MAP[catSlug] || []).map(s => s.value);
      if (prod.styles && prod.styles.length > 0) {
        for (const style of prod.styles) {
          if (!allowedStyles.includes(style)) {
            console.error(
              `❌ Product "${prod.name}" has style "${style}" which is not valid for category "${catSlug}". Allowed styles: [${allowedStyles.join(", ")}]`
            );
            hasErrors = true;
          }
        }
      }
    }

    // 5. Check product images
    if (!prod.images || prod.images.length === 0) {
      console.warn(`⚠️ Warning: Product "${prod.name}" has no images.`);
    } else {
      for (const img of prod.images) {
        const imgUrl = img.asset?.url || img.url;
        if (imgUrl && imgUrl.startsWith("/")) {
          const imgPath = path.join(ROOT_DIR, "public", imgUrl);
          if (!fs.existsSync(imgPath)) {
            console.warn(`⚠️ Warning: Product image not found on disk: "${imgPath}" for product "${prod.name}"`);
          }
        }
      }
    }
  }

  if (hasErrors) {
    console.error("\n❌ Data integrity check FAILED. Please resolve errors above.");
    process.exit(1);
  } else {
    console.log("\n✅ All data validation checks PASSED successfully!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Error during check-data execution:", err);
  process.exit(1);
});
