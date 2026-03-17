import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select className={cn("sh-select", className)} ref={ref} {...props}>
      {children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
