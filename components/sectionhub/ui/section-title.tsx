export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[24px]">{title}</h1>
      {subtitle ? <p className="text-[13px] text-[var(--text-secondary)] sm:text-[14px]">{subtitle}</p> : null}
    </div>
  );
}
