import { NextResponse } from "next/server";
import { publishSection } from "@/lib/sectionhub/sections/service";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const item = await publishSection(id);
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to publish." }, { status: 400 });
  }
}
