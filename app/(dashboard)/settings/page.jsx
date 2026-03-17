import {
  createApiCredentialAction,
  regenerateApiCredentialAction,
  runDatabaseMaintenanceAction,
  saveSettingsAction,
} from "@/app/actions";
import { Card } from "@/components/sectionhub/ui";
import { CredentialSecretValue } from "@/components/sectionhub/forms/credential-secret-value";
import { SettingsLogoUpload } from "@/components/sectionhub/forms/settings-logo-upload";
import { getSettingsData } from "@/lib/sectionhub/settings/service";
import { Info, Plus } from "lucide-react";

function Notice({ tone = "success", children }) {
  const tones = {
    success:
      "border border-[var(--success)]/15 bg-[var(--success-light)] text-[var(--success)]",
    info: "border border-[var(--color-info)]/15 bg-[var(--color-info-light)] text-[var(--color-info)]",
  };

  return <div className={`rounded-[10px] px-4 py-3 text-[13px] ${tones[tone]}`}>{children}</div>;
}

export default async function SettingsPage({ searchParams }) {
  const params = await searchParams;
  const saved = params.saved === "1";
  const keyCreated = params.keyCreated === "1";
  const keyRotated = params.keyRotated === "1";
  const maintenanceRun = params.maintenanceRun === "1";

  const settings = await getSettingsData();
  const statusLabel = settings.apiCredential?.status ?? "ACTIVE";

  return (
    <div className="space-y-8">
      {saved ? <Notice>Settings updated.</Notice> : null}
      {keyCreated ? <Notice tone="info">New API credential created.</Notice> : null}
      {keyRotated ? <Notice tone="info">Client secret regenerated.</Notice> : null}
      {maintenanceRun ? (
        <Notice tone="info">Database maintenance completed.</Notice>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
            General Settings
          </h2>
          <p className="mt-1 text-[15px] text-[var(--text-secondary)]">
            Manage your core instance configuration and branding.
          </p>
        </div>

        <form id="settings-general-form" action={saveSettingsAction}>
          <Card className="space-y-6 p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Site Name
                </span>
                <input
                  name="siteName"
                  defaultValue={String(settings.siteName)}
                  className="sectionhub-input"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Default Currency
                </span>
                <select
                  name="defaultCurrency"
                  defaultValue={String(settings.defaultCurrency)}
                  className="sectionhub-select"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                </select>
              </label>

              <div className="space-y-2">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Site Logo
                </span>
                <SettingsLogoUpload initialLogo={String(settings.siteLogo ?? "")} />
              </div>

              <div className="space-y-2">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Maintenance Mode
                </span>
                <label className="flex min-h-[120px] items-start justify-between gap-4 rounded-[12px] border border-[var(--border-default)] bg-[var(--background-page)] p-5">
                  <div>
                    <div className="text-[28px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                      Maintenance Mode
                    </div>
                    <p className="mt-1 text-[14px] leading-6 text-[var(--text-secondary)]">
                      Prevent non-admin users from accessing the platform while
                      updating.
                    </p>
                  </div>
                  <span className="relative mt-1 inline-flex items-center">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      defaultChecked={settings.maintenanceMode}
                      className="peer sr-only"
                    />
                    <span className="h-7 w-12 rounded-full bg-[var(--border-default)] transition peer-checked:bg-[var(--color-primary)]" />
                    <span className="absolute left-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>
              </div>
            </div>
          </Card>
        </form>
      </section>

      <section className="space-y-4 border-t border-[var(--border-default)] pt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[40px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
              API Credentials
            </h2>
            <p className="mt-1 text-[15px] text-[var(--text-secondary)]">
              Secure keys for external integrations and webhooks.
            </p>
          </div>
          <form action={createApiCredentialAction}>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center gap-2 rounded-[8px] px-3 text-[14px] font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-light)]"
            >
              <Plus className="h-4 w-4" />
              Create New Key
            </button>
          </form>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="space-y-0">
            <div className="grid gap-4 border-b border-[var(--border-default)] px-6 py-6 md:grid-cols-[220px_1fr_auto] md:items-center">
              <div className="text-[30px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                Client ID
              </div>
              <div className="overflow-x-auto rounded-[10px] border border-[var(--border-default)] bg-[var(--background-page)] px-4 py-3 font-mono-ui text-[13px] text-[var(--text-primary)]">
                {settings.apiCredential?.clientId ?? "No credential yet"}
              </div>
              <div className="justify-self-start rounded-[8px] bg-[var(--success-light)] px-3 py-1.5 text-[12px] font-semibold text-[var(--success)]">
                {statusLabel}
              </div>
            </div>

            <div className="grid gap-4 border-b border-[var(--border-default)] px-6 py-6 md:grid-cols-[220px_1fr_auto] md:items-center">
              <div className="text-[30px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                Client Secret
              </div>
              <CredentialSecretValue secret={settings.apiCredential?.secret ?? ""} />
              <form action={regenerateApiCredentialAction}>
                <input type="hidden" name="id" value={settings.apiCredential?.id ?? ""} />
                <button
                  type="submit"
                  disabled={!settings.apiCredential?.id}
                  className="justify-self-start text-[14px] font-medium text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Regenerate
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[var(--surface-soft)] px-6 py-4 text-[13px] text-[var(--text-secondary)]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            Regeneration will immediately invalidate the current secret. Ensure any
            connected applications are updated with the new credentials to prevent
            service interruption.
          </div>
        </Card>
      </section>

      <Card className="flex flex-col items-start justify-between gap-4 border-[var(--danger)]/20 bg-[var(--danger-light)]/35 p-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-[40px] font-semibold tracking-[-0.02em] text-[var(--danger)]">
            Database Maintenance
          </h3>
          <p className="mt-1 text-[15px] text-[var(--danger)]/90">
            Purge logs older than 90 days or optimize indexes.
          </p>
        </div>
        <form action={runDatabaseMaintenanceAction}>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-[var(--danger)]/35 bg-white px-6 text-[16px] font-semibold text-[var(--danger)]"
          >
            Run Optimizer
          </button>
        </form>
      </Card>
    </div>
  );
}
