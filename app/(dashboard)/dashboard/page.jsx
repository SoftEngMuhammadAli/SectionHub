import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/sectionhub/dashboard/service";

function StatCard({ label, value, delta, tone = "success" }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-medium text-[var(--text-secondary)]">
          {label}
        </div>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
            tone === "danger"
              ? "bg-[var(--danger-light)] text-[var(--danger)]"
              : "bg-[var(--success-light)] text-[var(--success)]"
          }`}
        >
          {delta}
        </span>
      </div>
      <div className="mt-3 text-[34px] leading-none font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
        {value}
      </div>
    </Card>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const maxInstall = Math.max(...data.installsByDay.map((item) => item.value), 1);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">
          Good morning, Admin
        </h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Sections"
          value={data.overview.totalSections}
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
          value={data.overview.activeShops}
          delta="+8%"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.75fr_1fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                Installs this week
              </h2>
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Daily totals
              </div>
            </div>
            <div className="grid h-[260px] grid-cols-7 items-end gap-2.5">
              {data.installsByDay.map((item, index) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-[8px] ${
                      index === 2
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-primary)]/25"
                    }`}
                    style={{ height: `${Math.max((item.value / maxInstall) * 180, 24)}px` }}
                  />
                  <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                    {item.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
                Top sections by installs
              </h3>
              <div className="mt-4 space-y-3">
                {data.topSections.slice(0, 2).map((item, index) => (
                  <div
                    key={item.slug}
                    className="flex items-center justify-between gap-3 rounded-[8px] border border-[var(--border-default)] bg-[var(--background-page)] px-3 py-2.5"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-[8px] bg-[var(--surface-soft)]" />
                      <div className="min-w-0">
                        <div className="truncate text-[14px] font-medium text-[var(--text-primary)]">
                          {item.name}
                        </div>
                        <div className="text-[12px] text-[var(--text-secondary)]">
                          {item.installs} installs
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[var(--text-tertiary)]" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
                Revenue trend
              </h3>
              <div className="mt-4 h-[120px] rounded-[8px] bg-[linear-gradient(180deg,rgba(109,76,255,0.18)_0%,rgba(109,76,255,0.04)_100%)] p-2">
                <svg viewBox="0 0 320 120" className="h-full w-full">
                  <path
                    d="M0,92 C35,78 62,98 96,72 C130,46 160,30 192,66 C226,100 258,82 320,24"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                    Projected
                  </div>
                  <div className="font-mono text-[24px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    $10,250
                  </div>
                </div>
                <div className="text-[24px] font-semibold text-[var(--success)]">
                  +15.2%
                </div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-[var(--border-default)] px-5 py-4">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
                Latest uploaded sections
              </h3>
              <button className="text-[14px] font-medium text-[var(--color-primary)]">
                View All
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-[var(--background-page)]">
                <tr className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  <th className="px-5 py-3">Section Name</th>
                  <th className="px-5 py-3">Uploader</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSections.slice(0, 3).map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--border-default)] text-[14px] text-[var(--text-secondary)]"
                  >
                    <td className="px-5 py-3 font-medium text-[var(--text-primary)]">
                      {item.name}
                    </td>
                    <td className="px-5 py-3">Admin</td>
                    <td className="px-5 py-3 font-mono text-[13px]">
                      {item.updatedAt}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Badge
                        tone={item.status === "PUBLISHED" ? "success" : "warning"}
                        label={item.status === "PUBLISHED" ? "LIVE" : "REVIEW"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
              Quick filters
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge label="All Sections" variant="default" />
              <Badge label="Shopify" tone="default" />
              <Badge label="Liquid" tone="default" />
              <Badge label="React" tone="default" />
              <Badge label="High Converting" tone="default" />
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
              Recent activity feed
            </h3>
            <div className="mt-4 space-y-4">
              {data.activity.slice(0, 3).map((item, index) => (
                <div key={`${item.actor}-${item.target}-${index}`} className="flex gap-3">
                  <span
                    className={`mt-1 h-3 w-3 rounded-full border-2 ${
                      index === 0
                        ? "border-[var(--color-primary)]"
                        : index === 1
                          ? "border-[var(--success)]"
                          : "border-[var(--border-strong)]"
                    }`}
                  />
                  <div>
                    <div className="text-[14px] font-medium text-[var(--text-primary)]">
                      {item.actor} {item.action} {item.target}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-[var(--text-tertiary)]">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
              System health
            </h3>
            <div className="mt-4 space-y-4 text-[14px]">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">API Gateway</span>
                  <span className="text-[12px] font-medium text-[var(--success)]">
                    ONLINE
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--success-light)]" />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Storage Usage</span>
                  <span className="text-[12px] font-medium text-[var(--text-primary)]">
                    64% FULL
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                  <div className="h-full w-[64%] bg-[var(--color-primary)]" />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">CDN Propagation</span>
                  <span className="text-[12px] font-medium text-[var(--success)]">
                    HEALTHY
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--success-light)]" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
