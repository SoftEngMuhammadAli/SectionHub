import { NextResponse } from "next/server";
import { getOrders } from "@/features/orders/service";
export async function GET() { return NextResponse.json({ items: await getOrders() }); }
