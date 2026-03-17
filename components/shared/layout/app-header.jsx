"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { Icon } from "@/components/sectionhub/ui";
import { navGroups } from "@/lib/data/navigation/sectionhub-nav";
import { SearchBox } from "./search-box";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function onDocClick(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--color-primary-light)] text-[11px] font-medium text-[var(--color-primary-text-light)]"
        onClick={() => setOpen((value) => !value)}
      >
        AR
      </button>
      {open ? (
        <div className="absolute right-0 top-10 z-40 w-48 rounded-[10px] border border-[var(--border-default)] bg-white p-2 shadow-[var(--shadow-soft)]">
          <div className="px-2 py-1.5">
            <div className="text-[13px] font-medium text-[var(--text-primary)]">
              Alex Rivera
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              admin@sectionhub.com
            </div>
          </div>
          <div className="my-1 h-px bg-[var(--border-default)]" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-[8px] px-2 py-2 text-left text-[13px] text-[var(--danger)] transition-colors hover:bg-[var(--danger-light)]/60"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function AppHeader({ setDrawerOpen, search, setSearch }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSettingsPage = pathname.startsWith("/settings");
  const activeSettingsTab = String(searchParams.get("tab") || "general");

  const saveButtonFormId =
    activeSettingsTab === "notifications"
      ? "settings-notifications-form"
      : activeSettingsTab === "advanced"
        ? "settings-advanced-form"
        : "settings-general-form";

  const canSubmitFromHeader = ["general", "notifications", "advanced"].includes(
    activeSettingsTab,
  );

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

  if (isSettingsPage) {
    return (
      <header className="sticky top-0 z-20 border-b border-[var(--border-default)] bg-white">
        <div className="flex h-[56px] items-center justify-between gap-3 px-4 md:px-6">
          <div className="text-[24px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            System Settings
          </div>

          <div className="flex items-center gap-3">
            <SearchBox
              mode="settings"
              value={search}
              onChange={setSearch}
              placeholder="Search settings..."
              className="hidden min-w-[280px] md:block"
            />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)]"
            >
              <Icon name="help" className="h-4 w-4" />
            </button>
            {canSubmitFromHeader ? (
              <button
                type="submit"
                form={saveButtonFormId}
                className="inline-flex min-h-9 items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                Save Changes
              </button>
            ) : null}
            <UserMenu />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border-default)] bg-white">
      <div className="flex h-[56px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] md:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu" />
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Admin
            </span>
            <span className="text-[12px] text-[var(--text-tertiary)]">/</span>
            <span className="text-[18px] font-semibold text-[var(--text-primary)]">
              {pageTitle}
            </span>
          </div>

          <div className="text-[16px] font-semibold text-[var(--text-primary)] md:hidden">
            {pageTitle}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <SearchBox
            mode="global"
            value={search}
            onChange={setSearch}
            placeholder="Search sections, bundles, shops..."
            className="hidden min-w-[280px] md:block"
          />
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)]"
          >
            <Icon name="bell" className="h-4 w-4" />
            <span className="absolute right-[8px] top-[8px] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-soft)]"
          >
            <Icon name="help" className="h-4 w-4" />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
