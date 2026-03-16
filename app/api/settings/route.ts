import { NextResponse } from "next/server";
import { getSettingsData } from "@/features/settings/service";
export async function GET() { return NextResponse.json(await getSettingsData()); }
