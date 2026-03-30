import { cn } from "./cn";

export function Button({ children, variant = "primary", className = "" }) {
  const variants = {
    primary:
      "bg-[var(--primary)] text-white shadow-[0_10px_20px_rgba(109,76,255,0.18)] hover:bg-[var(--primary-hover)]",
    secondary:
      "border border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-[var(--surface-soft)]",
    ghost:
      "bg-transparent text-[var(--primary)] hover:bg-[var(--primary-light)]",
    danger:
      "border border-[var(--danger)]/25 bg-white text-[var(--danger)] hover:bg-[var(--danger-light)]",
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-[var(--radius-button)] px-3.5 text-[12px] font-semibold transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

