import { NextResponse } from "next/server";
import { getTags } from "@/features/tags/service";
export async function GET() { return NextResponse.json({ items: await getTags() }); }
