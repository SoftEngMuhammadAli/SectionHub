import { saveSettingsAction } from "@/app/actions";
import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getSettingsData } from "@/features/settings/service";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const saved = params.saved === "1";
  const settings = await getSettingsData();
  return (
    <div className="space-y-6">
      <SectionTitle title="System Settings" subtitle="Manage instance configuration, credentials, maintenance, and API secrets." />
      {saved ? <div className="rounded-[10px] border border-[var(--success)]/15 bg-[var(--success-light)] px-4 py-3 text-[13px] text-[var(--success)]">Settings updated.</div> : null}
      <div className="grid gap-4 xl:grid-cols-[220px_1fr]">
        <Card className="overflow-x-auto p-3"><div className="flex gap-1 xl:block xl:space-y-1">{["General","API Keys","Team","Notifications","Advanced"].map((item, index) => <div key={item} className={index === 0 ? "shrink-0 rounded-[10px] bg-[var(--primary-light)] px-3 py-3 text-[13px] font-medium text-[var(--primary-light-text)]" : "shrink-0 rounded-[10px] px-3 py-3 text-[13px] text-[var(--text-secondary)]"}>{item}</div>)}</div></Card>
        <div className="space-y-4">
          <form action={saveSettingsAction} className="space-y-4">
            <Card className="p-5"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2"><label className="block space-y-2"><span className="text-[12px] font-medium">Site Name</span><input name="siteName" defaultValue={String(settings.siteName)} className="sectionhub-input" /></label><label className="block space-y-2"><span className="text-[12px] font-medium">Default Currency</span><select name="defaultCurrency" defaultValue={String(settings.defaultCurrency)} className="sectionhub-select"><option value="USD">USD ($) - US Dollar</option></select></label><label className="block space-y-2 md:col-span-2"><span className="text-[12px] font-medium">Maintenance Mode</span><label className="flex min-h-11 items-center gap-3 rounded-[8px] border border-[var(--border)] px-4"><input type="checkbox" name="maintenanceMode" defaultChecked={settings.maintenanceMode} /> Enable maintenance mode</label></label></div></Card>
            <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white sm:w-auto">Save Changes</button>
          </form>
          <Card className="p-5"><div className="mb-4 text-[18px] font-semibold">API Credentials</div><div className="grid gap-4 md:grid-cols-[160px_1fr_auto]"><div className="text-[13px] font-medium">Client ID</div><div className="overflow-x-auto rounded-[10px] border border-[var(--border)] px-4 py-3 font-mono text-[13px]">{settings.apiCredential?.clientId}</div><div className="rounded-full bg-[var(--success-light)] px-3 py-2 text-[12px] text-[var(--success)]">{settings.apiCredential?.status}</div></div></Card>
        </div>
      </div>
    </div>
  );
}
