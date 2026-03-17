"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/sectionhub/ui";
import { navGroups } from "@/lib/data/navigation/sectionhub-nav";

export function AppHeader({ setDrawerOpen, search, setSearch }) {
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith("/settings");

  const pageTitle = useMemo(() => {
    const match = navGroups
      .flatMap((group) => group.items)
      .find(
        (item) =>
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href)),
      );
    return match?.label ?? "SectionHub";
  }, [pathname]);

  const searchHref = search?.trim()
    ? `/sections?search=${encodeURIComponent(search.trim())}`
    : "/sections";

  if (isSettingsPage) {
    return (
      <header className="sticky top-0 z-20 flex h-[68px] flex-col justify-center border-b border-[var(--border-default)] bg-white">
        <div className="flex min-h-14 items-center justify-between gap-3 px-4 md:px-6">
          <div className="text-[40px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
            System Settings
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden h-[40px] min-w-[280px] items-center gap-2 rounded-[10px] border border-[var(--border-default)] bg-[var(--background-page)] px-3 md:flex">
              <Icon name="search" className="h-4 w-4 text-[var(--text-tertiary)]" />
              <input
                className="h-full w-full bg-transparent text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
                placeholder="Search settings..."
              />
            </div>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)]"
            >
              <Icon name="help" className="h-[18px] w-[18px]" />
            </button>
            <button
              type="submit"
              form="settings-general-form"
              className="inline-flex min-h-10 items-center justify-center rounded-[10px] bg-[var(--color-primary)] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 flex h-[56px] flex-col justify-center border-b border-[var(--border-default)] bg-white">
      <div className="flex min-h-14 items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] md:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="hidden flex-col md:flex">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              <span>SectionHub</span>
              <span>/</span>
              <span>Admin</span>
            </div>
            <div className="mt-[2px] text-[17px] font-semibold tracking-tight text-[var(--text-primary)]">
              {pageTitle}
            </div>
          </div>
          <div className="text-[15px] font-semibold text-[var(--text-primary)] md:hidden">
            {pageTitle}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden h-[36px] min-w-[280px] items-center gap-2 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--background-page)] px-3 transition-all focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 md:flex">
            <Icon name="search" className="h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              value={search}
              onChange={(event) => setSearch?.(event.target.value)}
              className="h-full w-full bg-transparent text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
              placeholder="Search sections, bundles, shops..."
            />
          </div>
          <Link
            href={searchHref}
            className="hidden min-h-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] px-3.5 text-[12px] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] md:inline-flex"
          >
            Go
          </Link>
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)]"
          >
            <Icon name="bell" className="h-[18px] w-[18px]" />
            <span className="absolute right-[8px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-[var(--color-primary)]" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)]"
          >
            <Icon name="help" className="h-[18px] w-[18px]" />
          </button>
          <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--color-primary-light)] text-[11px] font-semibold text-[var(--color-primary-text-light)]">
            AR
          </button>
        </div>
      </div>
    </header>
  );
}
