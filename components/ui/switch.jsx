import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Switch = React.forwardRef(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 disabled:cursor-not-allowed disabled:opacity-50 tracking-normal",
          checked
            ? "bg-[linear-gradient(135deg,var(--color-primary)_0%,#8572ff_100%)]"
            : "bg-[var(--border-strong)]",
          className,
        )}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-[18px] w-[18px] rounded-full bg-white shadow-[0_2px_8px_rgba(15,23,42,0.14)] ring-0 transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-[3px]",
          )}
        />
      </button>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
