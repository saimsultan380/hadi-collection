import type { Testimonial } from "@/types/testimonial";

/**
 * Local testimonials layer — no Supabase required.
 * Storefront reads return empty. Admin writes are disabled.
 */

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return [];
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  return [];
}

export async function saveTestimonial(
  testimonial: Testimonial
): Promise<Testimonial> {
  throw new Error(
    "Testimonials storage is not configured. This storefront does not use Supabase."
  );
}

export async function deleteTestimonial(_id: string): Promise<boolean> {
  return false;
}

export async function reorderTestimonials(
  _orderedIds: string[]
): Promise<Testimonial[]> {
  return [];
}
