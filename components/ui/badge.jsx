import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Badge = React.forwardRef(
  (
    { className, variant = "default", tone, label, children, ...props },
    ref,
  ) => {
    const toneClass = {
      default:
        "border border-[var(--border-default)] bg-white/78 text-[var(--text-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
      success:
        "border border-transparent bg-[var(--color-success-light)] text-[var(--color-success)]",
      warning:
        "border border-transparent bg-[var(--color-warning-light)] text-[var(--color-warning)]",
      danger:
        "border border-transparent bg-[var(--color-danger-light)] text-[var(--color-danger)]",
      info: "border border-transparent bg-[var(--color-info-light)] text-[var(--color-info)]",
      violet:
        "border border-transparent bg-[var(--color-primary-light)] text-[var(--color-primary-text-light)]",
    };

    const variantClass = {
      default:
        "border border-transparent bg-[linear-gradient(135deg,var(--color-primary)_0%,#8572ff_100%)] text-white shadow-[0_10px_24px_rgba(109,76,255,0.18)]",
      outline:
        "border border-[var(--border-strong)] bg-white/78 text-[var(--text-primary)]",
      success: toneClass.success,
      warning: toneClass.warning,
      danger: toneClass.danger,
      info: toneClass.info,
    };

    const content = label ?? children;

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em] transition-colors",
          tone ? toneClass[tone] : variantClass[variant],
          className,
        )}
        {...props}
      >
        {content}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
