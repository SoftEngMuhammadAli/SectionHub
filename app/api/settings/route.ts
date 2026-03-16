import { NextResponse } from "next/server";
import { getSettingsData } from "@/lib/sectionhub/settings/service";
export async function GET() { return NextResponse.json(await getSettingsData()); }
