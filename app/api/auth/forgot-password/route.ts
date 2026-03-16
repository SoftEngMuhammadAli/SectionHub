import { NextResponse } from "next/server";
import { issuePasswordReset } from "@/features/auth/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(await issuePasswordReset(String(body.email ?? "")));
}
