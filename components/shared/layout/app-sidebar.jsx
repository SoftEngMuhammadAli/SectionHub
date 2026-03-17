"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Bell,
  KeyRound,
  LogOut,
  Settings,
  SquareTerminal,
  UsersRound,
} from "lucide-react";
import { logoutAction } from "@/app/actions";
import { navGroups } from "@/lib/data/navigation/sectionhub-nav";
import { Icon } from "@/components/sectionhub/ui";
import { cn } from "@/components/sectionhub/ui/cn";

const SETTINGS_TABS = [
  "general",
  "api-keys",
  "team",
  "notifications",
  "advanced",
];

const settingsNav = [
  { id: "general", label: "General", icon: Settings },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "team", label: "Team", icon: UsersRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "advanced", label: "Advanced", icon: SquareTerminal },
];

function getActiveNavHref(pathname) {
  const allItems = navGroups.flatMap((group) => group.items);
  const matches = allItems.filter((item) => {
    if (pathname === item.href) return true;
    if (item.href === "/dashboard") return false;
    return pathname.startsWith(`${item.href}/`);
  });

  if (!matches.length) return "";
  return matches.sort((a, b) => b.href.length - a.href.length)[0].href;
}

function BrandMark({ siteLogo }) {
  if (siteLogo) {
    return (
      <Image
        src={siteLogo}
        alt="Site logo"
        width={30}
        height={30}
        className="h-[30px] w-[30px] rounded-[8px] border border-[var(--border-default)] object-cover"
      />
    );
  }

  return (
    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-white">
      <Icon name="grid" className="h-4 w-4" />
    </div>
  );
}

function SettingsSidebarContent({ activeTab, setDrawerOpen, siteLogo }) {
  return (
    <>
      <div className="flex h-[60px] items-center gap-3 border-b border-[var(--border-default)] px-4">
        <BrandMark siteLogo={siteLogo} />
        <div>
          <div className="text-[18px] font-semibold text-[var(--text-primary)]">
            <Link href="/">SectionHub</Link>
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            System Admin
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 px-3 py-4">
        {settingsNav.map((item) => {
          const ItemIcon = item.icon;
          const active = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={`/settings?tab=${item.id}`}
              onClick={() => setDrawerOpen?.(false)}
              className={cn(
                "flex h-[38px] items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition-colors",
                active
                  ? "bg-[var(--sidebar-light-active-bg)] text-[var(--sidebar-light-active-text)]"
                  : "text-[var(--sidebar-light-text)] hover:bg-[var(--sidebar-light-hover)]",
              )}
            >
              <ItemIcon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-[var(--border-default)] p-4">
        <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[var(--surface-soft)] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[12px] font-medium text-[var(--color-primary)]">
              AR
            </div>
            <div>
              <div className="text-[14px] font-medium text-[var(--text-primary)]">
                Alex Rivera
              </div>
              <div className="text-[12px] text-[var(--text-secondary)]">
                Admin Role
              </div>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function GeneralSidebarContent({
  activeNavHref,
  setDrawerOpen,
  siteLogo,
}) {
  return (
    <>
      <div className="flex h-[60px] items-center gap-3 px-4">
        <BrandMark siteLogo={siteLogo} />
        <div>
          <div
            className="text-[18px] font-semibold text-white"
          >
            SectionHub
          </div>
          <div className="text-[11px] text-[var(--sidebar-text)]">
            Admin Console
          </div>
        </div>
      </div>

      <div className="sectionhub-scrollbar flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <div
              className="px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--sidebar-section-label)]"
            >
              {group.label}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = item.href === activeNavHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen?.(false)}
                    className={cn(
                      "flex h-[38px] items-center gap-3 rounded-[8px] border-l-2 px-3 text-[13px] font-medium transition-colors",
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

      <div
        className="border-t border-white/8 p-4"
      >
        <div className="rounded-[10px] bg-white/4 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[12px] font-medium text-[var(--color-primary-text-light)]">
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
          </div>
        </div>
      </div>
    </>
  );
}

export function AppSidebar({ drawerOpen, setDrawerOpen }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [siteLogo, setSiteLogo] = useState("");
  const isSettingsPage = pathname.startsWith("/settings");
  const tabParam = String(searchParams.get("tab") || "general");
  const activeTab = SETTINGS_TABS.includes(tabParam) ? tabParam : "general";
  const activeNavHref = getActiveNavHref(pathname);

  useEffect(() => {
    let ignore = false;

    async function loadSettings() {
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!ignore) {
          setSiteLogo(String(data.siteLogo ?? ""));
        }
      } catch {}
    }

    void loadSettings();
    return () => {
      ignore = true;
    };
  }, [pathname, tabParam]);

  if (isSettingsPage) {
    return (
      <>
        <aside className="hidden w-[232px] shrink-0 flex-col border-r border-[var(--border-default)] bg-white md:flex">
          <SettingsSidebarContent
            activeTab={activeTab}
            setDrawerOpen={setDrawerOpen}
            siteLogo={siteLogo}
          />
        </aside>

        {drawerOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[260px] max-w-[86vw] flex-col border-r border-[var(--border-default)] bg-white shadow-xl transition-transform md:hidden",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SettingsSidebarContent
            activeTab={activeTab}
            setDrawerOpen={setDrawerOpen}
            siteLogo={siteLogo}
          />
        </aside>
      </>
    );
  }

  return (
    <>
      <aside
        className="hidden w-[232px] shrink-0 flex-col bg-[var(--sidebar-bg)] text-white md:flex"
      >
        <GeneralSidebarContent
          activeNavHref={activeNavHref}
          setDrawerOpen={setDrawerOpen}
          siteLogo={siteLogo}
        />
      </aside>

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
          "fixed inset-y-0 left-0 z-40 flex w-[260px] max-w-[85vw] flex-col shadow-xl transition-transform md:hidden",
          "bg-[var(--sidebar-bg)] text-white",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className="flex items-center justify-between border-b border-white/8 px-4 py-3"
        >
          <div className="text-[14px] font-medium text-white">
            Navigation
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 text-white"
            onClick={() => setDrawerOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>
        <GeneralSidebarContent
          activeNavHref={activeNavHref}
          setDrawerOpen={setDrawerOpen}
          siteLogo={siteLogo}
        />
      </aside>
    </>
  );
}
