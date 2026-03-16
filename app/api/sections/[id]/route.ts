import { NextResponse } from "next/server";
import { getSectionFormData } from "@/lib/sectionhub/sections/service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const item = await getSectionFormData(id);
  return NextResponse.json({ item }, { status: item ? 200 : 404 });
}
