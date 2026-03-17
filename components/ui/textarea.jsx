import React from "react";
import { cn } from "@/components/sectionhub/ui/cn";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn("sh-input min-h-[110px] resize-y", className)}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
