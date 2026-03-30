"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/components/sectionhub/ui/cn";

function toFieldEntries(fields) {
  return Object.entries(fields ?? {}).filter(([, value]) => value !== undefined);
}

export function ConfirmActionDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  triggerLabel,
  triggerClassName,
  confirmClassName,
  action,
  fields,
  onConfirm,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleConfirmClick() {
    if (!onConfirm) {
      return;
    }

    await onConfirm();
    setOpen(false);
  }

  const dialog =
    open && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6">
            <button
              type="button"
              aria-label="Close confirmation dialog"
              className="absolute inset-0 bg-[#0f172a]/42 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />

            <div className="relative z-10 w-full max-w-[420px] rounded-[16px] border border-[var(--border-default)] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--danger-light)] text-[var(--danger)]">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                      {title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-[var(--text-secondary)]">
                      {description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {action ? (
                <form action={action} className="mt-5 flex justify-end gap-3">
                  {toFieldEntries(fields).map(([name, value]) => (
                    <input
                      key={name}
                      type="hidden"
                      name={name}
                      value={String(value)}
                    />
                  ))}
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
                    onClick={() => setOpen(false)}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="submit"
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-[10px] bg-[var(--danger)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_rgba(220,38,38,0.18)] transition-colors hover:bg-[#dc2626]",
                      confirmClassName,
                    )}
                  >
                    {confirmLabel}
                  </button>
                </form>
              ) : (
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
                    onClick={() => setOpen(false)}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-[10px] bg-[var(--danger)] px-4 text-[12px] font-semibold text-white shadow-[0_12px_24px_rgba(220,38,38,0.18)] transition-colors hover:bg-[#dc2626]",
                      confirmClassName,
                    )}
                    onClick={() => {
                      void handleConfirmClick();
                    }}
                  >
                    {confirmLabel}
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>
      {dialog}
    </>
  );
}
