import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getActivityLogs } from "@/lib/sectionhub/activity/service";
export default async function ActivityPage() {
    const logs = await getActivityLogs();
    return (<div className="space-y-6">
      <SectionTitle title="Activity Log" subtitle="Audit critical changes across the entire admin product."/>
      <Card className="overflow-hidden">
        {logs.map((log) => (<div key={log.id} className="border-t border-[var(--border)] px-5 py-4 text-[13px] first:border-t-0">
            <div>
              <span className="font-medium">{log.actor}</span> {log.action}{" "}
              <span className="font-medium">{log.target}</span>
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-tertiary)]">
              {log.entityType} Ã‚Â· {log.createdAt}
            </div>
          </div>))}
      </Card>
    </div>);
}
