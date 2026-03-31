import { NextResponse } from "next/server";
import { buildDashboardInsights } from "@/lib/sectionhub/analytics/insights";

export async function GET() {
  const data = await buildDashboardInsights();
  return NextResponse.json(data);
}
