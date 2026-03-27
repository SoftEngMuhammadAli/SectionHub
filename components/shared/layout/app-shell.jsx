"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { SearchBox } from "./search-box";

export function AppShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith("/settings");

  return (
    <div className="relative flex min-h-screen bg-[var(--background-app)] text-[var(--text-primary)] font-sans">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-140px] top-[-100px] h-[320px] w-[320px] rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="absolute right-[-120px] top-[120px] h-[280px] w-[280px] rounded-full bg-[var(--color-info)]/10 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[18%] h-[300px] w-[300px] rounded-full bg-[var(--color-primary)]/8 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen w-full">
        <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader
            setDrawerOpen={setDrawerOpen}
            search={search}
            setSearch={setSearch}
          />

          <div className="border-b border-[var(--border-default)]/80 bg-white/68 px-4 py-2.5 backdrop-blur-xl md:hidden">
            <SearchBox
              mode={isSettingsPage ? "settings" : "global"}
              value={search}
              onChange={setSearch}
              placeholder={
                isSettingsPage
                  ? "Search settings..."
                  : "Search sections, bundles, shops..."
              }
            />
          </div>

          <main className="sh-page-bg flex-1 overflow-x-hidden px-4 pb-7 pt-5 md:px-5 md:pb-8 md:pt-5">
            <div className="mx-auto w-full max-w-[1200px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

