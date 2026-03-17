import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import connectToDatabase from "@/lib/db";
import {
  ActivityLogModel,
  AdminUserModel,
  ApiCredentialModel,
  PasswordResetTokenModel,
  SessionModel,
  SettingModel,
} from "@/lib/models";
import { toId } from "@/lib/sectionhub/shared/format";

function readSettingMap(settings) {
  return new Map(
    settings.map((item) => {
      try {
        return [item.key, JSON.parse(item.valueJson).value];
      } catch {
        return [item.key, null];
      }
    }),
  );
}

async function upsertSettings(rows, updatedById) {
  for (const row of rows) {
    await SettingModel.findOneAndUpdate(
      { key: row.key },
      {
        key: row.key,
        valueJson: JSON.stringify({ value: row.value }),
        updatedById: updatedById || undefined,
      },
      { upsert: true, new: true },
    );
  }
}

function toCredentialView(credential) {
  if (!credential) {
    return null;
  }

  return {
    id: toId(credential._id),
    clientId: credential.clientId,
    secret: credential.encryptedSecret ?? "",
    maskedSecret: "*".repeat(24),
    status: String(credential.status ?? "active").toUpperCase(),
    rotatedAt: credential.rotatedAt ?? null,
  };
}

function createClientId() {
  return `sh_live_${crypto.randomBytes(3).toString("hex")}_${crypto.randomBytes(4).toString("hex")}_${crypto.randomBytes(2).toString("hex")}`;
}

function createSecret() {
  return `sec_live_${crypto.randomBytes(20).toString("hex")}`;
}

function createTemporaryPassword() {
  return crypto.randomBytes(8).toString("hex");
}

export async function getSettingsData() {
  await connectToDatabase();

  const [settings, apiCredential, teamMembers] = await Promise.all([
    SettingModel.find().lean(),
    ApiCredentialModel.findOne().sort({ createdAt: -1 }).lean(),
    AdminUserModel.find().sort({ createdAt: -1 }).lean(),
  ]);

  const map = readSettingMap(settings);

  return {
    siteName: map.get("site_name") ?? "SectionHub Enterprise",
    defaultCurrency: map.get("default_currency") ?? "USD",
    maintenanceMode: Boolean(map.get("maintenance_mode")),
    siteLogo: map.get("site_logo") ?? "",
    apiCredential: toCredentialView(apiCredential),
    notifications: {
      emailCritical: Boolean(map.get("notif_email_critical") ?? true),
      emailDigest: Boolean(map.get("notif_email_digest") ?? true),
      slackEnabled: Boolean(map.get("notif_slack_enabled") ?? false),
      productAlerts: Boolean(map.get("notif_product_alerts") ?? true),
    },
    advanced: {
      strictMode: Boolean(map.get("adv_strict_mode") ?? false),
      allowPublicApiDocs: Boolean(map.get("adv_public_api_docs") ?? false),
      auditRetentionDays: Number(map.get("adv_audit_retention_days") ?? 90),
    },
    teamMembers: teamMembers.map((member) => ({
      id: toId(member._id),
      name: member.name,
      email: member.email,
      role: member.role,
      isActive: Boolean(member.isActive),
      createdAt: member.createdAt ?? null,
    })),
  };
}

export async function updateSettings(input) {
  await connectToDatabase();

  await upsertSettings(
    [
      { key: "site_name", value: input.siteName },
      { key: "default_currency", value: input.defaultCurrency },
      { key: "maintenance_mode", value: input.maintenanceMode },
      { key: "site_logo", value: input.siteLogo ?? "" },
    ],
    input.updatedById,
  );
}

export async function updateNotificationSettings(input) {
  await connectToDatabase();

  await upsertSettings(
    [
      { key: "notif_email_critical", value: input.emailCritical },
      { key: "notif_email_digest", value: input.emailDigest },
      { key: "notif_slack_enabled", value: input.slackEnabled },
      { key: "notif_product_alerts", value: input.productAlerts },
    ],
    input.updatedById,
  );
}

export async function updateAdvancedSettings(input) {
  await connectToDatabase();

  await upsertSettings(
    [
      { key: "adv_strict_mode", value: input.strictMode },
      { key: "adv_public_api_docs", value: input.allowPublicApiDocs },
      {
        key: "adv_audit_retention_days",
        value: Math.max(Number(input.auditRetentionDays) || 1, 1),
      },
    ],
    input.updatedById,
  );
}

export async function createTeamMember(input) {
  await connectToDatabase();

  const email = String(input.email ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    throw new Error("Email is required.");
  }

  const existing = await AdminUserModel.findOne({ email }).lean();
  if (existing) {
    throw new Error("A team member with this email already exists.");
  }

  const temporaryPassword = createTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);

  const created = await AdminUserModel.create({
    name: String(input.name ?? "").trim() || email.split("@")[0],
    email,
    role:
      String(input.role ?? "EDITOR").toUpperCase() === "ADMIN"
        ? "ADMIN"
        : "EDITOR",
    isActive: true,
    passwordHash,
  });

  return {
    id: toId(created._id),
    email: created.email,
    name: created.name,
    role: created.role,
    temporaryPassword,
  };
}

export async function toggleTeamMemberStatus(input) {
  await connectToDatabase();

  const id = String(input.id ?? "");
  if (!id) {
    throw new Error("Invalid team member id.");
  }

  const updated = await AdminUserModel.findByIdAndUpdate(
    id,
    { isActive: Boolean(input.isActive) },
    { new: true },
  ).lean();

  if (!updated) {
    throw new Error("Team member not found.");
  }

  return {
    id: toId(updated._id),
    email: updated.email,
    name: updated.name,
    isActive: Boolean(updated.isActive),
  };
}

export async function createApiCredential({ updatedById } = {}) {
  await connectToDatabase();

  await ApiCredentialModel.updateMany(
    { status: "active" },
    { status: "inactive" },
  );

  const created = await ApiCredentialModel.create({
    clientId: createClientId(),
    encryptedSecret: createSecret(),
    status: "active",
    rotatedAt: new Date(),
    updatedById: updatedById || undefined,
  });

  return toCredentialView(created.toObject());
}

export async function regenerateApiCredentialSecret(id) {
  await connectToDatabase();

  const updated = await ApiCredentialModel.findByIdAndUpdate(
    id,
    {
      encryptedSecret: createSecret(),
      status: "active",
      rotatedAt: new Date(),
    },
    { new: true },
  ).lean();

  if (!updated) {
    throw new Error("API credential not found.");
  }

  return toCredentialView(updated);
}

export async function runDatabaseMaintenance() {
  await connectToDatabase();

  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);

  const [activityLogs, resetTokens, sessions] = await Promise.all([
    ActivityLogModel.deleteMany({ createdAt: { $lt: cutoff } }),
    PasswordResetTokenModel.deleteMany({
      $or: [{ usedAt: { $ne: null } }, { expiresAt: { $lt: new Date() } }],
    }),
    SessionModel.deleteMany({ expiresAt: { $lt: new Date() } }),
  ]);

  return {
    deletedLogs: activityLogs.deletedCount ?? 0,
    deletedResetTokens: resetTokens.deletedCount ?? 0,
    deletedSessions: sessions.deletedCount ?? 0,
  };
}
