import { NextResponse } from "next/server";
import { orders } from "@/lib/sectionhub-data";
export async function GET() { return NextResponse.json({ items: orders, total: orders.length }); }
