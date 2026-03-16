import { NextResponse } from "next/server";
import { analyticsSummary, categories, sectionRows } from "@/lib/sectionhub-data";
export async function GET() { return NextResponse.json({ overview: analyticsSummary, topCategories: categories.slice(0, 4), topSections: sectionRows.slice(0, 4) }); }
