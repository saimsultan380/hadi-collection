import { z } from "zod";

// =============================================================================
// TYPE DEFINITIONS — CUSTOMER REVIEWS
// Supports product-level ratings, breakdowns, moderation, and photo attachments.
// =============================================================================

export interface Review {
  id: string;
  productId?: string;
  productSlug: string;
  name: string;
  rating: number; // 1 - 5
  title: string;
  body: string;
  text: string; // compatibility alias for body
  photos?: string[];
  isVerifiedBuyer: boolean;
  createdAt: string;
  approved: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewApiResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export const createReviewSchema = z.object({
  productId: z.string().optional(),
  productSlug: z.string().min(1, "Product slug is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, "Review title is required").max(100),
  body: z.string().optional(),
  text: z.string().optional(),
  photos: z.array(z.string()).optional().default([]),
  honeypot: z.string().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
