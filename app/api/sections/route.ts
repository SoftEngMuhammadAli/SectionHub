import { NextResponse } from "next/server";
import { getSections } from "@/lib/sectionhub/sections/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({ items: await getSections({ q: searchParams.get("q") ?? undefined, category: searchParams.get("category") ?? undefined, status: searchParams.get("status") ?? undefined, tag: searchParams.get("tag") ?? undefined }) });
}
