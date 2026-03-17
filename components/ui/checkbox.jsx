import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-[4px] border border-[var(--border-strong)] bg-white text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
