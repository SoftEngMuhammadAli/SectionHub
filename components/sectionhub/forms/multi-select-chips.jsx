"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

function normalizeInitialIds(initialSelectedIds) {
  if (Array.isArray(initialSelectedIds)) {
    return initialSelectedIds.map((value) => String(value)).filter(Boolean);
  }
  if (typeof initialSelectedIds === "string") {
    return initialSelectedIds
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }
  return [];
}

export function MultiSelectChips({
  name,
  label,
  placeholder = "Search...",
  options = [],
  initialSelectedIds = [],
  emptyText = "No matches found.",
}) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(() =>
    normalizeInitialIds(initialSelectedIds),
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => {
      const nameMatch = String(option.name ?? "")
        .toLowerCase()
        .includes(q);
      const metaMatch = String(option.meta ?? "")
        .toLowerCase()
        .includes(q);
      return nameMatch || metaMatch;
    });
  }, [options, query]);

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedSet.has(String(option.id))),
    [options, selectedSet],
  );

  function toggleSelection(id) {
    const nextId = String(id);
    setSelectedIds((prev) =>
      prev.includes(nextId)
        ? prev.filter((item) => item !== nextId)
        : [...prev, nextId],
    );
  }

  function removeSelection(id) {
    const nextId = String(id);
    setSelectedIds((prev) => prev.filter((item) => item !== nextId));
  }

  return (
    <div className="sectionhub-field">
      <span className="sectionhub-field-label">{label}</span>

      <input type="hidden" name={name} value={selectedIds.join(",")} />

      <div className="rounded-[8px] border border-[var(--border-default)] bg-white p-2.5">
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-primary)]"
            >
              {option.name}
              <button
                type="button"
                onClick={() => removeSelection(option.id)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[var(--border-default)]/70"
                aria-label={`Remove ${option.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
            placeholder={placeholder}
            className="min-w-[150px] flex-1 bg-transparent py-1 text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
          />
        </div>
      </div>

      <div className="sectionhub-scrollbar max-h-[180px] overflow-y-auto rounded-[8px] border border-[var(--border-default)] bg-[var(--background-page)]">
        {filteredOptions.length ? (
          filteredOptions.map((option) => {
            const active = selectedSet.has(String(option.id));
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleSelection(option.id)}
                className={`flex w-full items-center justify-between gap-3 border-b border-[var(--border-default)] px-3 py-2.5 text-left last:border-b-0 ${
                  active ? "bg-[var(--primary-light)]" : "hover:bg-white"
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                    {option.name}
                  </div>
                  {option.meta ? (
                    <div className="truncate text-[11px] text-[var(--text-secondary)]">
                      {option.meta}
                    </div>
                  ) : null}
                </div>
                <span
                  className={`inline-flex h-4 w-4 rounded-[5px] border ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                      : "border-[var(--border-strong)] bg-white"
                  }`}
                />
              </button>
            );
          })
        ) : (
          <div className="px-3 py-3 text-[12px] text-[var(--text-secondary)]">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}
