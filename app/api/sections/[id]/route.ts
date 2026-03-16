import { NextResponse } from "next/server";
import { getSectionById } from "@/lib/sectionhub-data";
type RouteContext = { params: Promise<{ id: string }> };
export async function GET(_: Request, context: RouteContext) { const { id } = await context.params; return NextResponse.json({ item: getSectionById(id) }); }
export async function PATCH(request: Request, context: RouteContext) { const { id } = await context.params; const body = await request.json(); return NextResponse.json({ success: true, item: { ...getSectionById(id), ...body } }); }
export async function DELETE(_: Request, context: RouteContext) { const { id } = await context.params; return NextResponse.json({ success: true, archivedId: id }); }
