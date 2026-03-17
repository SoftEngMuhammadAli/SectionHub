"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { navGroups } from "@/lib/data/navigation/sectionhub-nav";
import { cn } from "@/lib/utils";

const SETTINGS_SUGGESTIONS = [
  {
    id: "settings-general",
    label: "General Settings",
    meta: "Settings section",
    href: "/settings?tab=general",
  },
  {
    id: "settings-api",
    label: "API Credentials",
    meta: "Settings section",
    href: "/settings?tab=api-keys",
  },
  {
    id: "settings-team",
    label: "Team Management",
    meta: "Settings section",
    href: "/settings?tab=team",
  },
  {
    id: "settings-notifications",
    label: "Notifications",
    meta: "Settings section",
    href: "/settings?tab=notifications",
  },
  {
    id: "settings-maintenance",
    label: "Advanced Settings",
    meta: "Settings section",
    href: "/settings?tab=advanced",
  },
];

const PAGE_SUGGESTIONS = navGroups
  .flatMap((group) =>
    group.items.map((item) => ({
      id: item.href,
      label: item.label,
      meta: group.label,
      href: item.href,
    })),
  )
  .concat([
    { id: "/settings", label: "System Settings", meta: "SYSTEM", href: "/settings" },
  ]);

export function SearchBox({
  mode = "global",
  value,
  onChange,
  placeholder,
  className = "",
}) {
  const router = useRouter();
  const wrapperRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [sectionSuggestions, setSectionSuggestions] = useState([]);

  const query = String(value ?? "").trim();
  const q = query.toLowerCase();

  useEffect(() => {
    if (mode !== "global" || query.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/sections?q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );
        if (!response.ok) {
          setSectionSuggestions([]);
          return;
        }
        const payload = await response.json();
        const items = Array.isArray(payload?.items) ? payload.items : [];
        setSectionSuggestions(
          items.slice(0, 6).map((item) => ({
            id: `section-${item.id}`,
            label: item.name,
            meta: "Section",
            href: `/sections/${item.id}/edit`,
          })),
        );
      } catch {
        setSectionSuggestions([]);
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [mode, query]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const source = mode === "settings" ? SETTINGS_SUGGESTIONS : PAGE_SUGGESTIONS;
  const staticSuggestions = source
    .filter((item) => !q || item.label.toLowerCase().includes(q))
    .slice(0, mode === "settings" ? 6 : 4);

  const queryShortcut =
    mode === "global" && query
      ? [
          {
            id: "search-sections",
            label: `Search sections for "${query}"`,
            meta: "Quick action",
            href: `/sections?search=${encodeURIComponent(query)}`,
          },
        ]
      : [];

  const dynamicSectionSuggestions =
    mode === "global" && query.length >= 2 ? sectionSuggestions : [];

  const seen = new Set();
  const suggestions = [
    ...queryShortcut,
    ...staticSuggestions,
    ...dynamicSectionSuggestions,
  ]
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .slice(0, 8);

  const showDropdown = focused && suggestions.length > 0;

  const runNavigation = (href) => {
    setFocused(false);
    router.push(href);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="flex h-[40px] items-center gap-2 rounded-[10px] border border-[var(--border-default)] bg-[var(--background-page)] px-3 transition-all focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
        <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
        <input
          value={value}
          onFocus={() => setFocused(true)}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (suggestions[0]) {
                runNavigation(suggestions[0].href);
                return;
              }
              if (query && mode === "global") {
                runNavigation(`/sections?search=${encodeURIComponent(query)}`);
              }
            }
            if (event.key === "Escape") {
              setFocused(false);
            }
          }}
          className="h-full w-full bg-transparent text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
          placeholder={placeholder}
        />
      </div>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[44px] z-50 overflow-hidden rounded-[10px] border border-[var(--border-default)] bg-white shadow-[var(--shadow-soft)]">
          <ul className="max-h-[300px] overflow-auto py-1">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface-soft)]"
                  onClick={() => runNavigation(item.href)}
                >
                  <span className="text-[13px] text-[var(--text-primary)]">{item.label}</span>
                  <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                    {item.meta}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
