import * as React from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// SAZAIRA BUTTON — Minimal Monochrome (Aldo Inspired)
// - Primary: Solid Black background, White text, 0 radius, hover: #222
// - Secondary/Outline: White background, 1px Black border, Black text, hover: Black bg + White text
// =============================================================================

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-sans font-medium uppercase tracking-[0.08em] transition-all duration-150 select-none",
          "rounded-[8px] border disabled:pointer-events-none disabled:opacity-40",
          "focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none",
          // Primary Variant: Solid Black
          variant === "primary" && [
            "bg-[#A6843D] text-[#FFFBF5] border-[#A6843D] hover:bg-[#7A5E2A] hover:border-[#7A5E2A]",
          ],
          // Secondary / Outline: White with 1px black border
          (variant === "secondary" || variant === "outline") && [
            "bg-white text-black border-black hover:bg-black hover:text-white",
          ],
          // Sizes
          size === "sm" && "h-9 px-4 text-[12px]",
          size === "md" && "h-11 px-6 text-[13px]",
          size === "lg" && "h-13 px-8 text-[13px]",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
