import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-button)] text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]":
              variant === "default",
            "bg-[var(--color-primary-light)] text-[var(--color-primary-text-light)] hover:bg-[var(--color-primary-light)]/80":
              variant === "secondary",
            "border border-[var(--border-default)] bg-[var(--surface-card)] hover:bg-[var(--surface-soft)] text-[var(--text-primary)]":
              variant === "outline",
            "hover:bg-[var(--surface-soft)] text-[var(--text-primary)]":
              variant === "ghost",
            "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90":
              variant === "danger",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
