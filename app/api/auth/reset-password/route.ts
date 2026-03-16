import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth/server";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await resetPassword(String(body.token ?? ""), String(body.password ?? ""));
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
