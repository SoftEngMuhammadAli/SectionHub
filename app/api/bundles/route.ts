import { NextResponse } from "next/server";
import { getBundles } from "@/features/bundles/service";
export async function GET() {
  return NextResponse.json({ items: await getBundles() });
}
