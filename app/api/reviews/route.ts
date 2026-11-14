import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Review, ReviewStats } from "@/types/review";

/**
 * =============================================================================
 * SAZAIRA — CUSTOMER REVIEWS API ROUTE (/api/reviews)
 * =============================================================================
 * GET: Fetch approved reviews & computed rating breakdown from Supabase.
 * POST: Submit a new customer review (saved to Supabase with approved = false).
 *
 * Security & Anti-Spam:
 *   - In-memory sliding rate limit: max 3 reviews per IP per hour.
 *   - Hidden honeypot field detection.
 *   - HTML stripping & rigorous length validations.
 *   - Server-only service role client writes to Supabase.
 *   - NEVER writes to the local filesystem (compatible with Vercel serverless).
 * =============================================================================
 */

// Simple in-memory rate limiter: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REVIEWS_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter out timestamps older than the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REVIEWS_PER_WINDOW) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function stripHtml(input: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").trim();
}

function computeStats(reviews: Review[]): ReviewStats {
  const totalReviews = reviews.length;
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  let totalScore = 0;

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    ratingBreakdown[star] = (ratingBreakdown[star] || 0) + 1;
    totalScore += r.rating;
  });

  const averageRating =
    totalReviews > 0 ? Number((totalScore / totalReviews).toFixed(1)) : 0;

  return { averageRating, totalReviews, ratingBreakdown };
}

// =============================================================================
// GET /api/reviews?slug=xxx
// =============================================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || searchParams.get("productSlug") || searchParams.get("productId") || "";

    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .eq("product_slug", slug)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Reviews GET Error]:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    const approvedReviews: Review[] = (data || []).map((row: Record<string, unknown>) => {
      const reviewText = String(row.body || row.text || "");
      return {
        id: String(row.id || ""),
        productSlug: String(row.product_slug || slug),
        name: String(row.name || "Anonymous"),
        rating: Number(row.rating) || 5,
        title: String(row.title || ""),
        body: reviewText,
        text: reviewText,
        photos: Array.isArray(row.photos) ? (row.photos as string[]) : [],
        isVerifiedBuyer: Boolean(row.is_verified_buyer),
        createdAt: String(row.created_at || new Date().toISOString()),
        approved: Boolean(row.approved),
      };
    });

    const stats = computeStats(approvedReviews);

    return NextResponse.json({ reviews: approvedReviews, stats });
  } catch (error) {
    console.error("[Reviews GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// =============================================================================
// POST /api/reviews — submit a new review (pending approval)
// =============================================================================
export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";

    if (ip !== "unknown-ip" && isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many review submissions. Please try again in an hour." },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await request.json();

    // 3. Honeypot check (hidden field to block bots)
    const honeypot = body.honeypot || body.website || body.hp || "";
    if (honeypot && String(honeypot).trim() !== "") {
      console.warn("[Reviews POST Spam Blocked]: Honeypot field filled by bot from IP", ip);
      return NextResponse.json(
        { error: "We could not submit your review at this time. Please try again." },
        { status: 400 }
      );
    }

    // 4. Extract and sanitize inputs
    const rawProductSlug = String(body.productSlug || body.productId || "");
    const rawName = String(body.name || "");
    const rawRating = Number(body.rating);
    const rawTitle = String(body.title || "");
    const rawBody = String(body.body || body.text || "");
    const rawPhotos = Array.isArray(body.photos) ? body.photos : [];

    const productSlug = stripHtml(rawProductSlug);
    const name = stripHtml(rawName);
    const title = stripHtml(rawTitle);
    const reviewBody = stripHtml(rawBody);

    // 5. Input Validations
    if (!productSlug) {
      return NextResponse.json(
        { error: "Product is required." },
        { status: 400 }
      );
    }

    if (!name || name.length < 2 || name.length > 60) {
      return NextResponse.json(
        { error: "Name must be between 2 and 60 characters." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rawRating) || rawRating < 1 || rawRating > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    if (!title || title.length < 2 || title.length > 100) {
      return NextResponse.json(
        { error: "Review title must be between 2 and 100 characters." },
        { status: 400 }
      );
    }

    if (!reviewBody || reviewBody.length < 5 || reviewBody.length > 1000) {
      return NextResponse.json(
        { error: "Review details must be between 5 and 1,000 characters." },
        { status: 400 }
      );
    }

    // Validate photo URLs (filter non-strings, limit to 5)
    const photos: string[] = rawPhotos
      .filter((p: unknown) => typeof p === "string" && (p.startsWith("http") || p.startsWith("data:image/")))
      .slice(0, 5);

    // 6. Insert into Supabase with approved = false
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        product_slug: productSlug,
        name,
        rating: rawRating,
        title,
        body: reviewBody,
        photos,
        is_verified_buyer: false,
        approved: false,
      })
      .select()
      .single();

    if (error) {
      console.error("[Reviews POST Error]: Supabase insert error:", error);
      return NextResponse.json(
        { error: "We could not submit your review at this time. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review will appear after we approve it.",
      id: data?.id,
    });
  } catch (error) {
    console.error("[Reviews POST Error]: Unexpected error:", error);
    return NextResponse.json(
      { error: "We could not submit your review at this time. Please try again." },
      { status: 500 }
    );
  }
}
