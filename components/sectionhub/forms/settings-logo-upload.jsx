"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

function toUploadPath(fileName) {
  const normalized = String(fileName ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-");
  return normalized ? `/uploads/${normalized}` : "";
}

export function SettingsLogoUpload({ initialLogo = "" }) {
  const inputId = useId();
  const inputRef = useRef(null);
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
            <ConfirmActionDialog
              title="Remove the site logo?"
              description="This clears the current logo selection. After you save settings, the app will fall back to the default SectionHub brand mark."
              confirmLabel="Remove Logo"
              triggerLabel="Remove"
              disabled={!siteLogo}
              onConfirm={() => {
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
                setSiteLogo("");
              }}
              triggerClassName="inline-flex min-h-9 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <input
            ref={inputRef}
            id={inputId}
            type="file"
            name="siteLogoFile"
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
