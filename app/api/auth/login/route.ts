import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const isValid = body.email === "admin@sectionhub.com" && body.password;
  return NextResponse.json(isValid ? { success: true, user: { email: body.email, role: "admin" }, sessionToken: "sectionhub_admin_session" } : { success: false, error: "Invalid credentials" }, { status: isValid ? 200 : 401 });
}
