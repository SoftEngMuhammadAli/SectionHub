import { NextResponse } from "next/server";
import { bundles } from "@/lib/sectionhub-data";
export async function GET() { return NextResponse.json({ items: bundles }); }
