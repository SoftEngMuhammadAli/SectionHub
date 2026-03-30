"use client";

import { useId, useState } from "react";
import { ImagePlus } from "lucide-react";

function toUploadPath(fileName) {
  const normalized = String(fileName ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-");
  return normalized ? `/uploads/${normalized}` : "";
}

export function SettingsLogoUpload({ initialLogo = "" }) {
  const inputId = useId();
  const [siteLogo, setSiteLogo] = useState(initialLogo);

  const fileName = siteLogo ? siteLogo.split("/").pop() : "";

  return (
    <div className="rounded-[10px] border border-dashed border-[var(--border-strong)] bg-[var(--background-page)] p-4">
      <input type="hidden" name="siteLogo" value={siteLogo} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
          <ImagePlus className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[12px] text-[var(--text-secondary)]">
            Square SVG or PNG, max 2MB. Recommended 512 x 512px.
          </div>
          {fileName ? (
            <div className="mt-1 truncate font-mono-ui text-[12px] text-[var(--text-tertiary)]">
              {fileName}
            </div>
          ) : null}

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label
              htmlFor={inputId}
              className="inline-flex min-h-9 cursor-pointer items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Upload New
            </label>
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
              onClick={() => setSiteLogo("")}
            >
              Remove
            </button>
          </div>

          <input
            id={inputId}
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setSiteLogo(file ? toUploadPath(file.name) : "");
            }}
          />
        </div>
      </div>
    </div>
  );
}
