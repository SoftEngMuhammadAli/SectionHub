import { cn } from "./cn";

export function Button({ children, variant = "primary", className = "" }) {
  const variants = {
    primary:
      "bg-[linear-gradient(135deg,var(--primary)_0%,#8572ff_100%)] text-white shadow-[0_16px_30px_rgba(109,76,255,0.22)] hover:brightness-[1.03] hover:shadow-[0_20px_36px_rgba(109,76,255,0.28)]",
    secondary:
      "border border-[var(--border)] bg-white/82 text-[var(--text-primary)] shadow-[0_10px_22px_rgba(15,23,42,0.05)] hover:bg-white hover:shadow-[0_14px_26px_rgba(15,23,42,0.07)]",
    ghost:
      "bg-transparent text-[var(--primary)] hover:bg-[var(--primary-light)]",
    danger:
      "bg-[linear-gradient(135deg,var(--danger)_0%,#ef476f_100%)] text-white shadow-[0_16px_30px_rgba(209,36,73,0.18)] hover:brightness-[1.04]",
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-[var(--radius-button)] px-3.5 text-[12px] font-semibold transition-all duration-200 active:translate-y-px",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

