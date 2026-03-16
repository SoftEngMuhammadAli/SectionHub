import { NextResponse } from "next/server";
import { getCustomers } from "@/features/customers/service";
export async function GET() { return NextResponse.json({ items: await getCustomers() }); }
