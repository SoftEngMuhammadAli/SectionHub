import { NextResponse } from "next/server";
import { getBundles } from "@/lib/sectionhub/bundles/service";
export async function GET() {
  return NextResponse.json({ items: await getBundles() });
}
