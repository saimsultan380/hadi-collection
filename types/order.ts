import { z } from "zod";
import type { ProductImage } from "@/types/product";

// =============================================================================
// SAZAIRA CART & CHECKOUT TYPE DEFINITIONS
// =============================================================================

export interface CartItem {
  id: string; // Unique composite identifier: `${slug}-${variantName || 'default'}`
  productSlug: string;
  name: string;
  image?: ProductImage;
  price: number;
  selectedVariant?: {
    colorName: string;
    colorHex?: string;
  };
  quantity: number;
}

export type PaymentMethod = "cash-on-delivery" | "bank-transfer";

export const PAKISTANI_CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Other",
] as const;

/**
 * Pakistani Phone Number Regex
 * Accepts formats like: 03001234567, 0300-1234567, +923001234567, 923001234567
 */
export const pakistaniPhoneRegex =
  /^(?:(?:\+|00)?92[\s-]?|0)?3[0-9]{2}[\s-]?[0-9]{7}$/;

export const checkoutFormSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Please enter your full name (minimum 3 characters)")
      .max(80, "Full name cannot exceed 80 characters"),
    phone: z
      .string()
      .min(10, "Please enter a valid Pakistani phone number (e.g. 03001234567)")
      .regex(
        pakistaniPhoneRegex,
        "Please enter a valid Pakistani mobile number (e.g. 03001234567)"
      ),
    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .min(
        8,
        "Please enter your complete street address for delivery (house/apartment #, street, area)"
      )
      .max(200, "Address cannot exceed 200 characters"),
    city: z.string().min(1, "Please select your delivery city"),
    otherCity: z
      .string()
      .max(80, "City name cannot exceed 80 characters")
      .optional(),
    orderNotes: z
      .string()
      .max(300, "Order notes cannot exceed 300 characters")
      .optional(),
    paymentMethod: z.enum(["cash-on-delivery", "bank-transfer"]),
  })
  .superRefine((data, ctx) => {
    if (
      data.city === "Other" &&
      (!data.otherCity || data.otherCity.trim().length < 2)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter your city name (minimum 2 characters)",
        path: ["otherCity"],
      });
    }
  });

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Item snapshot stored inside the JSONB column in Supabase.
 * Preserves product state, pricing, and variant at the moment of purchase.
 */
export const orderItemSnapshotSchema = z.object({
  id: z.string(),
  productSlug: z.string(),
  name: z.string(),
  image: z.any().optional(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  selectedVariant: z
    .object({
      colorName: z.string(),
      colorHex: z.string().optional(),
    })
    .optional(),
});

export type OrderItemSnapshot = z.infer<typeof orderItemSnapshotSchema>;

/**
 * Full server-side order creation validation schema.
 */
export const createOrderSchema = checkoutFormSchema.extend({
  items: z
    .array(orderItemSnapshotSchema)
    .min(1, "Order must contain at least one item"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "shipped"
  | "delivered";

/**
 * Supabase `orders` table row schema.
 */
export interface DbOrder {
  id: string;
  order_number: string;
  confirmation_token?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  city: string;
  order_notes: string | null;
  payment_method: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
}

/**
 * Frontend Order interface.
 */
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItemSnapshot[];
  customer: CheckoutFormData;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
}
