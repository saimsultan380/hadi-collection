import { NextResponse } from "next/server";
import {
  getAllTestimonials,
  getPublishedTestimonials,
  saveTestimonial,
} from "@/lib/testimonials";
import type { Testimonial } from "@/types/testimonial";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const testimonials = publishedOnly
      ? await getPublishedTestimonials()
      : await getAllTestimonials();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.type || !["text", "whatsapp_screenshot"].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid type: must be "text" or "whatsapp_screenshot"' },
        { status: 400 }
      );
    }

    if (!body.customerName || !body.customerName.trim()) {
      return NextResponse.json(
        { error: "Customer name (first name or initials) is required" },
        { status: 400 }
      );
    }

    if (body.type === "text" && (!body.text || !body.text.trim())) {
      return NextResponse.json(
        { error: "Review text is required for text testimonials" },
        { status: 400 }
      );
    }

    if (body.type === "whatsapp_screenshot" && (!body.screenshotImage || !body.screenshotImage.trim())) {
      return NextResponse.json(
        { error: "Screenshot image is required for WhatsApp screenshot testimonials" },
        { status: 400 }
      );
    }

    // Strict Consent Enforcement
    const consentConfirmed = Boolean(body.consentConfirmed);
    const isPublished = Boolean(body.isPublished);

    if (isPublished && !consentConfirmed) {
      return NextResponse.json(
        {
          error:
            'Publishing blocked: Customer consent ("The customer agreed to be shown on the website") must be confirmed before publishing.',
        },
        { status: 400 }
      );
    }

    const testimonial: Testimonial = {
      id: body.id || `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: body.type,
      customerName: body.customerName.trim(),
      city: body.city?.trim() || undefined,
      rating: body.rating ? Math.min(5, Math.max(1, Number(body.rating))) : undefined,
      text: body.text?.trim() || undefined,
      screenshotImage: body.screenshotImage || undefined,
      productLink: body.productLink?.trim() || undefined,
      isVerifiedBuyer: Boolean(body.isVerifiedBuyer),
      consentConfirmed,
      isPublished,
      sortOrder: Number(body.sortOrder) || 1,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const saved = await saveTestimonial(testimonial);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create testimonial";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 });
    }

    const consentConfirmed = Boolean(body.consentConfirmed);
    const isPublished = Boolean(body.isPublished);

    if (isPublished && !consentConfirmed) {
      return NextResponse.json(
        {
          error:
            'Publishing blocked: Customer consent ("The customer agreed to be shown on the website") must be confirmed before publishing.',
        },
        { status: 400 }
      );
    }

    const testimonial: Testimonial = {
      id: body.id,
      type: body.type,
      customerName: body.customerName?.trim() || "Customer",
      city: body.city?.trim() || undefined,
      rating: body.rating ? Math.min(5, Math.max(1, Number(body.rating))) : undefined,
      text: body.text?.trim() || undefined,
      screenshotImage: body.screenshotImage || undefined,
      productLink: body.productLink?.trim() || undefined,
      isVerifiedBuyer: Boolean(body.isVerifiedBuyer),
      consentConfirmed,
      isPublished,
      sortOrder: Number(body.sortOrder) || 1,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const updated = await saveTestimonial(testimonial);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update testimonial";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
