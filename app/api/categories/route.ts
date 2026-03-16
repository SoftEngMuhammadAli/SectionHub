import { NextResponse } from "next/server";
import { categories } from "@/lib/sectionhub-data";
export async function GET() { return NextResponse.json({ items: categories }); }
