import type { ReactNode } from "react";
import { cn } from "./cn";

export function Button({ children, variant = "primary", className = "" }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger"; className?: string }) {
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
    secondary: "border border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-[var(--page-bg)]",
    ghost: "bg-transparent text-[var(--primary)] hover:bg-[var(--primary-light)]",
    danger: "border border-[var(--danger)]/20 bg-white text-[var(--danger)] hover:bg-[var(--danger-light)]",
  };

  return <button type="button" className={cn("inline-flex min-h-11 items-center justify-center rounded-[8px] px-4 text-[13px] font-medium transition-colors", variants[variant], className)}>{children}</button>;
}
