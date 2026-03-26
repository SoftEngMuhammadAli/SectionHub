import { CalendarDays, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAnalyticsData } from "@/lib/sectionhub/analytics/service";
import { formatPrice } from "@/lib/sectionhub/shared/format";

function parseInstallCount(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return 0;
  if (text.endsWith("k")) return Math.round(Number(text.slice(0, -1)) * 1000);
  if (text.endsWith("m")) return Math.round(Number(text.slice(0, -1)) * 1000000);
  return Number(text.replace(/[^0-9.]/g, "")) || 0;
}

function Metric({ label, value, delta, tone = "success" }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">
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
      <div className="mt-3 font-mono text-[20px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
        {value}
      </div>
    </Card>
  );
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  const successfulInstalls = data.installs.filter(
    (item) => item.status === "SUCCESS",
  );
  const activeShops = data.customers.filter(
    (item) => String(item.status).toLowerCase() !== "churned",
  ).length;
  const conversionRate = data.customers.length
    ? ((successfulInstalls.length / data.customers.length) * 100).toFixed(1)
    : "0.0";

  const topSections = data.sections
    .map((item) => ({
      ...item,
      installCount: parseInstallCount(item.installs),
    }))
    .sort((a, b) => b.installCount - a.installCount)
    .slice(0, 4);
  const highestInstall = Math.max(...topSections.map((item) => item.installCount), 1);

  const categoryBreakdown = data.categories
    .map((category) => {
      const sectionCount = data.sections.filter(
        (section) => section.category === category.name,
      ).length;
      return { name: category.name, sectionCount };
    })
    .filter((item) => item.sectionCount > 0)
    .sort((a, b) => b.sectionCount - a.sectionCount)
    .slice(0, 4);

  const categoryTotal =
    categoryBreakdown.reduce((sum, item) => sum + item.sectionCount, 0) || 1;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">
          Analytics Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[var(--border-default)] bg-white px-3 text-[13px] text-[var(--text-primary)]">
            <CalendarDays className="h-4 w-4 text-[var(--text-secondary)]" />
            Oct 01, 2023 - Oct 31, 2023
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-4 text-[13px] font-medium text-white">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Installs"
          value={new Intl.NumberFormat("en-US").format(successfulInstalls.length)}
          delta="+12.5%"
        />
        <Metric
          label="Revenue"
          value={formatPrice(data.revenue)}
          delta="-5.2%"
          tone="danger"
        />
        <Metric
          label="Active Shops"
          value={new Intl.NumberFormat("en-US").format(activeShops)}
          delta="+8.1%"
        />
        <Metric label="Conversion" value={`${conversionRate}%`} delta="+0.4%" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.75fr_0.85fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
              Revenue Over Time
            </h2>
            <div className="flex gap-1">
              <button className="rounded-[8px] bg-[var(--surface-soft)] px-2.5 py-1 text-[12px] text-[var(--text-secondary)]">
                7D
              </button>
              <button className="rounded-[8px] bg-[var(--color-primary)] px-2.5 py-1 text-[12px] font-medium text-white">
                30D
              </button>
              <button className="rounded-[8px] bg-[var(--surface-soft)] px-2.5 py-1 text-[12px] text-[var(--text-secondary)]">
                90D
              </button>
            </div>
          </div>
          <div className="h-[320px] rounded-[8px] border border-[var(--border-default)] bg-[linear-gradient(180deg,rgba(109,76,255,0.18)_0%,rgba(109,76,255,0.05)_100%)] p-2">
            <svg viewBox="0 0 860 300" className="h-full w-full">
              <path
                d="M0,250 C70,230 120,250 180,220 C250,180 285,130 350,120 C420,110 465,95 520,65 C600,26 680,70 740,40 C790,20 830,0 860,0 L860,300 L0,300 Z"
                fill="rgba(109,76,255,0.16)"
              />
              <path
                d="M0,250 C70,230 120,250 180,220 C250,180 285,130 350,120 C420,110 465,95 520,65 C600,26 680,70 740,40 C790,20 830,0 860,0"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="4"
              />
            </svg>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
            Recent Installs
          </h2>
          <div className="mt-4 space-y-3">
            {data.customers.slice(0, 5).map((customer, index) => (
              <div
                key={customer.id}
                className="flex items-center justify-between gap-3 rounded-[8px] bg-[var(--background-page)] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-[13px] text-[var(--text-primary)]">
                    {customer.domain || customer.email}
                  </div>
                </div>
                <div className="font-mono text-[11px] text-[var(--text-tertiary)]">
                  {index === 0 ? "2M AGO" : index * 2 + 1}H AGO
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.2fr]">
        <Card className="p-5">
          <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
            Installs per Section
          </h2>
          <div className="mt-5 space-y-4">
            {topSections.map((section) => {
              const percent = Math.max(
                Math.round((section.installCount / highestInstall) * 100),
                8,
              );
              return (
                <div key={section.id}>
                  <div className="mb-1.5 flex items-center justify-between text-[14px]">
                    <span className="text-[var(--text-primary)]">{section.name}</span>
                    <span className="font-mono text-[var(--color-primary)]">
                      {section.installs}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
            Top Performing Categories
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_180px] md:items-center">
            <div className="space-y-3">
              {categoryBreakdown.map((category, index) => {
                const percent = Math.round((category.sectionCount / categoryTotal) * 100);
                return (
                  <div
                    key={category.name}
                    className="flex items-center justify-between gap-3 text-[14px]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          background:
                            index === 0
                              ? "var(--color-primary)"
                              : index === 1
                                ? "rgba(109,76,255,0.75)"
                                : index === 2
                                  ? "rgba(109,76,255,0.55)"
                                  : "rgba(109,76,255,0.35)",
                        }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="font-mono">{percent}%</span>
                  </div>
                );
              })}
            </div>
            <div className="mx-auto h-[170px] w-[170px] rounded-full bg-[conic-gradient(var(--color-primary)_0_42%,rgba(109,76,255,0.74)_42%_70%,rgba(109,76,255,0.56)_70%_88%,rgba(109,76,255,0.3)_88%_100%)] p-9">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                    Total
                  </div>
                  <div className="font-mono text-[32px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
