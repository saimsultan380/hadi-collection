import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import path from "path";

// =============================================================================
// POST /api/testimonials/upload
// =============================================================================
// Uploads a WhatsApp screenshot to Supabase Storage bucket
// "testimonial-screenshots". Uses the service-role key (server-side only).
// Returns the public URL of the uploaded image.
// =============================================================================

const BUCKET = "testimonial-screenshots";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("screenshot") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PNG, JPEG, or WEBP image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image file exceeds 10 MB limit." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name) || ".png";
    const fileName = `chat_${Date.now()}_${randomBytes(4).toString("hex")}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const sb = getAdminClient();

    const { error: uploadError } = await sb.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload] Supabase storage upload error:", uploadError.message);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error("POST /api/testimonials/upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload screenshot image" },
      { status: 500 }
    );
  }
}
