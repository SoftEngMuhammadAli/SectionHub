import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "border border-transparent bg-[var(--color-primary)] text-white": variant === "default",
          "border border-[var(--border-strong)] text-[var(--text-primary)]": variant === "outline",
          "border border-transparent bg-[var(--color-success-light)] text-[var(--color-success)]": variant === "success",
          "border border-transparent bg-[var(--color-warning-light)] text-[var(--color-warning)]": variant === "warning",
          "border border-transparent bg-[var(--color-danger-light)] text-[var(--color-danger)]": variant === "danger",
          "border border-transparent bg-[var(--color-info-light)] text-[var(--color-info)]": variant === "info",
        },
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };
