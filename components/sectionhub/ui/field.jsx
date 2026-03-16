export function Field({ label, helper, children }) {
    return (<label className="block space-y-2">
      <div>
        <div className="text-[12px] font-medium text-[var(--text-primary)]">{label}</div>
        {helper ? <div className="mt-1 text-[11px] text-[var(--text-tertiary)]">{helper}</div> : null}
      </div>
      {children}
    </label>);
}
