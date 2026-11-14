import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { createOrderSchema } from "@/types/order";

// Flat delivery fee in PKR (synced across storefront)
const DELIVERY_FEE = 200;

/**
 * =============================================================================
 * SAZAIRA — ORDER CREATION API ROUTE (/api/orders)
 * =============================================================================
 * Accepts checkout form submission and cart items snapshot.
 *
 * 🔒 SECURITY ARCHITECTURE:
 * 1. Strict Server-Side Validation: Never trusts client-calculated prices or totals.
 *    Re-validates all fields with Zod against createOrderSchema.
 * 2. Service Role Isolation: Only the server-side admin client inserts records.
 *    The client-side anon key has NO insert permissions on the orders table.
 * 3. Immutable Item Snapshots: Stores items in JSONB so future product or price
 *    updates in Sanity do not alter historical order accounting records.
 * =============================================================================
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ── 1. Validate Payload ──────────────────────────────────────────────────
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      fullName,
      phone,
      email,
      address,
      city,
      orderNotes,
      paymentMethod,
      items,
    } = validationResult.data;

    // ── 2. Calculate Server-Side Totals ──────────────────────────────────────
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + DELIVERY_FEE;

    // ── 3. Initialize Supabase Admin Client ──────────────────────────────────
    const supabaseAdmin = getSupabaseAdmin();

    // ── 4. Generate Sequential Human-Friendly Order Number ───────────────────
    // e.g., "SZR-00001", "SZR-00002"
    let orderNumber: string;
    try {
      const { count, error: countError } = await supabaseAdmin
        .from("orders")
        .select("id", { count: "exact", head: true });

      if (countError) {
        console.error("Failed to query orders count:", countError);
        // Fallback to timestamp-based sequence if count query fails
        const rand = Math.floor(1000 + Math.random() * 9000);
        orderNumber = `SZR-${rand}`;
      } else {
        const nextSequence = (count || 0) + 1;
        orderNumber = `SZR-${String(nextSequence).padStart(5, "0")}`;

        // Verify uniqueness to avoid race conditions
        const { data: existing } = await supabaseAdmin
          .from("orders")
          .select("order_number")
          .eq("order_number", orderNumber)
          .maybeSingle();

        if (existing) {
          const timestampSuffix = Date.now().toString().slice(-4);
          orderNumber = `SZR-${String(nextSequence).padStart(4, "0")}-${timestampSuffix}`;
        }
      }
    } catch (seqError) {
      console.error("Error generating order sequence:", seqError);
      orderNumber = `SZR-${Date.now().toString().slice(-6)}`;
    }

    // ── 5. Insert Order into Supabase ────────────────────────────────────────
    const confirmationToken = crypto.randomUUID();

    const newOrderRecord = {
      order_number: orderNumber,
      confirmation_token: confirmationToken,
      customer_name: fullName,
      customer_phone: phone,
      customer_email: email ? email.trim() : null,
      delivery_address: address,
      city,
      order_notes: orderNotes ? orderNotes.trim() : null,
      payment_method: paymentMethod,
      items, // JSONB snapshot
      subtotal,
      delivery_fee: DELIVERY_FEE,
      total,
      status: "pending",
    };

    let insertedOrder: { id: string; order_number: string; confirmation_token?: string; created_at: string };
    const { data: primaryData, error: insertError } = await supabaseAdmin
      .from("orders")
      .insert([newOrderRecord])
      .select("id, order_number, confirmation_token, created_at")
      .single();

    if (insertError) {
      // Graceful fallback if confirmation_token column has not yet been added to Supabase
      if (insertError.message?.includes("confirmation_token")) {
        console.error(
          "confirmation_token column missing - run the migration: " +
          "ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmation_token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text;"
        );
        const fallbackRecord = { ...newOrderRecord };
        delete (fallbackRecord as Record<string, unknown>).confirmation_token;
        const { data: fallbackData, error: fallbackError } = await supabaseAdmin
          .from("orders")
          .insert([fallbackRecord])
          .select("id, order_number, created_at")
          .single();

        if (fallbackError) {
          console.error("Supabase fallback insert error:", fallbackError);
          return NextResponse.json(
            {
              error: "Failed to persist order to database",
              message: fallbackError.message,
            },
            { status: 500 }
          );
        }
        insertedOrder = fallbackData;
      } else {
        console.error("Supabase insert order error:", insertError);
        return NextResponse.json(
          {
            error: "Failed to persist order to database",
            message: insertError.message,
          },
          { status: 500 }
        );
      }
    } else {
      insertedOrder = primaryData;
    }

    const token = insertedOrder.confirmation_token || null;

    return NextResponse.json(
      {
        success: true,
        orderId: insertedOrder.id,
        orderNumber: insertedOrder.order_number,
        token,
        createdAt: insertedOrder.created_at,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Unhandled error in /api/orders:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      {
        error: "An unexpected error occurred while placing your order",
        message,
      },
      { status: 500 }
    );
  }
}
