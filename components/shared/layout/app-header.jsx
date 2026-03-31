"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { Icon } from "@/components/sectionhub/ui";
import { SearchBox } from "./search-box";

function SurfaceIconButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] ${className}`}
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
        className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-[11px] font-semibold text-white"
        onClick={() => setOpen((value) => !value)}
      >
        AR
      </button>
      {open ? (
        <div className="absolute right-0 top-11 z-40 w-56 rounded-[10px] border border-[var(--border-default)] bg-white p-2 shadow-[var(--shadow-strong)]">
          <div className="rounded-[8px] bg-[var(--surface-soft)] px-3 py-2.5">
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
              className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2.5 text-left text-[12px] font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger-light)]"
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

function formatMobileTitle(pathname) {
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/sections/new")) return "Upload";
  if (pathname.startsWith("/sections/") && pathname.endsWith("/edit")) {
    return "Edit Section";
  }
  if (pathname.startsWith("/activity")) return "Activity";
  if (pathname.startsWith("/analytics")) return "Analytics";
  if (pathname.startsWith("/bundles")) return "Bundles";
  if (pathname.startsWith("/categories")) return "Categories";
  if (pathname.startsWith("/sections")) return "Sections";
  return "SectionHub";
}

export function AppHeader({ setDrawerOpen, search, setSearch }) {
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith("/settings");

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border-default)] bg-white/95 backdrop-blur-sm">
      <div className="flex h-[56px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3 md:min-w-[160px]">
          <SurfaceIconButton
            className="md:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu" className="h-4 w-4" />
          </SurfaceIconButton>
          <div className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] md:hidden">
            {formatMobileTitle(pathname)}
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <SearchBox
            mode={isSettingsPage ? "settings" : "global"}
            value={search}
            onChange={setSearch}
            placeholder={
              isSettingsPage
                ? "Search settings..."
                : "Search sections, bundles, shops..."
            }
            className="w-full max-w-[260px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <SurfaceIconButton className="relative">
            <Icon name="bell" className="h-4 w-4" />
            <span className="absolute right-[9px] top-[9px] h-2 w-2 rounded-full bg-[var(--color-primary)]" />
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
