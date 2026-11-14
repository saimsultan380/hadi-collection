import { NextResponse } from "next/server";

/**
 * Lightweight health check — no database required.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "hadi-collection-api",
    timestamp: new Date().toISOString(),
    database: "not-required",
  });
}
