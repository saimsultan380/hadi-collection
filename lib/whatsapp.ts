/**
 * =============================================================================
 * SAZAIRA — WHATSAPP INTEGRATION UTILITIES
 * =============================================================================
 * Generates direct wa.me deep links pre-filled with order confirmation summaries,
 * payment proof notifications, and general customer support inquiries.
 *
 * NOTE: Replace SAZAIRA_WHATSAPP_PHONE with your brand's official WhatsApp Business
 * phone number (in international format without '+' or leading zeros, e.g. 923037321336).
 * =============================================================================
 */

// ── Business WhatsApp Number & Single Source of Truth ─────────────────────────
// International format without '+' or leading zeros (for wa.me links, tel:, API)
export const WHATSAPP_NUMBER = "923309862474";

// Visible text display formats
export const WHATSAPP_DISPLAY_LOCAL = "0330 9862474";
export const WHATSAPP_DISPLAY_INTERNATIONAL = "+92 330 9862474";

// Structured data telephone format for JSON-LD (with +)
export const WHATSAPP_TELEPHONE_JSON_LD = "+923309862474";

// Format: Country code (92 for Pakistan) + 10-digit mobile number without leading 0
export const SAZAIRA_WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || WHATSAPP_NUMBER;

/**
 * Helper to build a sanitized wa.me deep link with pre-filled encoded text.
 */
export function buildWhatsAppLink(
  message: string,
  phoneNumber: string = SAZAIRA_WHATSAPP_PHONE
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface OrderWhatsAppDetails {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    selectedVariant?: {
      colorName: string;
      colorHex?: string;
    };
  }>;
}

/**
 * Formats a clean, readable WhatsApp text message for order confirmation.
 */
export function formatOrderWhatsAppMessage(
  order: OrderWhatsAppDetails
): string {
  const itemsText = order.items
    .map((item) => {
      const variantStr = item.selectedVariant?.colorName
        ? ` (${item.selectedVariant.colorName})`
        : "";
      return `• ${item.name}${variantStr} x ${item.quantity} — PKR ${(
        item.price * item.quantity
      ).toLocaleString("en-PK")}`;
    })
    .join("\n");

  const paymentLabel =
    order.paymentMethod === "cash-on-delivery" || order.paymentMethod === "cod"
      ? "Cash on Delivery (COD)"
      : "Bank Transfer / EasyPaisa";

  return `Salam Hadi Collection!
I have placed an order on your website.

*Order #:* ${order.orderNumber}
*Customer Name:* ${order.customerName}
*Phone:* ${order.phone}
*Delivery City:* ${order.city}
*Address:* ${order.address}
*Payment Method:* ${paymentLabel}

*Items Ordered:*
${itemsText}

*Total Amount:* PKR ${order.total.toLocaleString("en-PK")}

Please confirm my order and share dispatch updates here. Thank you!`;
}

/**
 * Creates a WhatsApp deep link pre-filled with the order confirmation summary.
 */
export function createOrderWhatsAppLink(
  order: OrderWhatsAppDetails,
  phoneNumber: string = SAZAIRA_WHATSAPP_PHONE
): string {
  const message = formatOrderWhatsAppMessage(order);
  return buildWhatsAppLink(message, phoneNumber);
}

/**
 * Creates an order help WhatsApp deep link with reference, items and total (NO email).
 */
export function createOrderHelpWhatsAppLink(
  order: {
    orderNumber: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      selectedVariant?: { colorName: string };
    }>;
    total: number;
  },
  phoneNumber: string = SAZAIRA_WHATSAPP_PHONE
): string {
  const itemsText = order.items
    .map((item) => {
      const variantStr = item.selectedVariant?.colorName
        ? ` (${item.selectedVariant.colorName})`
        : "";
      return `• ${item.name}${variantStr} x ${item.quantity} — PKR ${(
        item.price * item.quantity
      ).toLocaleString("en-PK")}`;
    })
    .join("\n");

  const message = `Salam Hadi Collection!
I need help regarding my order.

*Order Ref:* ${order.orderNumber}

*Items:*
${itemsText}

*Total Amount:* PKR ${order.total.toLocaleString("en-PK")}

Please assist me. Thank you!`;

  return buildWhatsAppLink(message, phoneNumber);
}

/**
 * Creates a WhatsApp deep link specifically for sending payment transfer screenshot.
 */
export function createPaymentProofWhatsAppLink(
  orderNumber: string,
  total: number,
  phoneNumber: string = SAZAIRA_WHATSAPP_PHONE
): string {
  const message = `Salam Hadi Collection!
I have made the bank transfer / EasyPaisa payment for my order.

*Order #:* ${orderNumber}
*Amount Paid:* PKR ${total.toLocaleString("en-PK")}

Attached is my payment screenshot for verification.`;

  return buildWhatsAppLink(message, phoneNumber);
}

export interface ProductWhatsAppOrderDetails {
  productName: string;
  productSlug?: string;
  price: number;
  quantity: number;
  selectedVariant?: {
    colorName: string;
    colorHex?: string;
  } | null;
}

/**
 * Creates a WhatsApp deep link pre-filled with single product order details.
 */
export function createDirectProductWhatsAppLink(
  details: ProductWhatsAppOrderDetails,
  phoneNumber: string = SAZAIRA_WHATSAPP_PHONE
): string {
  const variantText = details.selectedVariant?.colorName
    ? `\n*Color:* ${details.selectedVariant.colorName}`
    : "";
  const totalPrice = (details.price * details.quantity).toLocaleString("en-PK");
  const unitPrice = details.price.toLocaleString("en-PK");
  const productUrl = details.productSlug
    ? `\n*Product Link:* https://hadicollection.pk/shop/${details.productSlug}`
    : "";

  const message = `Salam Hadi Collection!
I want to order this suit:

*Product:* ${details.productName}${variantText}
*Quantity:* ${details.quantity}
*Price:* PKR ${unitPrice}${details.quantity > 1 ? ` (Total: PKR ${totalPrice})` : ""}${productUrl}

Please confirm availability and let me know how to proceed with the order. Thank you!`;

  return buildWhatsAppLink(message, phoneNumber);
}

/**
 * Creates a general customer support WhatsApp link.
 */
export function getGeneralWhatsAppLink(
  customMessage?: string,
  phoneNumber: string = SAZAIRA_WHATSAPP_PHONE
): string {
  const defaultMsg =
    "Salam Hadi Collection! I have a question about your unstitched suits.";
  const message = customMessage || defaultMsg;
  return buildWhatsAppLink(message, phoneNumber);
}
