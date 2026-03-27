"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { Icon } from "@/components/sectionhub/ui";
import { navGroups } from "@/lib/data/navigation/sectionhub-nav";
import { SearchBox } from "./search-box";

function SurfaceIconButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`flex h-9 w-9 items-center justify-center rounded-[12px] border border-white/80 bg-white/76 text-[var(--text-secondary)] shadow-[0_12px_24px_rgba(15,23,42,0.045)] backdrop-blur-xl transition-all hover:-translate-y-[1px] hover:text-[var(--text-primary)] hover:shadow-[0_16px_28px_rgba(15,23,42,0.07)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

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
        className="ml-1 flex h-9 w-9 items-center justify-center rounded-[12px] border border-white/70 bg-[linear-gradient(135deg,var(--color-primary-light)_0%,#faf8ff_100%)] text-[10px] font-semibold text-[var(--color-primary-text-light)] shadow-[0_14px_24px_rgba(109,76,255,0.11)] transition-all hover:-translate-y-[1px] hover:shadow-[0_16px_28px_rgba(109,76,255,0.14)]"
        onClick={() => setOpen((value) => !value)}
      >
        AR
      </button>
      {open ? (
        <div className="absolute right-0 top-11 z-40 w-56 rounded-[12px] border border-[var(--border-default)] bg-white/95 p-2 shadow-[var(--shadow-strong)] backdrop-blur-xl">
          <div className="rounded-[12px] bg-[var(--surface-muted)]/70 px-3 py-2.5">
            <div className="text-[12px] font-semibold text-[var(--text-primary)]">
              Alex Rivera
            </div>
            <div className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
              admin@sectionhub.com
            </div>
          </div>
          <div className="my-2 h-px bg-[var(--border-default)]" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2.5 text-left text-[12px] font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger-light)]/80"
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
      <header className="sticky top-0 z-20 border-b border-[var(--border-default)]/80 bg-white/72 backdrop-blur-xl">
        <div className="flex h-[60px] items-center justify-between gap-3 px-4 md:px-5">
          <div className="min-w-0">
            <div className="inline-flex rounded-full border border-[var(--border-default)] bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)] shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              Configuration
            </div>
            <div className="mt-1.5 truncate text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)] md:text-[20px]">
              System Settings
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <SearchBox
              mode="settings"
              value={search}
              onChange={setSearch}
              placeholder="Search settings..."
              className="hidden min-w-[280px] md:block"
            />
            <SurfaceIconButton>
              <Icon name="help" className="h-4 w-4" />
            </SurfaceIconButton>
            {canSubmitFromHeader ? (
              <button
                type="submit"
                form={saveButtonFormId}
                className="inline-flex min-h-9 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--color-primary)_0%,#8572ff_100%)] px-3.5 text-[12px] font-semibold text-white shadow-[0_14px_26px_rgba(109,76,255,0.18)] transition-all hover:-translate-y-[1px] hover:shadow-[0_18px_30px_rgba(109,76,255,0.22)]"
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
    <header className="sticky top-0 z-20 border-b border-[var(--border-default)]/70 bg-white/70 backdrop-blur-xl">
      <div className="flex h-[60px] items-center justify-between gap-3 px-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SurfaceIconButton className="md:hidden" onClick={() => setDrawerOpen(true)}>
            <Icon name="menu" className="h-4 w-4" />
          </SurfaceIconButton>

          <div className="hidden min-w-0 md:flex md:flex-col">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
              <span className="rounded-full border border-[var(--border-default)] bg-white/80 px-3 py-1 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                Admin Console
              </span>
              <span className="text-[var(--text-faint)]">/</span>
              <span>{pageTitle}</span>
            </div>
            <div className="mt-1 truncate text-[16px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              {pageTitle}
            </div>
          </div>

          <div className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] md:hidden">
            {pageTitle}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <SearchBox
            mode="global"
            value={search}
            onChange={setSearch}
            placeholder="Search sections, bundles, shops..."
            className="hidden min-w-[300px] md:block"
          />
          <SurfaceIconButton className="relative">
            <Icon name="bell" className="h-4 w-4" />
            <span className="absolute right-[9px] top-[9px] h-2 w-2 rounded-full bg-[var(--color-primary)] ring-2 ring-white" />
          </SurfaceIconButton>
          <SurfaceIconButton>
            <Icon name="help" className="h-4 w-4" />
          </SurfaceIconButton>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

