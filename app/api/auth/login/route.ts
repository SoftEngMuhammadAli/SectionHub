import { NextResponse } from "next/server";
import { loginWithPassword } from "@/features/auth/server";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await loginWithPassword(String(body.email ?? ""), String(body.password ?? ""));
  return NextResponse.json(result, { status: result.ok ? 200 : 401 });
}
