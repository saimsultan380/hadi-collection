import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description:
    "Review your Hadi Collection suits before checkout.",
  alternates: {
    canonical: "/cart",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
