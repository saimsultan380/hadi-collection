import assert from "node:assert";

// We can import directly from our TS/transpiled module or test logic directly
import {
  EID_WINDOWS,
  DEFAULT_FALLBACK_BANNER,
  BANNER_PRESETS,
  isDateInWindow,
  getActiveEidWindow,
  getSeasonalBanner,
} from "../lib/seasonalBanner.ts";

console.log("=== RUNNING SEASONAL BANNER TESTS ===\n");

// Test 1: Date inside Eid-ul-Fitr 2026 (e.g. 2026-03-15)
{
  const testDate = new Date(2026, 2, 15); // March 15, 2026
  const activeWindow = getActiveEidWindow(testDate);
  assert.ok(activeWindow, "Expected active Eid window for 2026-03-15");
  assert.strictEqual(activeWindow.label, "Eid-ul-Fitr 2026");

  const banner = getSeasonalBanner(testDate);
  assert.strictEqual(banner.type, "eid");
  assert.strictEqual(banner.ctaLink, "/shop?occasion=Eid/Festive");
  assert.strictEqual(
    banner.heading,
    "Eid Collection — Elegance for Every Occasion"
  );
  console.log("✓ Passed: Eid-ul-Fitr 2026 window displays Eid banner");
}

// Test 2: Date inside Eid-ul-Adha 2026 (e.g. 2026-05-20)
{
  const testDate = new Date(2026, 4, 20); // May 20, 2026
  const activeWindow = getActiveEidWindow(testDate);
  assert.ok(activeWindow, "Expected active Eid window for 2026-05-20");
  assert.strictEqual(activeWindow.label, "Eid-ul-Adha 2026");

  const banner = getSeasonalBanner(testDate);
  assert.strictEqual(banner.type, "eid");
  assert.strictEqual(banner.ctaLink, "/shop?occasion=Eid/Festive");
  console.log("✓ Passed: Eid-ul-Adha 2026 window displays Eid banner");
}

// Test 3: Date outside any Eid window (e.g. Today / September 16, 2026)
{
  const testDate = new Date(2026, 8, 16); // Sept 16, 2026
  const activeWindow = getActiveEidWindow(testDate);
  assert.strictEqual(
    activeWindow,
    null,
    "Expected no active Eid window for 2026-09-16"
  );

  const banner = getSeasonalBanner(testDate);
  assert.strictEqual(banner.type, "wedding");
  assert.strictEqual(banner.ctaLink, "/shop?occasion=Wedding/Formal");
  assert.strictEqual(
    banner.heading,
    "Wedding & Formal Collection — Elegance for Every Celebration"
  );
  console.log(
    "✓ Passed: Outside Eid window displays Wedding & Formal fallback banner"
  );
}

// Test 4: Switching fallback to bestsellers
{
  const testDate = new Date(2026, 8, 16);
  const banner = getSeasonalBanner(testDate, "bestsellers");
  assert.strictEqual(banner.type, "bestsellers");
  assert.strictEqual(banner.ctaLink, "/shop?sort=bestselling");
  assert.strictEqual(banner.heading, "Best Sellers — Loved by Thousands");
  console.log("✓ Passed: Fallback can be configured/overridden to bestsellers");
}

// Test 5: Date bounds check (exact start and exact end dates)
{
  const window = EID_WINDOWS[0]; // 2025-03-15 to 2025-04-05
  assert.ok(
    isDateInWindow(new Date(2025, 2, 15), window),
    "Start date inclusive"
  );
  assert.ok(isDateInWindow(new Date(2025, 3, 5), window), "End date inclusive");
  assert.ok(
    !isDateInWindow(new Date(2025, 2, 14), window),
    "Day before start is false"
  );
  assert.ok(
    !isDateInWindow(new Date(2025, 3, 6), window),
    "Day after end is false"
  );
  console.log(
    "✓ Passed: Boundary dates (start, end, day before, day after) evaluated properly"
  );
}

console.log("\nALL 5 SEASONAL BANNER TESTS PASSED SUCCESSFULLY! 🎉\n");
