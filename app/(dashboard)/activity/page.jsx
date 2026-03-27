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

function toneClass(index) {
  if (index % 3 === 0) return "bg-[var(--success)]";
  if (index % 3 === 1) return "bg-[var(--color-info)]";
  return "bg-[var(--warning)]";
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
        <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
          System Events
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Audit trail for administrative actions and system updates.
        </p>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <form className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
          <input
            name="user"
            defaultValue={asValue(params.user)}
            placeholder="Filter by user"
            className="sectionhub-input min-w-[180px]"
          />
          <input
            name="type"
            defaultValue={asValue(params.type)}
            placeholder="Action type"
            className="sectionhub-input min-w-[180px]"
          />
          <button
            type="submit"
            className="inline-flex min-h-9 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
          >
            Filter
          </button>
          <a
            href="/activity"
            className="inline-flex min-h-9 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
          >
            Reset
          </a>
        </form>
        <button className="inline-flex min-h-9 items-center justify-center rounded-[10px] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-white lg:self-auto">
          Export CSV
        </button>
      </div>

      <div className="sectionhub-mobile-list lg:hidden">
        {filteredLogs.map((log, index) => (
          <Card key={log.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-3 w-3 rounded-full ${toneClass(index)}`} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {log.actor}
                </div>
                <div className="mt-1 text-[13px] text-[var(--text-secondary)]">
                  {String(log.action).charAt(0).toUpperCase()}
                  {String(log.action).slice(1)} {log.target}
                </div>
              </div>
            </div>

            <div className="sectionhub-data-card mt-4">
              <div className="sectionhub-data-card-row">
                <span>Resource</span>
                <strong className="font-mono-ui">{toResourceId(log.id)}</strong>
              </div>
              <div className="sectionhub-data-card-row">
                <span>IP Address</span>
                <strong className="font-mono-ui">{fakeIpFromId(log.id)}</strong>
              </div>
              <div className="sectionhub-data-card-row">
                <span>Timestamp</span>
                <strong className="text-right">{log.createdAt}</strong>
              </div>
            </div>
          </Card>
        ))}
        {!filteredLogs.length ? (
          <Card className="p-6 text-[13px] text-[var(--text-secondary)]">
            No activity entries match the selected filters.
          </Card>
        ) : null}
      </div>

      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="sectionhub-table-scroll">
          <table className="min-w-full table-fixed text-left">
            <thead className="border-b border-[var(--border-default)] bg-[var(--background-page)]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <th className="w-[24%] px-4 py-3">User</th>
                <th className="w-[26%] px-4 py-3">Action</th>
                <th className="w-[16%] px-4 py-3">Resource ID</th>
                <th className="w-[16%] px-4 py-3">IP Address</th>
                <th className="w-[18%] px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className="border-b border-[var(--border-default)] text-[12px] last:border-b-0 hover:bg-[var(--surface-soft)]/35"
                >
                  <td className="px-4 py-3.5 align-top">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[var(--surface-soft)]" />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-[var(--text-primary)]">{log.actor}</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">
                          {index % 2 === 0 ? "Editor" : "Super Admin"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 align-top text-[var(--text-primary)]">
                    <div className="flex gap-2">
                      <span className={`mt-1.5 inline-flex h-2.5 w-2.5 rounded-full ${toneClass(index)}`} />
                      <span className="line-clamp-2">
                        {String(log.action).charAt(0).toUpperCase()}
                        {String(log.action).slice(1)} {log.target}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 font-mono-ui text-[10px] font-semibold text-[var(--text-secondary)]">
                      {toResourceId(log.id)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top font-mono-ui text-[12px] text-[var(--text-secondary)]">
                    {fakeIpFromId(log.id)}
                  </td>
                  <td className="px-4 py-3.5 align-top text-[12px] text-[var(--text-secondary)]">
                    {log.createdAt}
                  </td>
                </tr>
              ))}
              {!filteredLogs.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[13px] text-[var(--text-secondary)]"
                  >
                    No activity entries match the selected filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border-default)] px-4 py-3 text-[12px] text-[var(--text-secondary)]">
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
