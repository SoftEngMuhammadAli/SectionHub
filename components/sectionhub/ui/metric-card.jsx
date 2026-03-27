import { Card } from "./card";
export function MetricCard({ label, value, hint }) {
  return (
    <Card className="p-5">
      <div className="text-[12px] font-medium text-[var(--text-secondary)]">
        {label}
      </div>
      <div className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
        {value}
      </div>
      <div className="mt-2 text-[12px] text-[var(--text-tertiary)]">{hint}</div>
    </Card>
  );
}

