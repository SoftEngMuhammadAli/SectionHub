import { NextResponse } from "next/server";
import { getOrders } from "@/lib/sectionhub/orders/service";
export async function GET() { return NextResponse.json({ items: await getOrders() }); }
