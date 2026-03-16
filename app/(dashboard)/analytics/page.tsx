import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getAnalyticsData } from "@/lib/sectionhub/analytics/service";
import { formatPrice } from "@/lib/sectionhub/shared/format";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><SectionTitle title="Analytics" subtitle="Database-backed install, revenue, category, bundle, and customer performance." /><div className="font-mono text-[13px] text-[var(--text-secondary)]">Revenue {formatPrice(data.revenue)}</div></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><div className="text-[12px] font-medium text-[var(--text-secondary)]">Installs</div><div className="mt-3 text-[28px] font-semibold">{data.installs.length}</div></Card>
        <Card className="p-5"><div className="text-[12px] font-medium text-[var(--text-secondary)]">Revenue</div><div className="mt-3 text-[28px] font-semibold">{formatPrice(data.revenue)}</div></Card>
        <Card className="p-5"><div className="text-[12px] font-medium text-[var(--text-secondary)]">Active shops</div><div className="mt-3 text-[28px] font-semibold">{data.customers.filter((item) => item.status !== "Churned").length}</div></Card>
        <Card className="p-5"><div className="text-[12px] font-medium text-[var(--text-secondary)]">Conversion rate</div><div className="mt-3 text-[28px] font-semibold">4.8%</div></Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5"><div className="mb-4 text-[15px] font-semibold">Sections</div><div className="space-y-3">{data.sections.slice(0, 6).map((item) => <div key={item.id} className="flex items-center justify-between text-[13px]"><span>{item.name}</span><span className="font-mono">{item.installs}</span></div>)}</div></Card>
        <Card className="p-5"><div className="mb-4 text-[15px] font-semibold">Bundles</div><div className="space-y-3">{data.bundles.map((item) => <div key={item.id} className="flex items-center justify-between text-[13px]"><span>{item.name}</span><span className="font-mono">{item.price}</span></div>)}</div></Card>
      </div>
    </div>
  );
}
