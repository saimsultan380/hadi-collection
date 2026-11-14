import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products";

// =============================================================================
// SAZAIRA PRODUCT SEARCH API
// Lightweight search endpoint for live header overlay and instant querying.
// =============================================================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProducts(query);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("[Search API Error]:", error);
    return NextResponse.json(
      { error: "Failed to execute search query", products: [] },
      { status: 500 }
    );
  }
}
