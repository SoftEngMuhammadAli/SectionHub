import { NextResponse } from "next/server";
import { getSectionById } from "@/lib/sectionhub-data";
type RouteContext = { params: Promise<{ id: string }> };
export async function POST(_: Request, context: RouteContext) { const { id } = await context.params; const item = getSectionById(id); return NextResponse.json({ success: true, item: { ...item, status: "Published" }, checks: ["name", "slug", "category", "file", "preview", "pricing"] }); }
