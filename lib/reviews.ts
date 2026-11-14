import type { Review, ReviewStats } from "@/types/review";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// =============================================================================
// REVIEWS SERVER HELPER
// Fetches approved reviews from Supabase and calculates rating breakdown.
// Stores and retrieves data strictly via Supabase; never uses local files.
// =============================================================================

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

export async function getApprovedReviewsForProduct(
  productSlug: string,
  productId?: string
): Promise<{ reviews: Review[]; stats: ReviewStats }> {
  const emptyStats: ReviewStats = {
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  if (!productSlug && !productId) {
    return { reviews: [], stats: emptyStats };
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const slug = productSlug || productId;

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .eq("product_slug", slug)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getApprovedReviewsForProduct] Supabase query error:", error);
      return { reviews: [], stats: emptyStats };
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return { reviews: [], stats: emptyStats };
    }

    const reviews: Review[] = data.map((row: Record<string, unknown>) => {
      const reviewText = String(row.body || row.text || "");
      return {
        id: String(row.id || ""),
        productId: String(row.product_id || productId || ""),
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

    return { reviews, stats: computeStats(reviews) };
  } catch (err) {
    console.error("[getApprovedReviewsForProduct] Unexpected error:", err);
    return { reviews: [], stats: emptyStats };
  }
}
