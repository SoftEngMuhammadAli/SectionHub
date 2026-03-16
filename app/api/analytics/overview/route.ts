import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/sectionhub/dashboard/service";
export async function GET() {
  return NextResponse.json(await getDashboardData());
}
