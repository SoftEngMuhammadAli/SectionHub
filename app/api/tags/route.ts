import { NextResponse } from "next/server";
import { tags } from "@/lib/sectionhub-data";
export async function GET() { return NextResponse.json({ items: tags }); }
