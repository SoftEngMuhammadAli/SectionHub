import React from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/sectionhub/ui";

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="sectionhub-dot-grid flex min-h-screen items-center justify-center px-4 py-8 sm:py-10">
      <Card className="w-full max-w-[420px] rounded-[16px] border-[1px] border-[var(--border-default)] p-6 shadow-[0_12px_24px_rgba(0,0,0,0.06),_0_4px_8px_rgba(0,0,0,0.03)] sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--color-primary)] text-white">
            <Icon name="grid" className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[18px] font-semibold tracking-[-0.02em]">
              SectionHub
            </div>
            <div className="text-[12px] text-[var(--text-tertiary)]">
              Restricted access - Admin only
            </div>
          </div>
        </div>
        <div className="mb-6 space-y-1">
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] sm:text-[24px]">
            {title}
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        {children}
        <div className="mt-8 text-center text-[11px] text-[var(--text-tertiary)]">
          {footer ?? "SectionHub v1.0 - 2026"}
        </div>
      </Card>
    </div>
  );
}
