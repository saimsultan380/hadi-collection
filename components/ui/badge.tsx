import * as React from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// SAZAIRA BADGE — Minimal Square Tag (Aldo Inspired)
// =============================================================================

export type BadgeVariant = "default" | "sale" | "outline" | "festive" | "surface";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2 py-0.5 font-sans text-[11px] font-medium uppercase tracking-[0.08em] rounded-[4px]",
          variant === "default" && "bg-black text-white",
          variant === "sale" && "bg-[#A6843D] text-white",
          variant === "outline" && "border border-black text-black bg-white",
          variant === "festive" && "bg-black text-white",
          variant === "surface" && "bg-surface text-black border border-border",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
