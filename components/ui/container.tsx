import * as React from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// SAZAIRA CONTAINER — Layout wrapper for consistent max-width & padding.
// max-w-7xl (1280px) centered, with responsive horizontal padding.
// =============================================================================

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use "full" to allow edge-to-edge with inner padding, or "narrow" for tighter editorial column */
  size?: "default" | "narrow";
}

/**
 * Container wraps page sections to ensure consistent horizontal alignment.
 * Used in Header, Footer, and all page section components.
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          size === "default" && "max-w-7xl",
          size === "narrow" && "max-w-3xl",
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

export { Container };
