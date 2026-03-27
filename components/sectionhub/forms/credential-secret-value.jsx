"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

export function CredentialSecretValue({ secret = "" }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const value = visible ? secret : "*".repeat(24);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[var(--border-default)] bg-[var(--background-page)] px-3 py-2.5">
      <span className="min-w-0 flex-1 truncate font-mono-ui text-[12px] text-[var(--text-primary)]">
        {value}
      </span>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--text-tertiary)] transition-colors hover:bg-white hover:text-[var(--text-secondary)]"
        onClick={() => setVisible((state) => !state)}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[var(--text-tertiary)] transition-colors hover:bg-white hover:text-[var(--text-secondary)]"
        onClick={async () => {
          if (!secret || !navigator?.clipboard) return;
          await navigator.clipboard.writeText(secret);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
