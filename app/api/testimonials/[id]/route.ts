import { NextResponse } from "next/server";
import { deleteTestimonial } from "@/lib/testimonials";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing testimonial ID" }, { status: 400 });
    }

    const deleted = await deleteTestimonial(id);
    if (!deleted) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/testimonials/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
