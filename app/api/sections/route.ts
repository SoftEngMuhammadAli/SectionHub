import { NextResponse } from "next/server";
import { sectionRows } from "@/lib/sectionhub-data";
export async function GET() { return NextResponse.json({ items: sectionRows, total: sectionRows.length }); }
export async function POST(request: Request) { const body = await request.json(); return NextResponse.json({ success: true, item: { id: "sec_new", status: "Draft", ...body } }, { status: 201 }); }
