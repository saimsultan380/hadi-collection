"use client";

import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShoppingBag,
  ChevronDown,
  MessageCircle,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SafeCartImage } from "@/components/cart/SafeCartImage";
import { createOrderWhatsAppLink } from "@/lib/whatsapp";
import {
  checkoutFormSchema,
  PAKISTANI_CITIES,
  type CheckoutFormData,
  type PaymentMethod,
} from "@/types/order";

// =============================================================================
// SAZAIRA — CHECKOUT PAGE (/checkout)
// Zod-validated checkout form connected to Supabase order persistence.
// =============================================================================

const DELIVERY_FEE = 200; // PKR flat

const BANK_DETAILS = {
  bankName: "Meezan Bank",
  accountTitle: "Hadi Collection",
  accountNumber: "03012345678",
  ibanNumber: "PK00MEZN0001234567890001",
  easypaisaNumber: "03037321336",
};

// ── Helper: Field Error Message ──────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[#A6843D] mt-1 font-sans text-xs" role="alert">
      {message}
    </p>
  );
}

// ── Helper: Copy-to-Clipboard Button ─────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[#6B6B6B] hover:text-black ml-2 transition-colors"
      aria-label={`Copy ${value}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[#2E7D32]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      paymentMethod: "cash-on-delivery",
      city: "",
      orderNotes: "",
    },
  });

  const paymentMethod = watch("paymentMethod") as PaymentMethod;
  const selectedCity = watch("city");
  const grandTotal = totalPrice + DELIVERY_FEE;

  // ── Form Submit Handler ──────────────────────────────────────────────────
  const onSubmit = async (data: CheckoutFormData) => {
    setSubmissionError(null);

    // If "Other" was selected, replace city with the typed value
    const { otherCity, ...rest } = data;
    const submissionData = {
      ...rest,
      city: data.city === "Other" && otherCity ? otherCity.trim() : data.city,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...submissionData,
          items: items.map((item) => ({
            id: item.id,
            productSlug: item.productSlug,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedVariant: item.selectedVariant,
            image: item.image,
          })),
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(
          resData.error ||
            resData.message ||
            "Failed to process your order. Please check your details and try again."
        );
      }

      // Order created successfully — clear local cart & navigate to confirmation
      clearCart();
      if (resData.token) {
        router.push(`/order-confirmation/${resData.token}`);
      } else if (resData.orderNumber) {
        router.push(
          `/order-confirmation/order-received?ref=${encodeURIComponent(
            resData.orderNumber
          )}`
        );
      } else {
        router.push("/order-confirmation/order-received");
      }
    } catch (err: unknown) {
      console.error("Order submission failure:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong placing your order — please try again or contact us on WhatsApp.";
      setSubmissionError(message);
    }
  };

  // ── Redirect / Empty State if cart empty ─────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Container>
          <div className="flex flex-col items-center py-24 text-center">
            <ShoppingBag className="mb-4 h-10 w-10 stroke-1 text-black" />
            <h2 className="text-lg font-semibold uppercase tracking-[0.08em] text-black">
              Your Bag is Empty
            </h2>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Add some items before checking out.
            </p>
            <div className="mt-6">
              <Link href="/shop">
                <Button variant="primary" size="md">
                  Browse the Collection
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Fallback WhatsApp message in case of technical issues
  const currentFormData = getValues();
  const whatsappFallbackUrl = createOrderWhatsAppLink({
    orderNumber: "PENDING-DIRECT",
    customerName: currentFormData.fullName || "Valued Customer",
    phone: currentFormData.phone || "",
    address: currentFormData.address || "",
    city: currentFormData.city || "",
    paymentMethod: currentFormData.paymentMethod || "cash-on-delivery",
    total: grandTotal,
    items,
  });

  // ── CHECKOUT FORM ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white py-10 md:py-16">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-black hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Bag
          </Link>
          <h1 className="text-2xl font-semibold tracking-[0.02em] uppercase text-black md:text-3xl">
            Checkout
          </h1>
        </div>

        {/* ── Submission Error Banner ── */}
        {submissionError && (
          <div className="mb-8 border border-black bg-[#F7F7F7] p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-black" />
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-black">
                  Unable to Place Order
                </h2>
                <p className="text-sm leading-[1.6] text-black">
                  {submissionError}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="inline-flex items-center gap-1.5 border border-black bg-black px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#222]"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    Retry Order
                  </button>
                  <a
                    href={whatsappFallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-[#25D366] bg-[#25D366] px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1ebe5e]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Order via WhatsApp Instead
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* ── Left: Form Fields ── */}
            <div className="space-y-8">
              {/* Delivery Details */}
              <section className="border border-[#E5E5E5] bg-white p-6">
                <h2 className="mb-5 border-b border-[#E5E5E5] pb-4 text-sm font-semibold uppercase tracking-[0.08em] text-black">
                  Delivery Details
                </h2>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-black"
                    >
                      Full Name <span className="text-black">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Ayesha Siddiqui"
                      {...register("fullName")}
                      className={`w-full border bg-white px-4 py-3 text-sm text-black placeholder:text-[#6B6B6B] transition-colors focus:border-black focus:outline-none ${
                        errors.fullName
                          ? "border-[#A6843D]"
                          : "border-[#E5E5E5]"
                      }`}
                    />
                    <FieldError message={errors.fullName?.message} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-black"
                    >
                      Phone Number <span className="text-black">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="03001234567"
                      {...register("phone")}
                      className={`w-full border bg-white px-4 py-3 text-sm text-black placeholder:text-[#6B6B6B] transition-colors focus:border-black focus:outline-none ${
                        errors.phone ? "border-[#A6843D]" : "border-[#E5E5E5]"
                      }`}
                    />
                    <FieldError message={errors.phone?.message} />
                    <p className="mt-1.5 text-xs leading-[1.5] text-[#6B6B6B]">
                      We will message you on WhatsApp to confirm your order. Please enter a correct WhatsApp number.
                    </p>
                  </div>

                  {/* Email (optional) */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-black"
                    >
                      Email Address{" "}
                      <span className="font-normal normal-case text-[#6B6B6B]">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="ayesha@example.com"
                      {...register("email")}
                      className={`w-full border bg-white px-4 py-3 text-sm text-black placeholder:text-[#6B6B6B] transition-colors focus:border-black focus:outline-none ${
                        errors.email ? "border-[#A6843D]" : "border-[#E5E5E5]"
                      }`}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  {/* Street Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-black"
                    >
                      Street Address <span className="text-black">*</span>
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      autoComplete="street-address"
                      placeholder="House/Flat #, Street, Area/Colony"
                      {...register("address")}
                      className={`w-full resize-none border bg-white px-4 py-3 text-sm text-black placeholder:text-[#6B6B6B] transition-colors focus:border-black focus:outline-none ${
                        errors.address ? "border-[#A6843D]" : "border-[#E5E5E5]"
                      }`}
                    />
                    <FieldError message={errors.address?.message} />
                  </div>

                  {/* City Dropdown */}
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-black"
                    >
                      City <span className="text-black">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="city"
                        {...register("city")}
                        className={`w-full appearance-none border bg-white px-4 py-3 pr-10 text-sm text-black transition-colors focus:border-black focus:outline-none ${
                          errors.city ? "border-[#A6843D]" : "border-[#E5E5E5]"
                        }`}
                      >
                        <option value="" disabled>
                          Select your city
                        </option>
                        {PAKISTANI_CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
                    </div>
                    <FieldError message={errors.city?.message} />

                    {/* Other City Text Input */}
                    {selectedCity === "Other" && (
                      <div className="mt-3">
                        <label
                          htmlFor="otherCity"
                          className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-black"
                        >
                          Enter Your City Name{" "}
                          <span className="text-black">*</span>
                        </label>
                        <input
                          id="otherCity"
                          type="text"
                          placeholder="e.g. Sahiwal, Dera Ghazi Khan"
                          {...register("otherCity")}
                          className={`w-full border bg-white px-4 py-3 text-sm text-black placeholder:text-[#6B6B6B] transition-colors focus:border-black focus:outline-none ${
                            errors.otherCity
                              ? "border-[#A6843D]"
                              : "border-[#E5E5E5]"
                          }`}
                        />
                        <FieldError message={errors.otherCity?.message} />
                      </div>
                    )}
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label
                      htmlFor="orderNotes"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-black"
                    >
                      Order Notes{" "}
                      <span className="font-normal normal-case text-[#6B6B6B]">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="orderNotes"
                      rows={2}
                      placeholder="Special instructions, gift wrapping request, colour preference, etc."
                      {...register("orderNotes")}
                      className="w-full resize-none border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-black placeholder:text-[#6B6B6B] transition-colors focus:border-black focus:outline-none"
                    />
                    <FieldError message={errors.orderNotes?.message} />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="border border-[#E5E5E5] bg-white p-6">
                <h2 className="mb-5 border-b border-[#E5E5E5] pb-4 text-sm font-semibold uppercase tracking-[0.08em] text-black">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* COD Option */}
                  <label
                    htmlFor="payment-cod"
                    className={`flex cursor-pointer items-start gap-4 border p-4 transition-colors ${
                      paymentMethod === "cash-on-delivery"
                        ? "border-black bg-[#F7F7F7]"
                        : "border-[#E5E5E5] hover:border-black"
                    }`}
                  >
                    <input
                      id="payment-cod"
                      type="radio"
                      value="cash-on-delivery"
                      {...register("paymentMethod")}
                      className="accent-black mt-1"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-black">
                        Cash on Delivery (COD)
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-[#6B6B6B]">
                        Pay when your order arrives at your doorstep. Available
                        across Pakistan.
                      </span>
                    </div>
                  </label>

                  {/* Bank Transfer Option */}
                  <label
                    htmlFor="payment-bank"
                    className={`flex cursor-pointer items-start gap-4 border p-4 transition-colors ${
                      paymentMethod === "bank-transfer"
                        ? "border-black bg-[#F7F7F7]"
                        : "border-[#E5E5E5] hover:border-black"
                    }`}
                  >
                    <input
                      id="payment-bank"
                      type="radio"
                      value="bank-transfer"
                      {...register("paymentMethod")}
                      className="accent-black mt-1"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-black">
                        Bank Transfer / EasyPaisa
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-[#6B6B6B]">
                        Transfer to our Meezan Bank account or EasyPaisa mobile
                        wallet. We&apos;ll confirm after payment screenshot is
                        received.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Bank Details Panel (expanded when bank transfer selected) */}
                {paymentMethod === "bank-transfer" && (
                  <div className="mt-4 border border-[#E5E5E5] bg-[#F7F7F7] p-4">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
                      Transfer Details
                    </p>
                    <dl className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <dt className="min-w-[100px] text-[#6B6B6B]">Bank</dt>
                        <dd className="font-semibold text-black">
                          {BANK_DETAILS.bankName}
                        </dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <dt className="min-w-[100px] text-[#6B6B6B]">
                          Account Title
                        </dt>
                        <dd className="text-black">
                          {BANK_DETAILS.accountTitle}
                        </dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <dt className="min-w-[100px] text-[#6B6B6B]">Account #</dt>
                        <dd className="flex items-center font-mono text-black">
                          {BANK_DETAILS.accountNumber}
                          <CopyButton value={BANK_DETAILS.accountNumber} />
                        </dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <dt className="min-w-[100px] text-[#6B6B6B]">EasyPaisa</dt>
                        <dd className="flex items-center font-mono text-black">
                          {BANK_DETAILS.easypaisaNumber}
                          <CopyButton value={BANK_DETAILS.easypaisaNumber} />
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-[11px] text-[#6B6B6B]">
                      After placing your order, send your payment screenshot to
                      our WhatsApp to expedite confirmation.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="h-fit space-y-4 lg:sticky lg:top-24">
              <div className="border border-[#E5E5E5] bg-white p-6">
                <h2 className="mb-4 border-b border-[#E5E5E5] pb-3 text-xs font-semibold uppercase tracking-[0.08em] text-black">
                  Your Order ({totalItems} {totalItems === 1 ? "item" : "items"}
                  )
                </h2>

                {/* Item List */}
                <ul className="mb-4 space-y-4">
                  {items.map((item) => {
                    const imageUrl = item.image;
                    return (
                      <li key={item.id} className="flex gap-3">
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7]">
                          <SafeCartImage
                            image={imageUrl}
                            alt={item.name}
                            width={120}
                            height={150}
                            sizes="48px"
                            className="object-cover"
                          />
                          {/* Quantity Badge */}
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-black text-[9px] font-bold text-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 items-center justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-black">
                              {item.name}
                            </p>
                            {item.selectedVariant && (
                              <p className="text-[10px] text-[#6B6B6B]">
                                {item.selectedVariant.colorName}
                              </p>
                            )}
                          </div>
                          <span className="ml-2 shrink-0 text-xs font-semibold text-black">
                            PKR{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "en-PK"
                            )}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Totals */}
                <dl className="space-y-2 border-t border-[#E5E5E5] pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#6B6B6B]">Subtotal</dt>
                    <dd className="font-medium text-black">
                      PKR {totalPrice.toLocaleString("en-PK")}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#6B6B6B]">Delivery</dt>
                    <dd className="font-medium text-black">
                      PKR {DELIVERY_FEE.toLocaleString("en-PK")}
                    </dd>
                  </div>
                </dl>

                <div className="mt-3 flex justify-between border-t border-[#E5E5E5] pt-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-black">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-black">
                    PKR {grandTotal.toLocaleString("en-PK")}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    <span>Placing Order…</span>
                  </>
                ) : (
                  <span>Place Order</span>
                )}
              </Button>

              <p className="text-center text-[11px] text-[#6B6B6B]">
                By placing your order you agree to our{" "}
                <Link href="/about" className="text-black underline">
                  terms & policies
                </Link>
                .
              </p>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
