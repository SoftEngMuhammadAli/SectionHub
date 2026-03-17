"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

export function AppShell({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-[var(--background-app)] text-[var(--text-primary)] font-sans">
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader setDrawerOpen={setDrawerOpen} search={search} setSearch={setSearch} />
        
        {/* Mobile search bar block */}
        <div className="px-4 py-3 md:hidden border-b border-[var(--border-default)] bg-white">
            <div className="flex h-[40px] items-center gap-2 rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--background-page)] px-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
                placeholder="Search..."
              />
            </div>
        </div>

        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
