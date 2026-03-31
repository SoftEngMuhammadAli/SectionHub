"use client";

import { useId, useRef, useState } from "react";
import { FileCode2, UploadCloud } from "lucide-react";

const MAX_LIQUID_FILE_SIZE_BYTES = 2 * 1024 * 1024;

function formatFileSize(bytes) {
  if (!bytes) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileNameFromUrl(url) {
  if (!url) {
    return "";
  }

  return decodeURIComponent(String(url).split("/").pop() ?? "");
}

function isLiquidFile(file) {
  return String(file?.name ?? "").toLowerCase().endsWith(".liquid");
}

export function LiquidFileUpload({
  initialFileUrl = "",
  initialChecksum = "",
  required = false,
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const currentFileName = getFileNameFromUrl(initialFileUrl);
  const visibleFileName = selectedFile?.name ?? currentFileName;

  function clearNativeInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function syncSelectedFile(file) {
    if (!file) {
      setSelectedFile(null);
      setError("");
      return false;
    }

    if (!isLiquidFile(file)) {
      clearNativeInput();
      setSelectedFile(null);
      setError("Only .liquid files are allowed.");
      return false;
    }

    if (file.size > MAX_LIQUID_FILE_SIZE_BYTES) {
      clearNativeInput();
      setSelectedFile(null);
      setError("Liquid file is too large. Maximum size is 2MB.");
      return false;
    }

    setSelectedFile({
      name: file.name,
      size: file.size,
    });
    setError("");
    return true;
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile || !inputRef.current) {
      return;
    }

    if (!syncSelectedFile(droppedFile)) {
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(droppedFile);
    inputRef.current.files = transfer.files;
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="currentLiquidFileUrl" value={initialFileUrl} />
      <input
        type="hidden"
        name="currentLiquidChecksum"
        value={initialChecksum}
      />

      <label
        htmlFor={inputId}
        onDragEnter={() => setIsDragging(true)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]/45"
            : "border-[var(--border-strong)] bg-[var(--background-page)]"
        }`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
          {visibleFileName ? (
            <FileCode2 className="h-5 w-5" />
          ) : (
            <UploadCloud className="h-5 w-5" />
          )}
        </div>

        <div className="mt-4 text-[15px] font-semibold text-[var(--text-primary)]">
          {visibleFileName
            ? "Liquid file ready to upload"
            : "Click to upload or drag and drop"}
        </div>

        <div className="mt-1 text-[13px] text-[var(--text-tertiary)]">
          {visibleFileName
            ? visibleFileName
            : ".liquid files only, max 2MB"}
        </div>

        {selectedFile ? (
          <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
            {formatFileSize(selectedFile.size)}
          </div>
        ) : currentFileName ? (
          <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
            Current file will remain active until you replace it.
          </div>
        ) : null}
      </label>

      {error ? (
        <div className="rounded-[8px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-3 py-2 text-[12px] text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        name="liquidFile"
        type="file"
        accept=".liquid"
        required={required && !initialFileUrl}
        className="hidden"
        onChange={(event) => {
          syncSelectedFile(event.target.files?.[0]);
        }}
      />
    </div>
  );
}
