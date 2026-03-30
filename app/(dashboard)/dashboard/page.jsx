import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/sectionhub/dashboard/service";

function StatCard({ label, value, delta, tone = "success" }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[12px] font-medium text-[var(--text-secondary)]">
          {label}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            tone === "danger"
              ? "bg-[var(--danger-light)] text-[var(--danger)]"
              : "bg-[var(--success-light)] text-[var(--success)]"
          }`}
        >
          {delta}
        </span>
      </div>
      <div className="mt-3 text-[22px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
        {value}
      </div>
    </Card>
  );
}

function initials(value) {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function statusMeta(status) {
  if (status === "PUBLISHED") return { label: "LIVE", tone: "success" };
  if (status === "DRAFT") return { label: "REVIEW", tone: "warning" };
  return { label: "ARCHIVED", tone: "default" };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const maxInstall = Math.max(...data.installsByDay.map((item) => item.value), 1);
  const maxCategoryCount = Math.max(...data.categories.map((item) => item.count), 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          Good morning, Admin
        </h1>
        <div className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[var(--border-default)] bg-white px-3 text-[12px] text-[var(--text-secondary)]">
          <CalendarDays className="h-4 w-4" />
          Oct 24, 2023
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Sections"
          value={String(data.overview.totalSections)}
          delta="+4%"
        />
        <StatCard
          label="Total Installs"
          value={new Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(data.overview.totalInstalls)}
          delta="+12%"
        />
        <StatCard
          label="Revenue This Month"
          value={data.overview.revenueMonth}
          delta="-5%"
          tone="danger"
        />
        <StatCard
          label="Active Shops"
          value={String(data.overview.activeShops)}
          delta="+8%"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Installs this week
            </h2>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Daily totals
            </div>
          </div>
          <div className="grid h-[160px] grid-cols-7 items-end gap-3">
            {data.installsByDay.map((item, index) => {
              const active = index === 2;
              const height = Math.max((item.value / maxInstall) * 110, 24);
              return (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div
                    className={
                      active
                        ? "w-full rounded-t-[8px] bg-[linear-gradient(180deg,var(--color-primary)_0%,#8b77ff_100%)]"
                        : "w-full rounded-t-[8px] bg-[rgba(109,76,255,0.24)]"
                    }
                    style={{ height: `${height}px` }}
                  />
                  <span
                    className={
                      active
                        ? "text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]"
                        : "text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]"
                    }
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Quick filters
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-semibold text-white">
                All Sections
              </span>
              <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                Shopify
              </span>
              <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                Liquid
              </span>
              <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                React
              </span>
              <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)]">
                High Converting
              </span>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Recent activity feed
            </h2>
            <div className="mt-4 space-y-4">
              {data.activity.slice(0, 4).map((item, index) => (
                <div key={`${item.actor}-${item.target}-${index}`} className="flex gap-3">
                  <span
                    className={`mt-1 inline-flex h-5 w-5 shrink-0 rounded-full border-2 ${
                      index === 0
                        ? "border-[var(--color-primary)]"
                        : index === 1
                          ? "border-[#2ecf8f]"
                          : "border-[var(--border-strong)]"
                    }`}
                  />
                  <div>
                    <div className="text-[13px] leading-6 text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item.actor}
                      </span>{" "}
                      {item.action}{" "}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item.target}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.1fr_0.85fr]">
        <Card className="p-5">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Top sections by installs
          </h2>
          <div className="mt-4 space-y-3">
            {data.topSections.slice(0, 3).map((item, index) => (
              <div
                key={item.slug}
                className="flex items-center justify-between rounded-[8px] border border-[var(--border-default)] px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--surface-soft)] text-[11px] font-semibold text-[var(--color-primary)]">
                    {initials(item.name || String(index + 1))}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--text-primary)]">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)]">
                      {item.installs} installs
                    </div>
                  </div>
                </div>
                <div className="text-[var(--text-tertiary)]">↗</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Revenue trend
          </h2>
          <div className="mt-4 rounded-[8px] bg-[linear-gradient(180deg,rgba(109,76,255,0.14)_0%,rgba(109,76,255,0.04)_100%)] p-4">
            <svg viewBox="0 0 320 140" className="h-[120px] w-full">
              <path
                d="M0 95 C34 84, 76 88, 108 64 S170 18, 205 54 S262 118, 320 46"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0 115 C34 104, 76 108, 108 84 S170 38, 205 74 S262 138, 320 66"
                fill="rgba(109,76,255,0.1)"
                stroke="none"
              />
            </svg>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Projected
              </div>
              <div className="mt-1 text-[22px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                $10,250
              </div>
            </div>
            <div className="text-[12px] font-semibold text-[var(--success)]">+15.2%</div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            System health
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-secondary)]">API Gateway</span>
                <span className="font-semibold text-[var(--success)]">ONLINE</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--success-light)]" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-secondary)]">Storage Usage</span>
                <span className="font-semibold text-[var(--text-primary)]">64% FULL</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--surface-soft)]">
                <div className="h-1.5 w-[64%] rounded-full bg-[var(--color-primary)]" />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-secondary)]">CDN Propagation</span>
                <span className="font-semibold text-[var(--success)]">HEALTHY</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--success-light)]" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-5 py-4">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Latest uploaded sections
          </h2>
          <button
            type="button"
            className="text-[12px] font-semibold text-[var(--color-primary)]"
          >
            View All
          </button>
        </div>
        <div className="sectionhub-table-scroll">
          <table className="min-w-full table-fixed text-left">
            <thead className="border-b border-[var(--border-default)] bg-[var(--background-page)]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <th className="w-[36%] px-5 py-3">Section Name</th>
                <th className="w-[24%] px-5 py-3">Uploader</th>
                <th className="w-[20%] px-5 py-3">Date</th>
                <th className="w-[20%] px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSections.slice(0, 3).map((item) => {
                const meta = statusMeta(item.status);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--border-default)] text-[13px] last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-[var(--text-primary)]">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">Admin</td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">
                      {item.updatedAt}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Badge tone={meta.tone} label={meta.label} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
