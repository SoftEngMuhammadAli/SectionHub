import {
  Activity,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Download,
  LayoutPanelTop,
  Plus,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/sectionhub/dashboard/service";

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function StatCard({ label, value, delta, hint, icon: Icon, tone = "success" }) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(109,76,255,0.5),transparent)]" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            {label}
          </div>
          <div className="mt-3 text-[22px] leading-none font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            {value}
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[var(--surface-soft)] text-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] ${
            tone === "danger"
              ? "bg-[var(--color-danger-light)] text-[var(--color-danger)]"
              : "bg-[var(--color-success-light)] text-[var(--color-success)]"
          }`}
        >
          {delta}
        </span>
        <span className="text-[12px] text-[var(--text-secondary)]">{hint}</span>
      </div>
    </Card>
  );
}

function PanelHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
          {eyebrow}
        </div>
        <h2 className="mt-2 text-[16px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          {title}
        </h2>
      </div>
      {action ? (
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-white/82 px-3 py-1.5 text-[12px] font-semibold text-[var(--text-secondary)] shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition-colors hover:text-[var(--text-primary)]"
        >
          {action}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function formatStatus(status) {
  if (status === "PUBLISHED") return { label: "Live", tone: "success" };
  if (status === "DRAFT") return { label: "Draft", tone: "warning" };
  return { label: status, tone: "default" };
}

function initials(value) {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const maxInstall = Math.max(...data.installsByDay.map((item) => item.value), 1);
  const weeklyTotal = data.installsByDay.reduce((sum, item) => sum + item.value, 0);
  const bestDay = data.installsByDay.reduce(
    (currentBest, item) => (item.value > currentBest.value ? item : currentBest),
    data.installsByDay[0],
  );
  const heroDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const latestSection = data.recentSections[0];
  const maxCategoryCount = Math.max(...data.categories.map((item) => item.count), 1);

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(135deg,#10192f_0%,#1b2649_48%,#6d4cff_100%)] px-6 py-6 text-white shadow-[0_28px_70px_rgba(15,23,42,0.24)] md:px-7 md:py-7">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-80px] top-[-80px] h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-80px] h-64 w-64 rounded-full bg-[#93c5fd]/18 blur-3xl" />
        </div>

        <div className="relative grid gap-6 xl:grid-cols-[1.45fr_0.95fr] xl:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" />
              Operations Snapshot
            </div>

            <div className="max-w-[720px]">
              <h1 className="text-[22px] font-semibold tracking-[-0.05em] text-white md:text-[26px]">
                Good morning, Admin
              </h1>
              <p className="mt-3 max-w-[620px] text-[15px] leading-7 text-white/72 md:text-[16px]">
                {heroDate} - Review catalog health, release readiness, and commercial momentum across the workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 text-[12px] font-medium text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
                <ShieldCheck className="h-3.5 w-3.5" />
                Catalog sync active
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
                <Boxes className="h-3.5 w-3.5" />
                {bestDay.label} is trending strongest
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1.5 backdrop-blur-xl">
                <Activity className="h-3.5 w-3.5" />
                {weeklyTotal} installs tracked this week
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[14px] border border-white/14 bg-white/10 px-4 text-[13px] font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/16"
              >
                <Download className="h-4 w-4" />
                Quick Export
              </button>
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[14px] bg-white px-4 text-[13px] font-semibold text-[var(--text-primary)] shadow-[0_18px_34px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-[1px]"
              >
                <Plus className="h-4 w-4" />
                Upload Section
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[14px] border border-white/14 bg-white/10 p-4 backdrop-blur-xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/64">
                Latest Upload
              </div>
              <div className="mt-3 text-[16px] font-semibold tracking-[-0.03em] text-white">
                {latestSection?.name ?? "No recent uploads"}
              </div>
              <div className="mt-1 text-[12px] text-white/64">
                {latestSection?.updatedAt ?? "Waiting for new catalog activity"}
              </div>
            </div>

            <div className="rounded-[14px] border border-white/14 bg-white/10 p-4 backdrop-blur-xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/64">
                Revenue Pace
              </div>
              <div className="mt-3 text-[20px] font-semibold tracking-[-0.04em] text-white">
                {data.overview.revenueMonth}
              </div>
              <div className="mt-1 text-[12px] text-white/64">Projected to close 15.2% ahead</div>
            </div>

            <div className="rounded-[14px] border border-white/14 bg-white/10 p-4 backdrop-blur-xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/64">
                Active Stores
              </div>
              <div className="mt-3 text-[20px] font-semibold tracking-[-0.04em] text-white">
                {data.overview.activeShops}
              </div>
              <div className="mt-1 text-[12px] text-white/64">Healthy merchant footprint with low churn</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Sections"
          value={data.overview.totalSections}
          delta="+4%"
          hint="4 new uploads this week"
          icon={LayoutPanelTop}
        />
        <StatCard
          label="Total Installs"
          value={compactNumber.format(data.overview.totalInstalls)}
          delta="+12%"
          hint={`Best day: ${bestDay.label}`}
          icon={Boxes}
        />
        <StatCard
          label="Revenue This Month"
          value={data.overview.revenueMonth}
          delta="-5%"
          hint="Recovery pace improving"
          icon={CircleDollarSign}
          tone="danger"
        />
        <StatCard
          label="Active Shops"
          value={data.overview.activeShops}
          delta="+8%"
          hint="23 accounts marked high-retention"
          icon={Store}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.68fr_1fr]">
        <div className="space-y-4">
          <Card className="p-5 md:p-6">
            <PanelHeader
              eyebrow="Install Velocity"
              title="Installs this week"
              action="View analytics"
            />

            <div className="mt-5 grid gap-3 rounded-[14px] border border-[var(--border-default)] bg-[linear-gradient(180deg,rgba(109,76,255,0.08)_0%,rgba(109,76,255,0.02)_100%)] p-4 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                  Weekly total
                </div>
                <div className="mt-2 text-[22px] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                  {weeklyTotal}
                </div>
                <div className="mt-1 text-[13px] text-[var(--text-secondary)]">
                  {bestDay.label} delivered the strongest install volume.
                </div>
              </div>
              <div className="rounded-full bg-white/82 px-3 py-1.5 text-[12px] font-semibold text-[var(--color-primary)] shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
                +14.8% week over week
              </div>
            </div>

            <div className="relative mt-6">
              <div className="pointer-events-none absolute inset-0 grid grid-rows-4 gap-0">
                {[0, 1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="border-t border-dashed border-[var(--border-default)]/70"
                  />
                ))}
              </div>

              <div className="relative grid h-[260px] grid-cols-7 items-end gap-3">
                {data.installsByDay.map((item) => {
                  const active = item.label === bestDay.label;
                  const height = Math.max((item.value / maxInstall) * 188, 28);

                  return (
                    <div key={item.label} className="flex h-full flex-col items-center justify-end gap-3">
                      <div className="flex w-full flex-1 items-end justify-center">
                        <div
                          className={active ? "relative w-full rounded-[14px] bg-[linear-gradient(180deg,var(--color-primary)_0%,#8a78ff_100%)] shadow-[0_18px_34px_rgba(109,76,255,0.26)]" : "relative w-full rounded-[14px] bg-[linear-gradient(180deg,rgba(109,76,255,0.28)_0%,rgba(109,76,255,0.14)_100%)]"}
                          style={{ height: `${height}px` }}
                        >
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-1 font-mono text-[10px] font-semibold text-[var(--text-primary)] shadow-[0_8px_16px_rgba(15,23,42,0.08)]">
                            {item.value}
                          </span>
                        </div>
                      </div>
                      <span className={active ? "font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]" : "font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]"}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5 md:p-6">
              <PanelHeader
                eyebrow="Leaderboard"
                title="Top sections by installs"
              />
              <div className="mt-5 space-y-3">
                {data.topSections.slice(0, 4).map((item, index) => (
                  <div
                    key={item.slug}
                    className="flex items-center justify-between gap-3 rounded-[16px] border border-[var(--border-default)] bg-white/72 px-4 py-3.5"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--surface-soft)] font-mono text-[12px] font-semibold text-[var(--color-primary)]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[14px] font-semibold text-[var(--text-primary)]">
                          {item.name}
                        </div>
                        <div className="truncate font-mono text-[11px] text-[var(--text-tertiary)]">
                          {item.slug}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[14px] font-semibold text-[var(--text-primary)]">
                        {item.installs}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                        installs
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 md:p-6">
              <PanelHeader
                eyebrow="Revenue"
                title="Revenue trend"
              />
              <div className="mt-5 rounded-[14px] border border-[var(--border-default)] bg-[linear-gradient(180deg,rgba(109,76,255,0.16)_0%,rgba(109,76,255,0.03)_100%)] p-4">
                <svg viewBox="0 0 320 148" className="h-[150px] w-full">
                  <defs>
                    <linearGradient id="dashboard-revenue-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(109,76,255,0.34)" />
                      <stop offset="100%" stopColor="rgba(109,76,255,0.02)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 108 C34 92, 60 104, 92 76 S152 22, 182 54 S244 126, 320 30 L320 148 L0 148 Z"
                    fill="url(#dashboard-revenue-fill)"
                  />
                  <path
                    d="M0 108 C34 92, 60 104, 92 76 S152 22, 182 54 S244 126, 320 30"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    This month
                  </div>
                  <div className="mt-2 font-mono text-[22px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    {data.overview.revenueMonth}
                  </div>
                  <div className="mt-1 text-[13px] text-[var(--text-secondary)]">
                    Tracking above the previous 30-day average.
                  </div>
                </div>
                <div className="rounded-full bg-[var(--color-success-light)] px-3 py-1.5 text-[12px] font-semibold text-[var(--color-success)]">
                  +15.2%
                </div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="flex flex-col gap-3 border-b border-[var(--border-default)] px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                  Latest releases
                </div>
                <h3 className="mt-2 text-[16px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                  Latest uploaded sections
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-white/82 px-3 py-1.5 text-[12px] font-semibold text-[var(--text-secondary)] shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition-colors hover:text-[var(--text-primary)]"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[var(--background-page)]/90">
                  <tr className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    <th className="px-5 py-3">Section</th>
                    <th className="px-5 py-3">Uploader</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSections.slice(0, 4).map((item) => {
                    const statusMeta = formatStatus(item.status);
                    return (
                      <tr
                        key={item.id}
                        className="border-t border-[var(--border-default)] text-[14px] text-[var(--text-secondary)]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--surface-soft)] text-[12px] font-semibold text-[var(--color-primary)]">
                              {initials(item.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-[var(--text-primary)]">
                                {item.name}
                              </div>
                              <div className="truncate font-mono text-[11px] text-[var(--text-tertiary)]">
                                {item.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">Admin Team</td>
                        <td className="px-5 py-4 font-mono text-[13px]">
                          {item.updatedAt}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Badge tone={statusMeta.tone} label={statusMeta.label} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 md:p-6">
            <PanelHeader eyebrow="Shortcuts" title="Quick filters" />
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Badge label="All Sections" variant="default" />
              <Badge label="Shopify" tone="default" />
              <Badge label="Liquid" tone="default" />
              <Badge label="React" tone="default" />
              <Badge label="High Converting" tone="default" />
              <Badge label="Recently Updated" tone="default" />
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <PanelHeader eyebrow="Timeline" title="Recent activity feed" />
            <div className="relative mt-5 space-y-4 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-[var(--border-default)]">
              {data.activity.slice(0, 4).map((item, index) => (
                <div key={`${item.actor}-${item.target}-${index}`} className="relative flex gap-4">
                  <span
                    className={index === 0 ? "relative z-10 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[11px] font-semibold text-[var(--color-primary)]" : "relative z-10 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[11px] font-semibold text-[var(--text-secondary)]"}
                  >
                    {initials(item.actor || "A")}
                  </span>
                  <div>
                    <div className="text-[14px] leading-6 text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item.actor}
                      </span>{" "}
                      {item.action}{" "}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item.target}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-[var(--text-tertiary)]">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <PanelHeader eyebrow="Infrastructure" title="System health" />
            <div className="mt-5 space-y-4 text-[14px]">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[var(--text-secondary)]">API Gateway</span>
                  <span className="text-[12px] font-semibold text-[var(--color-success)]">
                    ONLINE
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-success-light)]" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[var(--text-secondary)]">Storage Usage</span>
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                    64% FULL
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                  <div className="h-full w-[64%] rounded-full bg-[linear-gradient(90deg,var(--color-primary)_0%,#8a78ff_100%)]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[var(--text-secondary)]">CDN Propagation</span>
                  <span className="text-[12px] font-semibold text-[var(--color-success)]">
                    HEALTHY
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-success-light)]" />
              </div>
            </div>
            <div className="mt-4 rounded-[14px] bg-[var(--surface-muted)]/80 px-3.5 py-3 text-[12px] text-[var(--text-secondary)]">
              Last sync window closed at 08:42 UTC with no failed jobs.
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <PanelHeader eyebrow="Catalog mix" title="Top categories" />
            <div className="mt-5 space-y-4">
              {data.categories.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-[13px]">
                    <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                    <span className="font-mono text-[var(--text-secondary)]">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary)_0%,#8a78ff_100%)]"
                      style={{ width: `${Math.max((item.count / maxCategoryCount) * 100, 18)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

