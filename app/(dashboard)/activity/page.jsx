import { Card } from "@/components/sectionhub/ui";
import { getActivityLogs } from "@/lib/sectionhub/activity/service";

function asValue(value) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function toResourceId(id) {
  return `#RES-${String(id).replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase()}`;
}

function fakeIpFromId(id) {
  const source = String(id)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const a = 10 + (source % 200);
  const b = 1 + ((source * 3) % 254);
  const c = 1 + ((source * 7) % 254);
  const d = 1 + ((source * 11) % 254);
  return `${a}.${b}.${c}.${d}`;
}

export default async function ActivityPage({ searchParams }) {
  const params = await searchParams;
  const userFilter = asValue(params.user).toLowerCase();
  const typeFilter = asValue(params.type).toLowerCase();
  const logs = await getActivityLogs();

  const filteredLogs = logs.filter((log) => {
    const actor = String(log.actor).toLowerCase();
    const action = String(log.action).toLowerCase();
    const entityType = String(log.entityType).toLowerCase();
    const byUser = !userFilter || actor.includes(userFilter);
    const byType = !typeFilter || action.includes(typeFilter) || entityType.includes(typeFilter);
    return byUser && byType;
  });

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <div className="text-[14px] text-[var(--text-secondary)]">System Activity Log</div>
        <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">
          System Events
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Audit trail for administrative actions and system updates.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <form className="flex flex-wrap items-center gap-2">
          <input
            name="user"
            defaultValue={asValue(params.user)}
            placeholder="Filter by user"
            className="sectionhub-input h-10 min-w-[180px]"
          />
          <input
            name="type"
            defaultValue={asValue(params.type)}
            placeholder="Action type"
            className="sectionhub-input h-10 min-w-[180px]"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[13px] font-medium text-[var(--text-primary)]"
          >
            Filter
          </button>
        </form>
        <button className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[13px] font-medium text-white">
          Export CSV
        </button>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="min-w-full text-left">
          <thead className="border-b border-[var(--border-default)] bg-[var(--background-page)]">
            <tr className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Resource ID</th>
              <th className="px-5 py-3">IP Address</th>
              <th className="px-5 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr
                key={log.id}
                className="border-b border-[var(--border-default)] text-[14px] last:border-b-0"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[var(--surface-soft)]" />
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">{log.actor}</div>
                      <div className="text-[12px] text-[var(--text-secondary)]">
                        {index % 2 === 0 ? "Editor" : "Super Admin"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[var(--text-primary)]">
                  <span
                    className={`mr-2 inline-flex h-2.5 w-2.5 rounded-full ${
                      index % 3 === 0
                        ? "bg-[var(--success)]"
                        : index % 3 === 1
                          ? "bg-[var(--color-info)]"
                          : "bg-[var(--warning)]"
                    }`}
                  />
                  {String(log.action).charAt(0).toUpperCase()}
                  {String(log.action).slice(1)} {log.target}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 font-mono text-[12px] text-[var(--text-secondary)]">
                    {toResourceId(log.id)}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-[13px] text-[var(--text-secondary)]">
                  {fakeIpFromId(log.id)}
                </td>
                <td className="px-5 py-4 text-[13px] text-[var(--text-secondary)]">
                  {log.createdAt}
                </td>
              </tr>
            ))}
            {!filteredLogs.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-[14px] text-[var(--text-secondary)]"
                >
                  No activity entries match the selected filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-[var(--border-default)] px-5 py-3 text-[14px] text-[var(--text-secondary)]">
          <span>
            Showing 1-{Math.min(filteredLogs.length, 10)} of {filteredLogs.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-secondary)]">
              &lt;
            </button>
            <button className="h-8 w-8 rounded-[8px] bg-[var(--color-primary)] text-white">
              1
            </button>
            <button className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-primary)]">
              2
            </button>
            <button className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-secondary)]">
              &gt;
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
