import { cn } from "./cn";

export function Badge({
  label,
  tone,
  variant = "default",
  children,
  className = "",
}) {
  const tones = {
    default:
      "border border-[var(--border-default)] bg-white/78 text-[var(--text-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
    success:
      "border border-transparent bg-[var(--success-light)] text-[var(--success)]",
    warning:
      "border border-transparent bg-[var(--warning-light)] text-[var(--warning)]",
    danger:
      "border border-transparent bg-[var(--danger-light)] text-[var(--danger)]",
    info: "border border-transparent bg-[var(--info-light)] text-[var(--info)]",
    violet:
      "border border-transparent bg-[var(--primary-light)] text-[var(--primary-light-text)]",
  };

  const variants = {
    default:
      "border border-transparent bg-[linear-gradient(135deg,var(--primary)_0%,#8572ff_100%)] text-white shadow-[0_10px_24px_rgba(109,76,255,0.18)]",
    outline:
      "border border-[var(--border-strong)] bg-white/78 text-[var(--text-primary)]",
    success: tones.success,
    warning: tones.warning,
    danger: tones.danger,
    info: tones.info,
  };

  const content = label ?? children;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em] transition-colors",
        tone ? tones[tone] : variants[variant],
        className,
      )}
    >
      {content}
    </span>
  );
}
