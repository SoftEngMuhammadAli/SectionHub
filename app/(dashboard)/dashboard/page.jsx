import Link from "next/link";
import { Badge, Card, SectionTitle } from "@/components/sectionhub/ui";
import { getDashboardData } from "@/lib/sectionhub/dashboard/service";
export default async function DashboardPage() {
    const data = await getDashboardData();
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle title="Good morning, Admin" subtitle="Mon, Mar 16 2026 · Review catalog health, installs, and commercial performance."/>
        <div className="flex gap-2">
          <Link href="/sections/new" className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white">
            Upload Section
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="text-[12px] font-medium text-[var(--text-secondary)]">
            Total Sections
          </div>
          <div className="mt-3 text-[28px] font-semibold">
            {data.overview.totalSections}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[12px] font-medium text-[var(--text-secondary)]">
            Total Installs
          </div>
          <div className="mt-3 text-[28px] font-semibold">
            {data.overview.totalInstalls}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[12px] font-medium text-[var(--text-secondary)]">
            Revenue This Month
          </div>
          <div className="mt-3 text-[28px] font-semibold">
            {data.overview.revenueMonth}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[12px] font-medium text-[var(--text-secondary)]">
            Active Shops
          </div>
          <div className="mt-3 text-[28px] font-semibold">
            {data.overview.activeShops}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Card className="p-4 sm:p-5">
            <div className="mb-4 text-[15px] font-semibold">
              Installs this week
            </div>
            <div className="grid h-[180px] grid-cols-7 items-end gap-2 sm:h-[220px] sm:gap-3">
              {data.installsByDay.map((item) => (<div key={item.label} className="flex flex-col items-center gap-2 sm:gap-3">
                  <div className="w-full rounded-t-[8px] bg-[var(--primary-light)]" style={{ height: `${item.value * 1.4}px` }}/>
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)] sm:text-[11px]">
                    {item.label}
                  </span>
                </div>))}
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="p-4 sm:p-5">
              <div className="mb-4 text-[15px] font-semibold">
                Top sections by installs
              </div>
              <div className="space-y-4">
                {data.topSections.map((item, index) => (<div key={item.slug} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-medium">
                        {index + 1}. {item.name}
                      </div>
                      <div className="truncate font-mono text-[11px] text-[var(--text-tertiary)]">
                        {item.slug}
                      </div>
                    </div>
                    <div className="font-mono text-[12px] text-[var(--text-secondary)]">
                      {item.installs}
                    </div>
                  </div>))}
              </div>
            </Card>

            <Card className="p-4 sm:p-5">
              <div className="mb-4 text-[15px] font-semibold">
                Latest uploaded sections
              </div>
              <div className="space-y-4">
                {data.recentSections.map((item) => (<div key={item.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-medium">
                        {item.name}
                      </div>
                      <div className="truncate font-mono text-[11px] text-[var(--text-tertiary)]">
                        {item.version}
                      </div>
                    </div>
                    <Badge label={item.status} tone={item.status === "PUBLISHED"
                ? "success"
                : item.status === "DRAFT"
                    ? "warning"
                    : "danger"}/>
                  </div>))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4 sm:p-5">
            <div className="mb-4 text-[15px] font-semibold">
              Recent activity
            </div>
            <div className="space-y-4">
              {data.activity.map((item, index) => (<div key={`${item.actor}-${item.target}-${item.time}-${index}`} className="text-[13px] text-[var(--text-secondary)]">
                  <span className="font-medium text-[var(--text-primary)]">
                    {item.actor}
                  </span>{" "}
                  {item.action}{" "}
                  <span className="font-medium text-[var(--text-primary)]">
                    {item.target}
                  </span>
                  <div className="mt-1 text-[11px] text-[var(--text-tertiary)]">
                    {item.time}
                  </div>
                </div>))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 text-[15px] font-semibold">Quick filters</div>
            <div className="flex flex-wrap gap-2">
              <Badge label="Active" tone="success"/>
              <Badge label="Draft" tone="warning"/>
              <Badge label="Featured" tone="violet"/>
              <Badge label="Free" tone="info"/>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 text-[15px] font-semibold">Top categories</div>
            <div className="space-y-3">
              {data.categories.map((item) => (<div key={item.name} className="flex items-center justify-between text-[13px]">
                  <span>{item.name}</span>
                  <span className="font-mono">{item.count}</span>
                </div>))}
            </div>
          </Card>
        </div>
      </div>
    </div>);
}
