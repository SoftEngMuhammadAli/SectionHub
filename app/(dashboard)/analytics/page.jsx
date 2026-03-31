import Link from "next/link";
import { CalendarDays, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAnalyticsData } from "@/lib/sectionhub/analytics/service";

const RANGE_OPTIONS = [7, 30, 90];
const CATEGORY_COLORS = [
  "var(--color-primary)",
  "rgba(109,76,255,0.74)",
  "rgba(109,76,255,0.54)",
  "rgba(109,76,255,0.34)",
];

function clampRange(value) {
  const numeric = Number(value);
  return RANGE_OPTIONS.includes(numeric) ? numeric : 30;
}

function Metric({ label, value, delta }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          {label}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            delta.tone === "danger"
              ? "bg-[var(--danger-light)] text-[var(--danger)]"
              : "bg-[var(--success-light)] text-[var(--success)]"
          }`}
        >
          {delta.label}
        </span>
      </div>
      <div className="mt-3 font-mono text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
        {value}
      </div>
    </Card>
  );
}

function buildChartPaths(series) {
  const width = 860;
  const height = 300;
  const paddingX = 24;
  const paddingY = 24;
  const max = Math.max(...series.map((item) => item.revenueCents), 1);
  const step =
    series.length > 1 ? (width - paddingX * 2) / (series.length - 1) : 0;

  const points = series.map((item, index) => {
    const x = paddingX + step * index;
    const y =
      height - paddingY - (item.revenueCents / max) * (height - paddingY * 2);

    return { x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const baseline = height - paddingY;
  const firstX = points[0]?.x ?? paddingX;
  const lastX = points[points.length - 1]?.x ?? paddingX;
  const areaPath = `${linePath} L${lastX},${baseline} L${firstX},${baseline} Z`;

  return {
    linePath,
    areaPath,
    startLabel: series[0]?.label ?? "",
    middleLabel: series[Math.floor((series.length - 1) / 2)]?.label ?? "",
    endLabel: series[series.length - 1]?.label ?? "",
  };
}

function buildCategoryGradient(items) {
  if (!items.length) {
    return "conic-gradient(var(--surface-soft) 0% 100%)";
  }

  let cursor = 0;
  const segments = items.map((item, index) => {
    const start = cursor;
    cursor += item.percent;
    return `${CATEGORY_COLORS[index] ?? CATEGORY_COLORS[CATEGORY_COLORS.length - 1]} ${start}% ${cursor}%`;
  });

  if (cursor < 100) {
    segments.push(`rgba(109,76,255,0.16) ${cursor}% 100%`);
  }

  return `conic-gradient(${segments.join(",")})`;
}

export default async function AnalyticsPage({ searchParams }) {
  const params = await searchParams;
  const rangeDays = clampRange(params.range);
  const data = await getAnalyticsData(rangeDays);
  const chart = buildChartPaths(data.revenueSeries);
  const highestInstall = Math.max(
    ...data.topSections.map((item) => item.installCount),
    1,
  );
  const categoryGradient = buildCategoryGradient(data.categoryBreakdown);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          Analytics Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <div className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[var(--border-default)] bg-white px-3 text-[12px] text-[var(--text-primary)]">
            <CalendarDays className="h-4 w-4 text-[var(--text-secondary)]" />
            {data.rangeLabel}
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-white">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Installs"
          value={new Intl.NumberFormat("en-US").format(data.overview.installs)}
          delta={data.overview.installsDelta}
        />
        <Metric
          label="Revenue"
          value={data.overview.revenueLabel}
          delta={data.overview.revenueDelta}
        />
        <Metric
          label="Active Shops"
          value={new Intl.NumberFormat("en-US").format(
            data.overview.activeShops,
          )}
          delta={data.overview.activeShopsDelta}
        />
        <Metric
          label="Conversion"
          value={data.overview.conversionLabel}
          delta={data.overview.conversionDelta}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.75fr_0.85fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Revenue Over Time
            </h2>
            <div className="flex gap-1">
              {RANGE_OPTIONS.map((range) => (
                <Link
                  key={range}
                  href={`/analytics?range=${range}`}
                  className={`rounded-[8px] px-2.5 py-1 text-[11px] font-semibold ${
                    range === rangeDays
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--surface-soft)] text-[var(--text-secondary)]"
                  }`}
                >
                  {range}D
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] border border-[var(--border-default)] bg-[linear-gradient(180deg,rgba(109,76,255,0.16)_0%,rgba(109,76,255,0.04)_100%)] p-2">
            <svg viewBox="0 0 860 300" className="h-[320px] w-full">
              <path d={chart.areaPath} fill="rgba(109,76,255,0.18)" />
              <path
                d={chart.linePath}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-[var(--text-tertiary)]">
            <span>{chart.startLabel}</span>
            <span>{chart.middleLabel}</span>
            <span>{chart.endLabel}</span>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Recent Installs
          </h2>
          <div className="mt-4 space-y-3">
            {data.recentInstalls.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-[8px] bg-[var(--background-page)] px-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--color-primary-light)] text-[10px] font-semibold text-[var(--color-primary)]">
                    SH
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[12px] text-[var(--text-primary)]">
                      {item.domain}
                    </div>
                    <div className="truncate text-[11px] text-[var(--text-secondary)]">
                      {item.sectionName}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  {item.relativeTime}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-[12px] font-semibold text-[var(--color-primary)]"
            >
              View All Feed
            </button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.15fr]">
        <Card className="p-5">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Installs per Section
          </h2>
          <div className="mt-5 space-y-5">
            {data.topSections.map((section) => {
              const percent = Math.max(
                Math.round((section.installCount / highestInstall) * 100),
                12,
              );

              return (
                <div key={section.id}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="text-[var(--text-primary)]">
                      {section.name}
                    </span>
                    <span className="font-mono text-[var(--color-primary)]">
                      {section.installs}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--surface-soft)]">
                    <div
                      className="h-2 rounded-full bg-[var(--color-primary)]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Top Performing Categories
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_190px] md:items-center">
            <div className="space-y-3">
              {data.categoryBreakdown.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between gap-3 text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        background:
                          CATEGORY_COLORS[index] ??
                          CATEGORY_COLORS[CATEGORY_COLORS.length - 1],
                      }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-mono">{category.percent}%</span>
                </div>
              ))}
            </div>

            <div
              className="mx-auto h-[170px] w-[170px] rounded-full p-9"
              style={{ background: categoryGradient }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                    Total
                  </div>
                  <div className="font-mono text-[20px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
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
