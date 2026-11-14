import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description:
    "Complete your Hadi Collection order with Cash on Delivery or bank transfer in Pakistan.",
  alternates: {
    canonical: "/checkout",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
