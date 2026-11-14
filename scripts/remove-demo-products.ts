#!/usr/bin/env node

/**
 * =============================================================================
 * SAZAIRA — REMOVE DEMO PRODUCTS SCRIPT (LOCAL DATA)
 * =============================================================================
 * Removes demo/seed products flagged with `isDemo: true` from /data/products.ts.
 *
 * Safety protections:
 * - Leaves "Purse Testing" test product untouched (isDemo: false)
 * - Automatically creates a timestamped backup of data/products.ts
 * - Supports --dry-run mode to inspect matches without deleting
 *
 * Usage:
 *   npx tsx scripts/remove-demo-products.ts --dry-run   # Preview matches
 *   npx tsx scripts/remove-demo-products.ts             # Bulk delete
 *   npm run remove-demo                                 # Via npm
 * =============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS } from "../data/products";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PRODUCTS_FILE = path.join(ROOT_DIR, "data", "products.ts");

const isDryRun = process.argv.includes("--dry-run");

async function main() {
  console.log("=================================================");
  console.log("   SAZAIRA — DEMO PRODUCTS REMOVER (LOCAL)       ");
  console.log("=================================================\n");

  if (isDryRun) {
    console.log("🔍 MODE: DRY-RUN (Previewing matches without modifying files)\n");
  }

  const demoProducts = PRODUCTS.filter((p) => p.isDemo === true);
  const realProducts = PRODUCTS.filter((p) => p.isDemo !== true);

  console.log(`📊 Catalog Summary:`);
  console.log(`   Total products currently in catalog: ${PRODUCTS.length}`);
  console.log(`   Demo products flagged for removal:   ${demoProducts.length}`);
  console.log(`   Real / test products to keep:        ${realProducts.length}\n`);

  if (demoProducts.length === 0) {
    console.log("✅ No demo products found in data/products.ts. Nothing to remove.");
    return;
  }

  console.log("Demo products found:");
  demoProducts.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.category?.title || "No Category"}] ${p.name} (slug: ${p.slug}, PKR ${p.price})`);
  });

  if (isDryRun) {
    console.log("\n💡 Dry run complete. Run without --dry-run to remove these products from data/products.ts.");
    return;
  }

  // Create backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(ROOT_DIR, "data", `products.backup.${timestamp}.ts`);
  fs.copyFileSync(PRODUCTS_FILE, backupPath);
  console.log(`\n💾 Backup created at: ${backupPath}`);

  // Format real products into TypeScript source
  const fileContent = `import type { Product, ProductImage } from "@/types/product";
import { CATEGORIES } from "./categories";

// Helper to find category by slug
const cat = (slug: string) => {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(\`Category not found: \${slug}\`);
  return found;
};

// =============================================================================
// PRODUCTS CATALOG
// Real products only (demo products removed).
// =============================================================================

export const PRODUCTS: Product[] = ${JSON.stringify(realProducts, null, 2)
    .replace(/"category":\s*\{\s*"_id":\s*"[^"]*",\s*"title":\s*"[^"]*",\s*"slug":\s*"([^"]*)"[\s\S]*?\}/g, 'category: cat("$1")')
    .replace(/"_id":/g, '_id:')
    .replace(/"name":/g, 'name:')
    .replace(/"slug":/g, 'slug:')
    .replace(/"price":/g, 'price:')
    .replace(/"images":/g, 'images:')
    .replace(/"stockStatus":/g, 'stockStatus:')
};
`;

  fs.writeFileSync(PRODUCTS_FILE, fileContent, "utf-8");
  console.log(`\n🗑️  Successfully removed ${demoProducts.length} demo products from data/products.ts!`);
  console.log(`✅ Current catalog now has ${realProducts.length} active products.`);
}

main().catch((err) => {
  console.error("Error running remove-demo-products:", err);
  process.exit(1);
});
