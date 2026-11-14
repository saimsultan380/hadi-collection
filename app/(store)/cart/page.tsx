"use client";

import Link from "next/link";

import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SafeCartImage } from "@/components/cart/SafeCartImage";

// =============================================================================
// SAZAIRA — FULL CART PAGE (/cart)
// Flat editorial design: ivory bg, espresso headings, 1px solid taupe dividers.
// No gradients, no glassmorphism.
// =============================================================================

const DELIVERY_FEE = 200; // PKR flat rate — will be dynamic in Step 8

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } =
    useCart();

  // Suppress hydration flash — cart relies on localStorage
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-10 md:py-16">
          {/* Page Header */}
          <div className="border-border mb-8 border-b pb-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6B6B]">
              Review your order
            </p>
            <h1 className="text-2xl font-semibold tracking-[0.02em] uppercase text-black md:text-3xl">
              Shopping Bag
              {totalItems > 0 && (
                <span className="ml-3 text-sm font-normal text-[#6B6B6B]">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </h1>
          </div>

          {isEmpty ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center border border-[#E5E5E5] bg-[#F7F7F7]">
                <ShoppingBag className="h-6 w-6 stroke-[1.5] text-black" />
              </div>
              <h2 className="text-lg font-semibold uppercase tracking-[0.08em] text-black">
                Your cart is empty
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-[1.6] text-[#6B6B6B]">
                Lawn, embroidered and festive suits are waiting in the shop.
              </p>
              <div className="mt-8">
                <Link href="/shop">
                  <Button variant="primary" size="md">
                    Browse the Collection
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* ── Cart Grid: Items + Order Summary ── */
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              {/* Left: Line Items */}
              <div>
                {/* Column Headers (desktop) */}
                <div className="hidden grid-cols-[1fr_120px_100px_44px] gap-4 border-b border-[#E5E5E5] pb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6B] md:grid">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Price</span>
                  <span />
                </div>

                {/* Item Rows */}
                <ul className="divide-y divide-[#E5E5E5]">
                  {items.map((item) => {
                    return (
                      <li
                        key={item.id}
                        className="flex gap-4 py-6 md:grid md:grid-cols-[1fr_120px_100px_44px] md:items-center"
                      >
                        {/* Thumbnail + Info */}
                        <div className="flex min-w-0 flex-1 gap-4">
                          <Link
                            href={`/shop/${item.productSlug}`}
                            className="relative h-24 w-20 shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7]"
                          >
                            <SafeCartImage
                              image={item.image}
                              alt={item.name}
                              width={200}
                              height={250}
                              sizes="80px"
                              className="object-cover"
                            />
                          </Link>


                          <div className="flex min-w-0 flex-col justify-between py-1">
                            <div>
                              <Link
                                href={`/shop/${item.productSlug}`}
                                className="block truncate text-sm font-medium text-black hover:underline"
                              >
                                {item.name}
                              </Link>
                              {item.selectedVariant && (
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#6B6B6B]">
                                  {item.selectedVariant.colorHex && (
                                    <span
                                      className="inline-block h-2.5 w-2.5 border border-[#E5E5E5]"
                                      style={{
                                        backgroundColor:
                                          item.selectedVariant.colorHex,
                                      }}
                                    />
                                  )}
                                  {item.selectedVariant.colorName}
                                </p>
                              )}
                            </div>

                            {/* Mobile: quantity + price inline */}
                            <div className="mt-3 flex items-center justify-between md:hidden">
                              <div className="flex items-center border border-[#E5E5E5] bg-white">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="p-2 text-black transition-colors hover:bg-[#F7F7F7]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-semibold text-black">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="p-2 text-black transition-colors hover:bg-[#F7F7F7]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="text-sm font-medium text-black">
                                PKR{" "}
                                {(item.price * item.quantity).toLocaleString(
                                  "en-PK"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop: Quantity */}
                        <div className="hidden items-center justify-center md:flex">
                          <div className="flex items-center border border-[#E5E5E5] bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-2 text-black transition-colors hover:bg-[#F7F7F7]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-black">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-2 text-black transition-colors hover:bg-[#F7F7F7]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Desktop: Price */}
                        <div className="hidden items-center justify-end md:flex">
                          <span className="text-sm font-medium text-black">
                            PKR{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "en-PK"
                            )}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <div className="hidden items-center justify-center md:flex">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-[#6B6B6B] transition-colors hover:text-black"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Continue Shopping */}
                <div className="mt-6 border-t border-[#E5E5E5] pt-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-black hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="h-fit lg:sticky lg:top-24">
                <div className="border border-[#E5E5E5] bg-white p-6">
                  <h2 className="mb-5 border-b border-[#E5E5E5] pb-4 text-sm font-semibold uppercase tracking-[0.08em] text-black">
                    Order Summary
                  </h2>

                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-[#6B6B6B]">
                        Subtotal ({totalItems}{" "}
                        {totalItems === 1 ? "item" : "items"})
                      </dt>
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

                  <div className="mt-5 flex justify-between border-t border-[#E5E5E5] pt-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-black">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-black">
                      PKR {(totalPrice + DELIVERY_FEE).toLocaleString("en-PK")}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-[#6B6B6B]">
                    Inclusive of all applicable taxes
                  </p>

                  <div className="mt-6">
                    <Link href="/checkout" className="block w-full">
                      <Button
                        variant="primary"
                        size="md"
                        className="flex w-full items-center justify-center gap-2"
                      >
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Reassurances */}
                  <ul className="mt-6 space-y-2 border-t border-[#E5E5E5] pt-4 text-[11px] text-[#6B6B6B]">
                    <li className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 bg-black" />
                      Cash on Delivery available
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 bg-black" />
                      Secure online banking transfer accepted
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 bg-black" />
                      Easy exchange within 7 days
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
