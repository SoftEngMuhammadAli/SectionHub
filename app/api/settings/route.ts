import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ siteName: "SectionHub Enterprise", currency: "USD", maintenanceMode: false, apiCredentials: { clientId: "sh_live_8842_910x_jklp", status: "active" } }); }
export async function PATCH(request: Request) { const body = await request.json(); return NextResponse.json({ success: true, settings: body }); }
