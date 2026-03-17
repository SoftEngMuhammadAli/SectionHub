import React from "react";
import { cn } from "@/lib/utils";

export function SectionTitle({ title, subtitle, className }) {
  return (
    <div className={cn("space-y-1", className)}>
      <h1 className="sh-page-title">{title}</h1>
      {subtitle ? <p className="text-[14px] text-[var(--text-secondary)]">{subtitle}</p> : null}
    </div>
  );
}
