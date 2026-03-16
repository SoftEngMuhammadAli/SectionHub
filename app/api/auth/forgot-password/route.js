import { NextResponse } from "next/server";
import crypto from "node:crypto";
import connectToDatabase from "@/lib/db";
import { AdminUserModel, PasswordResetTokenModel } from "@/lib/models";
export async function POST(request) {
    const body = await request.json();
    await connectToDatabase();
    const email = String(body.email ?? "")
        .trim()
        .toLowerCase();
    const user = await AdminUserModel.findOne({ email }).lean();
    if (!user) {
        return NextResponse.json({ ok: true, token: null });
    }
    const token = crypto.randomBytes(18).toString("hex");
    await PasswordResetTokenModel.create({
        token,
        userId: user._id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    });
    return NextResponse.json({ ok: true, token });
}
