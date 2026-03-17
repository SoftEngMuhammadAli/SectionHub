import crypto from "node:crypto";
import connectToDatabase from "@/lib/db";
import {
  ActivityLogModel,
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

export async function getSettingsData() {
  await connectToDatabase();

  const [settings, apiCredential] = await Promise.all([
    SettingModel.find().lean(),
    ApiCredentialModel.findOne().sort({ createdAt: -1 }).lean(),
  ]);

  const map = readSettingMap(settings);

  return {
    siteName: map.get("site_name") ?? "SectionHub Enterprise",
    defaultCurrency: map.get("default_currency") ?? "USD",
    maintenanceMode: Boolean(map.get("maintenance_mode")),
    siteLogo: map.get("site_logo") ?? "",
    apiCredential: toCredentialView(apiCredential),
  };
}

export async function updateSettings(input) {
  await connectToDatabase();

  const rows = [
    { key: "site_name", value: input.siteName },
    { key: "default_currency", value: input.defaultCurrency },
    { key: "maintenance_mode", value: input.maintenanceMode },
    { key: "site_logo", value: input.siteLogo ?? "" },
  ];

  for (const row of rows) {
    await SettingModel.findOneAndUpdate(
      { key: row.key },
      {
        key: row.key,
        valueJson: JSON.stringify({ value: row.value }),
        updatedById: input.updatedById || undefined,
      },
      { upsert: true, new: true },
    );
  }
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
