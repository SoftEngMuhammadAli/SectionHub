"use client";

import { useEffect, useMemo, useState } from "react";
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
    if (item.href === "/sections/new") return false;
    if (pathname === item.href) return true;
    if (item.href === "/dashboard") return false;
    return pathname.startsWith(`${item.href}/`);
  });

  if (!matches.length) return "";
  return matches.sort((a, b) => b.href.length - a.href.length)[0].href;
}

function BrandMark({ siteLogo }) {
  const [brokenLogoSrc, setBrokenLogoSrc] = useState("");

  if (siteLogo && brokenLogoSrc !== siteLogo) {
    return (
      <Image
        src={siteLogo}
        alt="Site logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] object-cover"
        onError={() => setBrokenLogoSrc(siteLogo)}
      />
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-white">
      <Icon name="grid" className="h-4 w-4" />
    </div>
  );
}

function SidebarUser({ dark = false }) {
  return (
    <div
      className={cn(
        "rounded-[10px] px-4 py-3",
        dark ? "bg-white/6" : "border border-[var(--border-default)] bg-white",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[11px] font-semibold text-[var(--color-primary)]">
          AR
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "truncate text-[12px] font-semibold",
              dark ? "text-white" : "text-[var(--text-primary)]",
            )}
          >
            Alex Rivera
          </div>
          <div
            className={cn(
              "truncate text-[11px]",
              dark
                ? "text-[var(--sidebar-text)]"
                : "text-[var(--text-secondary)]",
            )}
          >
            {dark ? "Admin Account" : "Admin Access"}
          </div>
        </div>
        {!dark ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

function SettingsSidebarContent({ activeTab, setDrawerOpen, siteLogo }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[76px] items-center gap-3 border-b border-[var(--border-default)] px-4">
        <BrandMark siteLogo={siteLogo} />
        <div className="min-w-0">
          <div className="truncate text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            <Link href="/dashboard">SectionHub</Link>
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            System Admin
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-1 px-3 py-6">
        {settingsNav.map((item) => {
          const ItemIcon = item.icon;
          const active = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={`/settings?tab=${item.id}`}
              onClick={() => setDrawerOpen?.(false)}
              className={cn(
                "flex h-10 items-center gap-3 rounded-[8px] px-3 text-[13px] font-medium transition-colors",
                active
                  ? "bg-[var(--sidebar-light-active-bg)] text-[var(--sidebar-light-active-text)]"
                  : "text-[var(--sidebar-light-text)] hover:bg-[var(--sidebar-light-hover)] hover:text-[var(--text-primary)]",
              )}
            >
              <ItemIcon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-[var(--border-default)] p-4">
        <SidebarUser />
      </div>
    </div>
  );
}

function BundlePromo() {
  return (
    <div className="rounded-[10px] bg-[#1b2340] p-4">
      <div className="text-[12px] font-semibold text-white">Growth Plan</div>
      <div className="mt-1 text-[11px] leading-5 text-[var(--sidebar-text)]">
        You&apos;ve reached 80% of your section limit.
      </div>
      <button
        type="button"
        className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-3 text-[12px] font-semibold text-white"
      >
        Upgrade Now
      </button>
    </div>
  );
}

function GeneralSidebarContent({
  activeNavHref,
  pathname,
  setDrawerOpen,
  siteLogo,
  theme = "dark",
}) {
  const isDark = theme === "dark";

  const visibleGroups = useMemo(
    () =>
      navGroups.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.href !== "/sections/new"),
      })),
    [],
  );

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-[76px] items-center gap-3 px-4",
          isDark
            ? "border-b border-white/8"
            : "border-b border-[var(--border-default)]",
        )}
      >
        <BrandMark siteLogo={siteLogo} />
        <div className="min-w-0">
          <div
            className={cn(
              "truncate text-[18px] font-semibold tracking-[-0.03em]",
              isDark ? "text-white" : "text-[var(--text-primary)]",
            )}
          >
            <Link href="/dashboard">SectionHub</Link>
          </div>
          <div
            className={cn(
              "text-[11px]",
              isDark
                ? "text-[var(--sidebar-text)]"
                : "text-[var(--text-secondary)]",
            )}
          >
            {isDark ? "Admin Console" : "Design System Manager"}
          </div>
        </div>
      </div>

      <div className="sectionhub-scrollbar flex-1 overflow-y-auto px-3 py-5">
        {visibleGroups.map((group) => (
          <div key={group.label} className="mb-6 space-y-1">
            <div
              className={cn(
                "px-3 text-[10px] font-semibold uppercase tracking-[0.12em]",
                isDark
                  ? "text-[var(--sidebar-section-label)]"
                  : "text-[var(--text-tertiary)]",
              )}
            >
              {group.label}
            </div>

            {group.items.map((item) => {
              const active = item.href === activeNavHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen?.(false)}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-[8px] px-3 text-[13px] font-medium transition-colors",
                    isDark
                      ? active
                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]"
                        : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white"
                      : active
                        ? "bg-[var(--sidebar-light-active-bg)] text-[var(--sidebar-light-active-text)]"
                        : "text-[var(--sidebar-light-text)] hover:bg-[var(--sidebar-light-hover)] hover:text-[var(--text-primary)]",
                  )}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "space-y-3 border-t p-4",
          isDark ? "border-white/8" : "border-[var(--border-default)]",
        )}
      >
        {pathname.startsWith("/bundles") ? <BundlePromo /> : null}
        <SidebarUser dark={isDark} />
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
        <aside className="hidden w-[216px] shrink-0 border-r border-[var(--border-default)] bg-white md:flex md:flex-col">
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
            className="fixed inset-0 z-30 bg-[#0f172a]/28 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[216px] max-w-[86vw] flex-col border-r border-[var(--border-default)] bg-white shadow-[var(--shadow-strong)] transition-transform md:hidden",
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
        className={cn(
          "hidden w-[192px] shrink-0 border-r md:flex md:flex-col",
          sidebarTheme === "dark"
            ? "border-white/8 bg-[var(--sidebar-bg)] text-white"
            : "border-[var(--border-default)] bg-white text-[var(--text-primary)]",
        )}
      >
        <GeneralSidebarContent
          activeNavHref={activeNavHref}
          pathname={pathname}
          setDrawerOpen={setDrawerOpen}
          siteLogo={siteLogo}
          theme={sidebarTheme}
        />
      </aside>

      {drawerOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-[#0f172a]/32 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[192px] max-w-[85vw] flex-col border-r shadow-[var(--shadow-strong)] transition-transform md:hidden",
          sidebarTheme === "dark"
            ? "border-white/8 bg-[var(--sidebar-bg)] text-white"
            : "border-[var(--border-default)] bg-white text-[var(--text-primary)]",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <GeneralSidebarContent
          activeNavHref={activeNavHref}
          pathname={pathname}
          setDrawerOpen={setDrawerOpen}
          siteLogo={siteLogo}
          theme={sidebarTheme}
        />
      </aside>
    </>
  );
}
