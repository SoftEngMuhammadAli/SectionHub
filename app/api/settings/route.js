import { NextResponse } from "next/server";
import {
  createApiCredential,
  getSettingsData,
  regenerateApiCredentialSecret,
  runDatabaseMaintenance,
  updateSettings,
} from "@/lib/sectionhub/settings/service";

export async function GET() {
  const data = await getSettingsData();
  return NextResponse.json(data);
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    await updateSettings({
      siteName: String(body.siteName ?? "SectionHub Enterprise"),
      defaultCurrency: String(body.defaultCurrency ?? "USD"),
      maintenanceMode: Boolean(body.maintenanceMode),
      siteLogo: String(body.siteLogo ?? ""),
      updatedById: String(body.updatedById ?? ""),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to save settings.",
      },
      { status: 400 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const operation = String(body.operation ?? "");

    if (operation === "createKey") {
      const credential = await createApiCredential({
        updatedById: String(body.updatedById ?? ""),
      });
      return NextResponse.json({ success: true, credential });
    }

    if (operation === "regenerateKey") {
      const id = String(body.id ?? "");
      const credential = await regenerateApiCredentialSecret(id);
      return NextResponse.json({ success: true, credential });
    }

    if (operation === "optimize") {
      const result = await runDatabaseMaintenance();
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json(
      { success: false, error: "Invalid settings operation." },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Settings operation failed.",
      },
      { status: 400 },
    );
  }
}
