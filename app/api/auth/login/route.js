import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import { AdminUserModel, SessionModel } from "@/lib/models";
const SESSION_COOKIE = "sectionhub_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
export async function POST(request) {
    const body = await request.json();
    await connectToDatabase();
    const email = String(body.email ?? "")
        .trim()
        .toLowerCase();
    const password = String(body.password ?? "");
    const user = await AdminUserModel.findOne({ email }).lean();
    let result;
    if (!user || !user.isActive) {
        result = { ok: false, error: "Invalid email or password." };
    }
    else {
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            result = { ok: false, error: "Invalid email or password." };
        }
        else {
            const token = crypto.randomBytes(24).toString("hex");
            const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
            await SessionModel.create({ token, userId: user._id, expiresAt });
            const cookieStore = await cookies();
            cookieStore.set(SESSION_COOKIE, token, {
                httpOnly: true,
                sameSite: "lax",
                expires: expiresAt,
                path: "/",
            });
            result = { ok: true, user };
        }
    }
    return NextResponse.json(result, { status: result.ok ? 200 : 401 });
}
