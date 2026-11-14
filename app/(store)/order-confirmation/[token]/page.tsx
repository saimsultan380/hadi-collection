import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SafeCartImage } from "@/components/cart/SafeCartImage";
import {
  createOrderHelpWhatsAppLink,
  createPaymentProofWhatsAppLink,
  SAZAIRA_WHATSAPP_PHONE,
} from "@/lib/whatsapp";
import type { DbOrder } from "@/types/order";
import { OrderConfirmationActions } from "./OrderConfirmationActions";
import { checkOrderLookupRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{
    token: string;
  }>;
  searchParams?: Promise<{
    ref?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Order Received | Hadi Collection",
    description: "Order receipt and confirmation at Hadi Collection.",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

const BANK_DETAILS = {
  bankName: "Meezan Bank",
  accountTitle: "Hadi Collection",
  accountNumber: "03012345678",
  ibanNumber: "PK00MEZN0001234567890001",
  easypaisaNumber: "03037321336",
};

/**
 * Mask phone numbers for customer privacy (e.g. +92 349 ****223)
 */
function maskPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("923") && digits.length === 12) {
    const code = digits.slice(2, 5);
    const end = digits.slice(-3);
    return `+92 ${code} ****${end}`;
  }
  if (digits.startsWith("03") && digits.length === 11) {
    const code = digits.slice(1, 4);
    const end = digits.slice(-3);
    return `+92 ${code} ****${end}`;
  }
  if (digits.length >= 7) {
    const start = digits.slice(0, Math.min(3, digits.length - 4));
    const end = digits.slice(-3);
    return `${start} ****${end}`;
  }
  return rawPhone;
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/**
 * Friendly fallback page shown if database/server lookup encounters an error,
 * or if order was saved but token is missing.
 */
function FriendlyOrderReceivedView({ orderRef }: { orderRef?: string }) {
  const phone = SAZAIRA_WHATSAPP_PHONE.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Salam Hadi Collection! I placed an order${orderRef ? ` (Ref: ${orderRef})` : ""}, but could not load the confirmation page. Please confirm my order details.`
  )}`;

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="border border-[#E5E5E5] bg-white p-8 text-center space-y-4">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center border border-[#2E7D32]/30 bg-[#2E7D32]/10">
              <CheckCircle2
                className="h-8 w-8 text-[#2E7D32]"
                strokeWidth={1.75}
              />
            </div>
            <h1 className="text-2xl font-semibold uppercase tracking-[0.02em] text-black md:text-3xl">
              Order Received!
            </h1>
            <p className="mx-auto max-w-md text-sm leading-[1.6] text-[#6B6B6B]">
              We received your order but could not load this page.
              {orderRef ? (
                <>
                  {" "}Your order reference is{" "}
                  <strong className="text-black font-mono">{orderRef}</strong>.
                </>
              ) : null}
              {" "}Please message us on WhatsApp.
            </p>
            <div className="mx-auto mt-2 max-w-md space-y-1 text-xs leading-[1.5] text-[#6B6B6B]">
              <p>
                We will message you on WhatsApp to confirm your order.
              </p>
              <p>
                If this number is wrong, please message us on WhatsApp with your order reference.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2.5 border border-[#25D366] bg-[#25D366] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1ebe5d] hover:border-[#1ebe5d] cursor-pointer"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 fill-white" />
                <span>Message Us on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-black hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue Browsing Collection
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

/**
 * =============================================================================
 * SAZAIRA — ORDER CONFIRMATION PAGE (/order-confirmation/[token])
 * =============================================================================
 * Un-guessable token-based order confirmation lookup with service role isolation,
 * rate limiting, masked phone, and privacy-first data rendering.
 * =============================================================================
 */
export default async function OrderConfirmationPage({ params, searchParams }: Props) {
  const { token } = await params;
  const search = searchParams ? await searchParams : undefined;
  const queryRef = search?.ref;

  // ── Friendly fallback route if checkout redirected without token ────────────
  if (token === "order-received" || token === "fallback") {
    return <FriendlyOrderReceivedView orderRef={queryRef} />;
  }

  // ── Reject old sequential format immediately ──────────────────────────────
  if (!token || token.startsWith("SZR-")) {
    notFound();
  }

  // ── Rate Limiting (Prevents token brute-force guessing) ────────────────────
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  if (!checkOrderLookupRateLimit(clientIp)) {
    console.warn(`Rate limit exceeded for order token lookup from IP: ${clientIp}`);
    return <FriendlyOrderReceivedView orderRef={queryRef} />;
  }

  // ── Fetch Order from Supabase by Token Only ────────────────────────────────
  let order: DbOrder | null = null;
  let serverLookupError: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("confirmation_token", token)
      .maybeSingle();

    if (error) {
      serverLookupError = error.message;
      if (error.message?.includes("confirmation_token")) {
        console.error(
          "confirmation_token column missing - run the migration: " +
          "ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmation_token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text;"
        );
      } else {
        console.error("Database error looking up order confirmation token:", error);
      }
    } else if (data) {
      order = data as DbOrder;
    }
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    serverLookupError = errMessage;
    console.error("Server error on order confirmation lookup:", err);
  }

  // ── If a server or database error occurred, show friendly fallback (NOT 404)
  if (serverLookupError) {
    return <FriendlyOrderReceivedView orderRef={queryRef} />;
  }

  // ── If query succeeded with no error but no row found -> genuinely invalid token
  if (!order) {
    notFound();
  }

  // ── Prepare WhatsApp Links ─────────────────────────────────────────────────
  const whatsappHelpUrl = createOrderHelpWhatsAppLink({
    orderNumber: order.order_number,
    items: order.items,
    total: order.total,
  });

  const isBankTransfer =
    order.payment_method === "bank-transfer" ||
    order.payment_method === "bank_transfer";

  const whatsappPaymentUrl = isBankTransfer
    ? createPaymentProofWhatsAppLink(order.order_number, order.total)
    : "";

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-2xl space-y-8">
          {/* ── Success Header ── */}
          <div className="text-center">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center border border-[#2E7D32]/30 bg-[#2E7D32]/10">
              <CheckCircle2
                className="h-8 w-8 text-[#2E7D32]"
                strokeWidth={1.75}
              />
            </div>
            <h1 className="text-2xl font-semibold uppercase tracking-[0.02em] text-black md:text-3xl">
              Order Received!
            </h1>
            <p className="mx-auto mt-2.5 max-w-md text-sm leading-[1.6] text-[#6B6B6B]">
              Thank you,{" "}
              <strong className="text-black">{order.customer_name}</strong>. We
              have received your order.
            </p>
            <div className="mx-auto mt-2 max-w-md space-y-1 text-xs leading-[1.5] text-[#6B6B6B]">
              <p>
                We will message you on WhatsApp at {maskPhone(order.customer_phone)} to confirm your order.
              </p>
              <p>
                If this number is wrong, please message us on WhatsApp with your order reference.
              </p>
            </div>
          </div>

          {/* ── Order Number Banner (Reference & Copy Ref only) ── */}
          <div className="flex flex-col items-center justify-between gap-4 border border-[#E5E5E5] bg-[#F7F7F7] p-5 sm:flex-row">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                Order Reference Number
              </span>
              <span className="font-mono text-xl font-bold tracking-wide text-black">
                {order.order_number}
              </span>
            </div>
            <OrderConfirmationActions orderNumber={order.order_number} />
          </div>

          {/* ── Optional WhatsApp Support Action ── */}
          <div className="space-y-3 border border-[#E5E5E5] bg-white p-6 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-black">
              Need Help With Your Order?
            </h2>
            <p className="mx-auto max-w-lg text-xs leading-[1.6] text-[#6B6B6B]">
              Message us on WhatsApp anytime. Your order reference is included in the message.
            </p>
            <a
              href={whatsappHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 border border-[#25D366] bg-[#25D366] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1ebe5d] hover:border-[#1ebe5d] cursor-pointer"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 fill-white" />
              <span>Message Us on WhatsApp</span>
            </a>
          </div>

          {/* ── Bank Transfer Instructions (If Applicable) ── */}
          {isBankTransfer && (
            <div className="space-y-4 border border-[#E5E5E5] bg-white p-6">
              <div className="border-b border-[#E5E5E5] pb-3">
                <span className="mb-2 inline-block border border-black bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                  Action Required
                </span>
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-black">
                  Complete Your Payment
                </h2>
                <p className="mt-1 text-xs leading-[1.6] text-[#6B6B6B]">
                  Please transfer{" "}
                  <strong className="text-black">
                    PKR {order.total.toLocaleString("en-PK")}
                  </strong>{" "}
                  to one of the accounts below and share the transaction
                  screenshot.
                </p>
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                    Bank Transfer
                  </dt>
                  <dd className="font-semibold text-black">
                    {BANK_DETAILS.bankName}
                  </dd>
                  <dd className="text-xs text-black">
                    {BANK_DETAILS.accountTitle}
                  </dd>
                  <dd className="mt-0.5 font-mono text-xs text-black">
                    Account: {BANK_DETAILS.accountNumber}
                  </dd>
                  <dd className="font-mono text-[11px] text-[#6B6B6B]">
                    IBAN: {BANK_DETAILS.ibanNumber}
                  </dd>
                </div>
                <div className="border-t border-[#E5E5E5] pt-3">
                  <dt className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                    EasyPaisa Mobile Account
                  </dt>
                  <dd className="font-mono text-sm text-black">
                    {BANK_DETAILS.easypaisaNumber} ({BANK_DETAILS.accountTitle})
                  </dd>
                </div>
              </dl>

              <div className="pt-2">
                <a
                  href={whatsappPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 border border-[#25D366] bg-[#25D366] px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1ebe5d] hover:border-[#1ebe5d] cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  Send Payment Screenshot on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* ── Order Items Summary ── */}
          <div className="space-y-4 border border-[#E5E5E5] bg-white p-6">
            <h2 className="border-b border-[#E5E5E5] pb-3 text-xs font-semibold uppercase tracking-[0.08em] text-black">
              Items Ordered ({order.items.length})
            </h2>

            <ul className="divide-y divide-[#E5E5E5]">
              {order.items.map((item, idx) => {
                const variantKey = item.selectedVariant?.colorName || "default";
                return (
                  <li
                    key={`${item.id || item.productSlug}-${idx}-${variantKey}`}
                    className="flex items-center gap-4 py-3"
                  >
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7]">
                      <SafeCartImage
                        image={item.image}
                        alt={item.name}
                        width={120}
                        height={150}
                        sizes="56px"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="truncate text-sm font-medium text-black">
                        {item.name}
                      </h3>
                      {item.selectedVariant?.colorName && (
                        <p className="text-xs text-[#6B6B6B]">
                          Color: {item.selectedVariant.colorName}
                        </p>
                      )}
                      <p className="text-xs text-[#6B6B6B]">
                        Qty: {item.quantity} × PKR{" "}
                        {item.price.toLocaleString("en-PK")}
                      </p>
                    </div>

                    <div className="flex items-center text-sm font-medium text-black">
                      PKR {(item.price * item.quantity).toLocaleString("en-PK")}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Price Calculations */}
            <dl className="space-y-2 border-t border-[#E5E5E5] pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#6B6B6B]">Subtotal</dt>
                <dd className="font-medium text-black">
                  PKR {order.subtotal.toLocaleString("en-PK")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B6B6B]">Delivery Fee</dt>
                <dd className="font-medium text-black">
                  PKR {order.delivery_fee.toLocaleString("en-PK")}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[#E5E5E5] pt-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-black">
                  Total Amount
                </dt>
                <dd className="text-lg font-semibold text-black">
                  PKR {order.total.toLocaleString("en-PK")}
                </dd>
              </div>
            </dl>
          </div>

          {/* ── Delivery Details (Aligned Left Edge, Masked Phone, No Email) ── */}
          <div className="space-y-3 border border-[#E5E5E5] bg-white p-6">
            <h2 className="border-b border-[#E5E5E5] pb-3 text-xs font-semibold uppercase tracking-[0.08em] text-black">
              Delivery & Customer Information
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                  Full Name
                </dt>
                <dd className="font-medium text-black">
                  {order.customer_name}
                </dd>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                  Phone Number
                </dt>
                <dd className="font-medium text-black">
                  {maskPhone(order.customer_phone)}
                </dd>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                  City
                </dt>
                <dd className="font-medium text-black">
                  {order.city}
                </dd>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                  Delivery Address
                </dt>
                <dd className="font-medium text-black">
                  {order.delivery_address}
                </dd>
              </div>
              <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                  Payment Mode
                </dt>
                <dd className="font-medium text-black">
                  {isBankTransfer
                    ? "Bank Transfer / EasyPaisa"
                    : "Cash on Delivery (COD)"}
                </dd>
              </div>
              {order.order_notes && (
                <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                    Order Notes
                  </dt>
                  <dd className="text-black italic">{order.order_notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* ── Navigation / Back to Shop ── */}
          <div className="pt-2 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-black hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue Browsing Collection
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
