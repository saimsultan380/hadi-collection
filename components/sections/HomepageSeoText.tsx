import Link from "next/link";
import { Container } from "@/components/ui/container";

export function HomepageSeoText() {
  return (
    <section className="w-full border-t border-[#E8E8E8] bg-white py-16 text-[#2C2118] sm:py-20">
      <Container size="narrow">
        <div className="flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A6843D]">
              Hadi Collection
            </p>
            <h2 className="font-display text-3xl font-medium leading-snug text-[#2C2118] sm:text-4xl">
              Unstitched suits, made to be stitched your way
            </h2>
          </div>

          <p className="font-sans text-[14px] leading-relaxed text-[#5C4A3A]">
            Hadi Collection is a ladies clothing house for unstitched suits in Pakistan. The edit
            covers daytime{" "}
            <Link href="/category/lawn-prints" className="underline underline-offset-2 hover:text-[#A6843D]">
              printed lawn
            </Link>
            , quieter{" "}
            <Link href="/category/botanical" className="underline underline-offset-2 hover:text-[#A6843D]">
              botanical prints
            </Link>
            , and evening{" "}
            <Link href="/category/embroidered" className="underline underline-offset-2 hover:text-[#A6843D]">
              embroidered florals
            </Link>
            . Each set is sold as fabric — shirt, trouser and dupatta — so the tailor cuts it to you.
          </p>

          <p className="font-sans text-[14px] leading-relaxed text-[#5C4A3A]">
            For Eid, mehndi and wedding week, the{" "}
            <Link href="/category/festive-edit" className="underline underline-offset-2 hover:text-[#A6843D]">
              festive edit
            </Link>{" "}
            uses gold borders and deeper colours. Orders ship nationwide with cash on delivery and a
            7-day exchange on unused, uncut fabric. Browse the{" "}
            <Link href="/shop" className="underline underline-offset-2 hover:text-[#A6843D]">
              full shop
            </Link>{" "}
            or message the studio on WhatsApp if you want help choosing a print.
          </p>
        </div>
      </Container>
    </section>
  );
}
