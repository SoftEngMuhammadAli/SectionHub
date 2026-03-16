import { NextResponse } from "next/server";
import { getCategories } from "@/features/categories/service";
export async function GET() { return NextResponse.json({ items: await getCategories() }); }
