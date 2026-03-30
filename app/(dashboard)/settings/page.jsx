import {
  addTeamMemberAction,
  createApiCredentialAction,
  regenerateApiCredentialAction,
  runDatabaseMaintenanceAction,
  saveAdvancedSettingsAction,
  saveNotificationSettingsAction,
  saveSettingsAction,
  toggleTeamMemberStatusAction,
} from "@/app/actions";
import { Card } from "@/components/sectionhub/ui";
import { CredentialSecretValue } from "@/components/sectionhub/forms/credential-secret-value";
import { SettingsLogoUpload } from "@/components/sectionhub/forms/settings-logo-upload";
import { getSettingsData } from "@/lib/sectionhub/settings/service";
import { Info, Plus } from "lucide-react";

const VALID_TABS = new Set([
  "general",
  "api-keys",
  "team",
  "notifications",
  "advanced",
]);

function Notice({ tone = "success", children }) {
  const tones = {
    success:
      "border border-[var(--success)]/15 bg-[var(--success-light)] text-[var(--success)]",
    info: "border border-[var(--color-info)]/15 bg-[var(--color-info-light)] text-[var(--color-info)]",
  };
  return (
    <div className={`rounded-[10px] px-4 py-3 text-[13px] ${tones[tone]}`}>
      {children}
    </div>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div>
      <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        {title}
      </h2>
      <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}

function ToggleControl({ name, defaultChecked, label, description }) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-[12px] border border-[var(--border-default)] bg-[var(--background-page)] px-4 py-3.5">
      <div>
        <div className="text-[13px] font-semibold text-[var(--text-primary)]">
          {label}
        </div>
        {description ? (
          <p className="mt-1 text-[12px] leading-5 text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}
      </div>
      <span className="sectionhub-switch">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} />
        <span className="sectionhub-switch-track">
          <span className="sectionhub-switch-thumb" />
        </span>
      </span>
    </label>
  );
}

export default async function SettingsPage({ searchParams }) {
  const params = await searchParams;
  const tabParam = String(params.tab ?? "general");
  const activeTab = VALID_TABS.has(tabParam) ? tabParam : "general";

  const saved = params.saved === "1";
  const keyCreated = params.keyCreated === "1";
  const keyRotated = params.keyRotated === "1";
  const maintenanceRun = params.maintenanceRun === "1";
  const memberAdded = params.memberAdded === "1";
  const memberUpdated = params.memberUpdated === "1";
  const memberEmail = String(params.memberEmail ?? "");
  const errorMessage = String(params.error ?? "");

  const settings = await getSettingsData();
  const statusLabel = settings.apiCredential?.status ?? "ACTIVE";
  const saveButtonFormId =
    activeTab === "notifications"
      ? "settings-notifications-form"
      : activeTab === "advanced"
        ? "settings-advanced-form"
        : activeTab === "general"
          ? "settings-general-form"
          : "";

  return (
    <div className="space-y-8">
      {saved ? <Notice>Settings updated.</Notice> : null}
      {keyCreated ? (
        <Notice tone="info">New API credential created.</Notice>
      ) : null}
      {keyRotated ? (
        <Notice tone="info">Client secret regenerated.</Notice>
      ) : null}
      {maintenanceRun ? (
        <Notice tone="info">Database maintenance completed.</Notice>
      ) : null}
      {memberAdded ? (
        <Notice tone="info">
          Team member added{memberEmail ? `: ${memberEmail}` : ""}.
        </Notice>
      ) : null}
      {memberUpdated ? (
        <Notice tone="info">Team member status updated.</Notice>
      ) : null}
      {errorMessage ? (
        <div className="rounded-[10px] border border-[var(--danger)]/15 bg-[var(--danger-light)] px-4 py-3 text-[13px] text-[var(--danger)]">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            System Settings
          </h1>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            Manage configuration, credentials, team access, and maintenance
            controls.
          </p>
        </div>
        {saveButtonFormId ? (
          <button
            type="submit"
            form={saveButtonFormId}
            className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-white"
          >
            Save Changes
          </button>
        ) : null}
      </div>

      {activeTab === "general" ? (
        <section id="general-settings" className="space-y-4 scroll-mt-24">
          <SectionTitle
            title="General Settings"
            description="Manage your core instance configuration and branding."
          />

          <form
            id="settings-general-form"
            action={saveSettingsAction}
            encType="multipart/form-data"
          >
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
                  <SettingsLogoUpload
                    initialLogo={String(settings.siteLogo ?? "")}
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                    Maintenance Mode
                  </span>
                  <ToggleControl
                    name="maintenanceMode"
                    defaultChecked={settings.maintenanceMode}
                    label="Maintenance Mode"
                    description="Prevent non-admin users from accessing the platform while updating."
                  />
                </div>
              </div>
            </Card>
          </form>
        </section>
      ) : null}

      {activeTab === "api-keys" ? (
        <section
          id="api-credentials"
          className="space-y-4 scroll-mt-24 border-t border-[var(--border-default)] pt-8"
        >
          <div className="flex items-center justify-between gap-3">
            <SectionTitle
              title="API Credentials"
              description="Secure keys for external integrations and webhooks."
            />
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
                <div className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
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
                <div className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                  Client Secret
                </div>
                <CredentialSecretValue
                  secret={settings.apiCredential?.secret ?? ""}
                />
                <form action={regenerateApiCredentialAction}>
                  <input
                    type="hidden"
                    name="id"
                    value={settings.apiCredential?.id ?? ""}
                  />
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
              Regeneration will immediately invalidate the current secret.
              Ensure connected applications are updated with the new
              credentials.
            </div>
          </Card>
        </section>
      ) : null}

      {activeTab === "team" ? (
        <section className="space-y-4 scroll-mt-24 border-t border-[var(--border-default)] pt-8">
          <SectionTitle
            title="Team Management"
            description="Add, review, and activate/deactivate admin team members."
          />

          <form action={addTeamMemberAction}>
            <Card className="grid gap-4 p-6 md:grid-cols-[1fr_1fr_180px_auto] md:items-end">
              <label className="block space-y-2">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Name
                </span>
                <input
                  name="name"
                  className="sectionhub-input"
                  placeholder="Alex Rivera"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  className="sectionhub-input"
                  placeholder="admin@example.com"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Role
                </span>
                <select
                  name="role"
                  defaultValue="EDITOR"
                  className="sectionhub-select"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[13px] font-medium text-white"
              >
                Add Member
              </button>
            </Card>
          </form>

          <Card className="overflow-hidden p-0">
            <div className="hidden grid-cols-[1.2fr_1.4fr_140px_140px] border-b border-[var(--border-default)] bg-[var(--background-page)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)] md:grid">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Action</span>
            </div>
            <div className="divide-y divide-[var(--border-default)]">
              <div className="space-y-3 p-4 md:hidden">
                {settings.teamMembers.map((member) => (
                  <div
                    key={`${member.id}-mobile`}
                    className="rounded-[12px] border border-[var(--border-default)] bg-[var(--background-page)] p-4"
                  >
                    <div className="text-[14px] font-semibold text-[var(--text-primary)]">
                      {member.name}
                    </div>
                    <div className="mt-1 text-[12px] text-[var(--text-secondary)]">
                      {member.email}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
                      <span>{member.role}</span>
                      <form action={toggleTeamMemberStatusAction}>
                        <input type="hidden" name="id" value={member.id} />
                        <input
                          type="hidden"
                          name="isActive"
                          value={member.isActive ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          className={`inline-flex min-h-8 items-center justify-center rounded-[10px] px-3 text-[11px] font-semibold ${
                            member.isActive
                              ? "bg-[var(--danger-light)] text-[var(--danger)]"
                              : "bg-[var(--success-light)] text-[var(--success)]"
                          }`}
                        >
                          {member.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
              {settings.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="hidden grid-cols-[1.2fr_1.4fr_140px_140px] items-center gap-2 px-6 py-4 text-[14px] md:grid"
                >
                  <span className="font-medium text-[var(--text-primary)]">
                    {member.name}
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    {member.email}
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    {member.role}
                  </span>
                  <form action={toggleTeamMemberStatusAction}>
                    <input type="hidden" name="id" value={member.id} />
                    <input
                      type="hidden"
                      name="isActive"
                      value={member.isActive ? "false" : "true"}
                    />
                    <button
                      type="submit"
                      className={`inline-flex min-h-9 items-center justify-center rounded-[8px] px-3 text-[12px] font-semibold ${
                        member.isActive
                          ? "bg-[var(--danger-light)] text-[var(--danger)]"
                          : "bg-[var(--success-light)] text-[var(--success)]"
                      }`}
                    >
                      {member.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </section>
      ) : null}

      {activeTab === "notifications" ? (
        <section className="space-y-4 scroll-mt-24 border-t border-[var(--border-default)] pt-8">
          <SectionTitle
            title="Notifications"
            description="Control operational and security notification channels."
          />
          <form
            id="settings-notifications-form"
            action={saveNotificationSettingsAction}
          >
            <Card className="space-y-4 p-6">
              {[
                {
                  key: "emailCritical",
                  label: "Critical incident emails",
                  value: settings.notifications.emailCritical,
                },
                {
                  key: "emailDigest",
                  label: "Daily digest emails",
                  value: settings.notifications.emailDigest,
                },
                {
                  key: "slackEnabled",
                  label: "Slack alert integration",
                  value: settings.notifications.slackEnabled,
                },
                {
                  key: "productAlerts",
                  label: "Product and release alerts",
                  value: settings.notifications.productAlerts,
                },
              ].map((item) => (
                <ToggleControl
                  key={item.key}
                  name={item.key}
                  defaultChecked={item.value}
                  label={item.label}
                />
              ))}
            </Card>
          </form>
        </section>
      ) : null}

      {activeTab === "advanced" ? (
        <section className="space-y-4 scroll-mt-24 border-t border-[var(--border-default)] pt-8">
          <SectionTitle
            title="Advanced Settings"
            description="Manage strict mode, API exposure, retention, and maintenance tasks."
          />

          <form id="settings-advanced-form" action={saveAdvancedSettingsAction}>
            <Card className="space-y-4 p-6">
              <ToggleControl
                name="strictMode"
                defaultChecked={settings.advanced.strictMode}
                label="Enable strict mode"
              />
              <ToggleControl
                name="allowPublicApiDocs"
                defaultChecked={settings.advanced.allowPublicApiDocs}
                label="Allow public API docs"
              />
              <label className="block space-y-2">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  Audit retention days
                </span>
                <input
                  name="auditRetentionDays"
                  type="number"
                  min={1}
                  defaultValue={settings.advanced.auditRetentionDays}
                  className="sectionhub-input"
                />
              </label>
            </Card>
          </form>

          <Card
            id="database-maintenance"
            className="flex scroll-mt-24 flex-col items-start justify-between gap-4 border-[var(--danger)]/20 bg-[var(--danger-light)]/35 p-6 md:flex-row md:items-center"
          >
            <div>
              <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--danger)]">
                Database Maintenance
              </h3>
              <p className="mt-1 text-[15px] text-[var(--danger)]/90">
                Purge logs older than 90 days or optimize indexes.
              </p>
            </div>
            <form action={runDatabaseMaintenanceAction}>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-[var(--danger)]/35 bg-white px-6 text-[16px] font-semibold text-[var(--danger)]"
              >
                Run Optimizer
              </button>
            </form>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
