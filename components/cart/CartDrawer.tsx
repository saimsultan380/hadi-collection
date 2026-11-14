"use client";

import Link from "next/link";

import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { SafeCartImage } from "@/components/cart/SafeCartImage";

// =============================================================================
// CART DRAWER COMPONENT — Minimal (Aldo Inspired)
// =============================================================================

export function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={closeCartDrawer}
        aria-label="Close cart backdrop"
      />

      {/* Drawer Container */}
      <aside
        aria-label="Shopping Bag Drawer"
        className="relative z-10 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-[#E5E5E5] bg-white shadow-none"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-black stroke-[1.5]" />
            <h2 className="font-sans text-[14px] font-semibold tracking-[0.08em] uppercase text-black">
              Shopping Bag
            </h2>
            <span className="font-sans text-[12px] font-semibold text-[#A6843D]">
              ({totalItems})
            </span>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            className="p-1 text-black hover:opacity-70 transition-opacity"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Drawer Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center bg-white p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center border border-[#E5E5E5] bg-[#F7F7F7] text-black">
              <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-sans text-[14px] font-semibold tracking-[0.08em] uppercase text-black">
              Your Bag is Empty
            </h3>
            <p className="mt-2 max-w-xs font-sans text-[13px] text-[#6B6B6B] leading-relaxed">
              Lawn, embroidered and festive suits are in the shop.
            </p>
            <div className="mt-6">
              <Link href="/shop" onClick={closeCartDrawer}>
                <Button variant="primary" size="md">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4 divide-y divide-[#E5E5E5] overflow-y-auto p-5 sm:p-6">
            {items.map((item) => {
              return (
                <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                  {/* Thumbnail */}
                  <Link
                    href={`/shop/${item.productSlug}`}
                    onClick={closeCartDrawer}
                    className="relative h-20 w-16 shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7]"
                  >
                    <SafeCartImage
                      image={item.image}
                      alt={item.name}
                      width={160}
                      height={200}
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-sans text-[13px] font-medium text-black truncate">
                          <Link
                            href={`/shop/${item.productSlug}`}
                            onClick={closeCartDrawer}
                            className="hover:underline"
                          >
                            {item.name}
                          </Link>
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-[#6B6B6B] hover:text-black transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="mt-0.5 flex items-center gap-1.5 font-sans text-[11px] uppercase text-[#6B6B6B]">
                          {item.selectedVariant.colorHex && (
                            <span
                              className="inline-block h-2 w-2 border border-[#E5E5E5]"
                              style={{
                                backgroundColor: item.selectedVariant.colorHex,
                              }}
                            />
                          )}
                          <span>{item.selectedVariant.colorName}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E5E5E5] bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1.5 text-black hover:bg-[#F7F7F7] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 stroke-[1.5]" />
                        </button>
                        <span className="w-6 text-center font-sans text-[12px] font-medium text-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 text-black hover:bg-[#F7F7F7] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 stroke-[1.5]" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-sans text-[13px] font-medium text-black">
                        PKR{" "}
                        {(item.price * item.quantity).toLocaleString("en-PK")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="space-y-4 border-t border-[#E5E5E5] bg-[#F7F7F7] p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-sans text-[12px] font-semibold tracking-[0.08em] uppercase text-black">
                Subtotal
              </span>
              <span className="font-sans text-base font-semibold text-black">
                PKR {totalPrice.toLocaleString("en-PK")}
              </span>
            </div>

            <p className="font-sans text-[11px] text-[#6B6B6B]">
              Shipping and taxes calculated at checkout.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="w-full"
              >
                <Button
                  variant="primary"
                  size="md"
                  className="flex w-full items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4 stroke-[1.5]" />
                </Button>
              </Link>

              <Link
                href="/cart"
                onClick={closeCartDrawer}
                className="w-full text-center"
              >
                <span className="block py-1 font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-black hover:underline transition-colors">
                  View Full Bag
                </span>
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
