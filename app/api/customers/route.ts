import { NextResponse } from "next/server";
import { getCustomers } from "@/lib/sectionhub/customers/service";
export async function GET() { return NextResponse.json({ items: await getCustomers() }); }
