import { NextResponse } from "next/server";
export async function POST(request: Request) { const body = await request.json(); return NextResponse.json({ success: true, email: body.email, message: "Reset link issued", expiresInMinutes: 30 }); }
