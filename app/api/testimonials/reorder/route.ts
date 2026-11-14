import { NextResponse } from "next/server";
import { reorderTestimonials } from "@/lib/testimonials";

export async function POST(request: Request) {
  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "orderedIds array is required" }, { status: 400 });
    }

    const reordered = await reorderTestimonials(orderedIds);
    return NextResponse.json(reordered);
  } catch (error) {
    console.error("POST /api/testimonials/reorder error:", error);
    return NextResponse.json({ error: "Failed to reorder testimonials" }, { status: 500 });
  }
}
