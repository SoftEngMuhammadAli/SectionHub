import { cn } from "./cn";

export function Badge({ label, tone = "default" }: { label: string; tone?: "default" | "success" | "warning" | "danger" | "info" | "violet" }) {
  const tones = {
    default: "bg-[#F4F5FA] text-[var(--text-secondary)]",
    success: "bg-[var(--success-light)] text-[var(--success)]",
    warning: "bg-[var(--warning-light)] text-[var(--warning)]",
    danger: "bg-[var(--danger-light)] text-[var(--danger)]",
    info: "bg-[var(--info-light)] text-[var(--info)]",
    violet: "bg-[var(--primary-light)] text-[var(--primary-light-text)]",
  };

  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium", tones[tone])}>{label}</span>;
}
