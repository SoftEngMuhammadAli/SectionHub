import { cn } from "./cn";
export function Badge({
    label,
    tone,
    variant = "default",
    children,
    className = "",
}) {
    const tones = {
        default: "border border-[var(--border-default)] bg-[var(--surface-soft)] text-[var(--text-secondary)]",
        success: "border border-transparent bg-[var(--success-light)] text-[var(--success)]",
        warning: "border border-transparent bg-[var(--warning-light)] text-[var(--warning)]",
        danger: "border border-transparent bg-[var(--danger-light)] text-[var(--danger)]",
        info: "border border-transparent bg-[var(--info-light)] text-[var(--info)]",
        violet: "border border-transparent bg-[var(--primary-light)] text-[var(--primary-light-text)]",
    };
    const variants = {
        default: "border border-transparent bg-[var(--primary)] text-white",
        outline: "border border-[var(--border-strong)] bg-white text-[var(--text-primary)]",
        success: tones.success,
        warning: tones.warning,
        danger: tones.danger,
        info: tones.info,
    };
    const content = label ?? children;
    return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium", tone ? tones[tone] : variants[variant], className)}>{content}</span>;
}
