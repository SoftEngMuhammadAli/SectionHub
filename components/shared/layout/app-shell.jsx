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
    <div className="flex min-h-screen bg-[var(--background-app)] text-[var(--text-primary)] font-sans">
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader setDrawerOpen={setDrawerOpen} search={search} setSearch={setSearch} />
        
        {/* Mobile search bar block */}
        <div className="border-b border-[var(--border-default)] bg-white px-4 py-3 md:hidden">
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

        <main className="sh-page-bg flex-1 overflow-x-hidden px-4 py-5 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
