export type TestimonialType = "text" | "whatsapp_screenshot";

export interface Testimonial {
  id: string;
  type: TestimonialType;
  customerName: string; // First name or initials only
  city?: string;
  rating?: number; // 1-5, optional
  text?: string; // For text type
  screenshotImage?: string; // URL/path for whatsapp_screenshot type
  productLink?: string; // Optional product URL or path
  isVerifiedBuyer: boolean;
  consentConfirmed: boolean; // REQUIRED true before publishing
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}
