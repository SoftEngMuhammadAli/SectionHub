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

const DARK_SIDEBAR_ROUTE_PATTERNS = ["/dashboard", "/bundles"];

function matchesRoutePattern(pathname, pattern) {
  if (pathname === pattern) return true;
  if (pattern === "/dashboard") return false;
  return pathname.startsWith(`${pattern}/`);
}

function resolveSidebarTheme(pathname) {
  return DARK_SIDEBAR_ROUTE_PATTERNS.some((pattern) =>
    matchesRoutePattern(pathname, pattern),
  )
    ? "dark"
    : "light";
}

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

function SidebarGlow({ theme = "dark" }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={cn(
          "absolute left-[-72px] top-[-52px] h-40 w-40 rounded-full blur-3xl",
          theme === "dark"
            ? "bg-[var(--color-primary)]/18"
            : "bg-[var(--color-primary)]/12",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-72px] right-[-48px] h-36 w-36 rounded-full blur-3xl",
          theme === "dark"
            ? "bg-[var(--color-info)]/12"
            : "bg-[var(--color-info)]/10",
        )}
      />
    </div>
  );
}

function BrandMark({ siteLogo }) {
  if (siteLogo) {
    return (
      <Image
        src={siteLogo}
        alt="Site logo"
        width={38}
        height={38}
        className="h-[34px] w-[34px] rounded-[12px] border border-white/60 object-cover shadow-[0_10px_18px_rgba(15,23,42,0.07)]"
      />
    );
  }

  return (
    <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--color-primary)_0%,#8572ff_100%)] text-white shadow-[0_12px_22px_rgba(109,76,255,0.2)]">
      <Icon name="grid" className="h-4 w-4" />
    </div>
  );
}

function SettingsSidebarContent({ activeTab, setDrawerOpen, siteLogo }) {
  return (
    <div className="relative z-10 flex h-full flex-col">
      <div className="flex h-[64px] items-center gap-3 border-b border-[var(--border-default)]/80 px-4">
        <BrandMark siteLogo={siteLogo} />
        <div className="min-w-0">
          <div className="inline-flex rounded-full border border-[var(--border-default)] bg-white/82 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            System
          </div>
          <div className="mt-1.5 truncate text-[15px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
            <Link href="/dashboard">SectionHub</Link>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2 px-3 py-5">
        {settingsNav.map((item) => {
          const ItemIcon = item.icon;
          const active = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={`/settings?tab=${item.id}`}
              onClick={() => setDrawerOpen?.(false)}
              className={cn(
                "flex h-[38px] items-center gap-3 rounded-[12px] border px-3 text-[12px] font-medium transition-all",
                active
                  ? "border-transparent bg-[var(--sidebar-light-active-bg)] text-[var(--sidebar-light-active-text)] shadow-[0_14px_28px_rgba(109,76,255,0.14)]"
                  : "border-transparent text-[var(--sidebar-light-text)] hover:border-[var(--border-default)] hover:bg-[var(--sidebar-light-hover)] hover:text-[var(--text-primary)]",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors",
                  active ? "bg-white/70" : "bg-transparent",
                )}
              >
                <ItemIcon className="h-4 w-4" />
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-[var(--border-default)]/80 p-4">
        <div className="flex items-center justify-between gap-3 rounded-[12px] border border-white/80 bg-white/80 p-3 shadow-[0_12px_24px_rgba(15,23,42,0.045)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[12px] font-semibold text-[var(--color-primary)]">
              AR
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[var(--text-primary)]">
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
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function GeneralSidebarContent({
  activeNavHref,
  setDrawerOpen,
  siteLogo,
  theme = "dark",
}) {
  const isDark = theme === "dark";

  return (
    <div className="relative z-10 flex h-full flex-col">
      <div
        className={cn(
          "flex h-[64px] items-center gap-3 px-4",
          isDark ? "border-b border-white/8" : "border-b border-[var(--border-default)]/80",
        )}
      >
        <BrandMark siteLogo={siteLogo} />
        <div className="min-w-0">
          <div
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
              isDark
                ? "bg-white/8 text-[var(--sidebar-text)]"
                : "border border-[var(--border-default)] bg-white/82 text-[var(--text-secondary)]",
            )}
          >
            Workspace
          </div>
          <div
            className={cn(
              "mt-1.5 truncate text-[15px] font-semibold tracking-[-0.02em]",
              isDark ? "text-white" : "text-[var(--text-primary)]",
            )}
          >
            <Link href="/dashboard">SectionHub</Link>
          </div>
        </div>
      </div>

      <div className="sectionhub-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-2.5">
            <div
              className={cn(
                "px-3.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
                isDark
                  ? "text-[var(--sidebar-section-label)]"
                  : "text-[var(--text-tertiary)]",
              )}
            >
              {group.label}
            </div>

            <div className="space-y-1.5">
              {group.items.map((item) => {
                const active = item.href === activeNavHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen?.(false)}
                    className={cn(
                      "flex h-[38px] items-center gap-3 rounded-[12px] border px-3 text-[12px] font-medium transition-all",
                      isDark
                        ? active
                          ? "border-white/8 bg-[linear-gradient(135deg,rgba(109,76,255,0.28)_0%,rgba(255,255,255,0.08)_100%)] text-[var(--sidebar-active-text)] shadow-[0_18px_34px_rgba(15,23,42,0.22)]"
                          : "border-transparent text-[var(--sidebar-text)] hover:border-white/6 hover:bg-[var(--sidebar-hover)] hover:text-white"
                        : active
                          ? "border-transparent bg-[var(--sidebar-light-active-bg)] text-[var(--sidebar-light-active-text)] shadow-[0_14px_28px_rgba(109,76,255,0.14)]"
                          : "border-transparent text-[var(--sidebar-light-text)] hover:border-[var(--border-default)] hover:bg-[var(--sidebar-light-hover)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors",
                        isDark
                          ? active
                            ? "bg-white/12"
                            : "bg-transparent"
                          : active
                            ? "bg-white/72"
                            : "bg-transparent",
                      )}
                    >
                      <Icon name={item.icon} className="h-4 w-4" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "border-t p-4",
          isDark ? "border-white/8" : "border-[var(--border-default)]/80",
        )}
      >
        <div
          className={cn(
            "rounded-[12px] border p-3 backdrop-blur-xl",
            isDark
              ? "border-white/8 bg-white/6"
              : "border-white/80 bg-white/82 shadow-[0_14px_30px_rgba(15,23,42,0.05)]",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[12px] font-semibold text-[var(--color-primary)]">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "truncate text-[13px] font-semibold",
                  isDark ? "text-white" : "text-[var(--text-primary)]",
                )}
              >
                Alex Rivera
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                <span
                  className={cn(
                    isDark
                      ? "text-[var(--sidebar-text)]"
                      : "text-[var(--text-secondary)]",
                  )}
                >
                  admin@sectionhub.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({ drawerOpen, setDrawerOpen }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [siteLogo, setSiteLogo] = useState("");
  const isSettingsPage = pathname.startsWith("/settings");
  const sidebarTheme = resolveSidebarTheme(pathname);
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
        <aside className="relative hidden w-[220px] shrink-0 overflow-hidden border-r border-[var(--border-default)]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.72)_100%)] backdrop-blur-xl md:flex md:flex-col">
          <SidebarGlow theme="light" />
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
            className="fixed inset-0 z-30 bg-[#0f172a]/24 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[220px] max-w-[86vw] flex-col overflow-hidden border-r border-[var(--border-default)]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.8)_100%)] shadow-[var(--shadow-strong)] backdrop-blur-xl transition-transform md:hidden",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarGlow theme="light" />
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
        className={cn(
          "relative hidden w-[220px] shrink-0 overflow-hidden md:flex md:flex-col",
          sidebarTheme === "dark"
            ? "border-r border-white/6 bg-[linear-gradient(180deg,#0d1429_0%,#121c37_100%)] text-white"
            : "border-r border-[var(--border-default)]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.72)_100%)] text-[var(--text-primary)] backdrop-blur-xl",
        )}
      >
        <SidebarGlow theme={sidebarTheme} />
        <GeneralSidebarContent
          activeNavHref={activeNavHref}
          setDrawerOpen={setDrawerOpen}
          siteLogo={siteLogo}
          theme={sidebarTheme}
        />
      </aside>

      {drawerOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className={cn(
            "fixed inset-0 z-30 md:hidden",
            sidebarTheme === "dark" ? "bg-[#0d1429]/58" : "bg-[#0f172a]/24",
          )}
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[220px] max-w-[85vw] flex-col overflow-hidden shadow-[var(--shadow-strong)] transition-transform md:hidden",
          sidebarTheme === "dark"
            ? "border-r border-white/6 bg-[linear-gradient(180deg,#0d1429_0%,#121c37_100%)] text-white"
            : "border-r border-[var(--border-default)]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.8)_100%)] text-[var(--text-primary)] backdrop-blur-xl",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarGlow theme={sidebarTheme} />
        <div
          className={cn(
            "relative z-10 flex items-center justify-between border-b px-4 py-4",
            sidebarTheme === "dark"
              ? "border-white/8"
              : "border-[var(--border-default)]/80",
          )}
        >
          <div
            className={cn(
              "text-[14px] font-semibold",
              sidebarTheme === "dark" ? "text-white" : "text-[var(--text-primary)]",
            )}
          >
            Navigation
          </div>
          <button
            type="button"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[12px] border transition-colors",
              sidebarTheme === "dark"
                ? "border-white/10 text-white hover:bg-white/8"
                : "border-[var(--border-default)] bg-white/82 text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
            onClick={() => setDrawerOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>
        <GeneralSidebarContent
          activeNavHref={activeNavHref}
          setDrawerOpen={setDrawerOpen}
          siteLogo={siteLogo}
          theme={sidebarTheme}
        />
      </aside>
    </>
  );
}

