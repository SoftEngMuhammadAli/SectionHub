import { NextResponse } from "next/server";
import { getDashboardData } from "@/features/dashboard/service";
export async function GET() {
  return NextResponse.json(await getDashboardData());
}
