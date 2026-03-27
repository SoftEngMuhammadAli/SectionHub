import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-button)] text-[12px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
          {
            "bg-[linear-gradient(135deg,var(--color-primary)_0%,#8572ff_100%)] text-white shadow-[0_16px_30px_rgba(109,76,255,0.22)] hover:brightness-[1.03] hover:shadow-[0_20px_36px_rgba(109,76,255,0.28)]":
              variant === "default",
            "bg-[var(--color-primary-light)] text-[var(--color-primary-text-light)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] hover:bg-[#e4dcff]":
              variant === "secondary",
            "border border-[var(--border-default)] bg-white/82 text-[var(--text-primary)] shadow-[0_10px_22px_rgba(15,23,42,0.05)] backdrop-blur-sm hover:bg-white hover:shadow-[0_14px_26px_rgba(15,23,42,0.07)]":
              variant === "outline",
            "bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-soft)]":
              variant === "ghost",
            "bg-[linear-gradient(135deg,var(--color-danger)_0%,#ef476f_100%)] text-white shadow-[0_16px_30px_rgba(209,36,73,0.18)] hover:brightness-[1.04]":
              variant === "danger",
            "h-9 px-3.5 py-2": size === "default",
            "h-8 rounded-[8px] px-2.5": size === "sm",
            "h-10 rounded-[10px] px-6": size === "lg",
            "h-9 w-9": size === "icon",
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
