"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import type { CartItem } from "@/types/order";
import type { Product, ColorVariant } from "@/types/product";
import { CART_VERSION, migrateCartItems } from "@/lib/cart-migration";

// =============================================================================
// SAZAIRA SHOPPING CART CONTEXT
// Persistent client-side cart storage via localStorage with hydration safety.
// Note: This is client-side storage suitable for guest checkout.
// =============================================================================

// Legacy key (no version) — used to detect and migrate old carts
const LEGACY_CART_KEY = "sazaira_cart";
// Versioned key — all new writes go here
const CART_STORAGE_KEY = `${LEGACY_CART_KEY}_${CART_VERSION}`;

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: ColorVariant | null
  ) => void;
  removeFromCart: (lineItemId: string) => void;
  updateQuantity: (lineItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Hydrate cart from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      // ── 1. Try the current versioned key first ─────────────────────────────
      let stored = localStorage.getItem(CART_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } else {
        // ── 2. Fall back to the legacy unversioned key (migration path) ───────
        const legacy = localStorage.getItem(LEGACY_CART_KEY);
        if (legacy) {
          let parsed: unknown;
          try {
            parsed = JSON.parse(legacy);
          } catch {
            parsed = null;
          }

          if (Array.isArray(parsed)) {
            // Run the migration: replace Sanity URLs, drop unknown products
            const migrated = migrateCartItems(parsed);
            setItems(migrated);
            // Persist under the new versioned key
            try {
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(migrated));
            } catch {
              // ignore quota errors
            }
            // Remove the old key so migration only runs once
            try {
              localStorage.removeItem(LEGACY_CART_KEY);
            } catch {
              // ignore
            }
          }
        }
      }
    } catch (e) {
      console.warn(
        "[Cart Warning]: Failed to restore cart from localStorage:",
        e
      );
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync cart changes to localStorage once hydrated
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn(
        "[Cart Warning]: Failed to persist cart to localStorage:",
        e
      );
    }
  }, [items, isHydrated]);

  const addToCart = (
    product: Product,
    quantity = 1,
    variant?: ColorVariant | null
  ) => {
    const variantName = variant?.colorName || null;
    const lineItemId = `${product.slug}-${variantName || "default"}`;

    // Prefer variant specific image if provided, otherwise fallback to main product image
    const imageToUse = variant?.colorImage || product.images?.[0];

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === lineItemId
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: lineItemId,
        productSlug: product.slug,
        name: product.name,
        image: imageToUse,
        price: product.price,
        selectedVariant: variantName
          ? {
              colorName: variantName,
              colorHex: variant?.colorHex,
            }
          : undefined,
        quantity,
      };

      return [...prevItems, newItem];
    });

    // Automatically open cart drawer to confirm addition
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (lineItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== lineItemId));
  };

  const updateQuantity = (lineItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(lineItemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === lineItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(LEGACY_CART_KEY);
    } catch (e) {
      console.warn("[Cart Warning]: Could not clear localStorage:", e);
    }
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);
  const toggleCartDrawer = () => setIsCartDrawerOpen((prev) => !prev);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
    }),
    [items, totalItems, totalPrice, isCartDrawerOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
