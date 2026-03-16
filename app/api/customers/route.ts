import { NextResponse } from "next/server";
import { customers } from "@/lib/sectionhub-data";
export async function GET() { return NextResponse.json({ items: customers, total: customers.length }); }
