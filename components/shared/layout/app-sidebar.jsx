"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "@/lib/data/navigation/sectionhub-nav";
import { Badge, Icon } from "@/components/sectionhub/ui";
import { cn } from "@/components/sectionhub/ui/cn";

export function AppSidebar({ drawerOpen, setDrawerOpen }) {
  const pathname = usePathname();

  const navContent = (
    <>
      <div className="flex h-[60px] items-center gap-3 px-5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-[var(--color-primary)] text-white">
          <Icon name="grid" className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-white">SectionHub</div>
          <div className="flex items-center gap-2 text-[11px] text-[var(--sidebar-text)]">
            <span>Admin</span>
            <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]">
              Internal
            </span>
          </div>
        </div>
      </div>

      <div className="sectionhub-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <div className="px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--sidebar-section-label)]">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen?.(false)}
                    className={cn(
                      "flex h-[38px] items-center gap-3 rounded-[10px] border-l-2 px-3 text-[13px] transition-colors",
                      active
                        ? "border-[var(--sidebar-active-border)] bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]"
                        : "border-transparent text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white",
                    )}
                  >
                    <Icon name={item.icon} className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/8 p-4">
        <div className="flex items-center gap-3 rounded-[12px] bg-white/4 p-3 hover:bg-[var(--sidebar-hover)] cursor-pointer transition-colors">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] font-semibold text-[var(--color-primary-text-light)]">
            AR
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-white">
              Alex Rivera
            </div>
            <div className="truncate text-[11px] text-[var(--sidebar-text)]">
              admin@sectionhub.com
            </div>
          </div>
          <Badge
            variant="default"
            className="bg-[var(--color-primary)] border-none"
          >
            Admin
          </Badge>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-[232px] shrink-0 flex-col bg-[var(--sidebar-bg)] text-white md:flex">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-[#0b1020]/50 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] max-w-[85vw] flex-col bg-[var(--sidebar-bg)] text-white shadow-xl transition-transform md:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div className="text-[14px] font-semibold text-white">Navigation</div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 text-white hover:bg-white/10"
            onClick={() => setDrawerOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
