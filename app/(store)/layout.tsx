import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp";
import { getCategories } from "@/lib/products";

/**
 * StoreLayout wraps all customer-facing storefront pages with the
 * persistent brand header, footer, global CartProvider, and slide-in CartDrawer.
 */
export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <CartProvider>
      <Header categories={categories} />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </CartProvider>
  );
}
