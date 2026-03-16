import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { ApiCredentialModel, SettingModel } from "@/lib/models";
export async function GET() {
  await connectToDatabase();
  const [settings, apiCredential] = await Promise.all([
    SettingModel.find().lean(),
    ApiCredentialModel.findOne().sort({ createdAt: -1 }).lean(),
  ]);
  const map = new Map(
    settings.map((item) => [item.key, JSON.parse(item.valueJson).value]),
  );
  return NextResponse.json({
    siteName: map.get("site_name") ?? "SectionHub Enterprise",
    defaultCurrency: map.get("default_currency") ?? "USD",
    maintenanceMode: Boolean(map.get("maintenance_mode")),
    siteLogo: map.get("site_logo") ?? "",
    apiCredential: apiCredential
      ? { clientId: apiCredential.clientId, status: apiCredential.status }
      : null,
  });
}
