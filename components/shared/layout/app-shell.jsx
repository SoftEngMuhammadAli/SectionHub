"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { Icon } from "@/components/sectionhub/ui";

export function AppShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith("/settings");

  return (
    <div className="flex min-h-screen bg-[var(--background-app)] text-[var(--text-primary)] font-sans">
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader setDrawerOpen={setDrawerOpen} search={search} setSearch={setSearch} />
        
        {/* Mobile search bar block */}
        <div className="border-b border-[var(--border-default)] bg-white px-4 py-3 md:hidden">
            <div className="flex h-[40px] items-center gap-2 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--background-page)] px-3">
              <Icon name="search" className="h-4 w-4 text-[var(--text-tertiary)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
                placeholder={
                  isSettingsPage
                    ? "Search settings..."
                    : "Search sections, bundles, shops..."
                }
              />
            </div>
        </div>

        <main className="sh-page-bg flex-1 overflow-x-hidden px-4 py-5 md:px-6 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
