import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import { AdminUserModel, PasswordResetTokenModel } from "@/lib/models";
export async function POST(request) {
  const body = await request.json();
  await connectToDatabase();
  const token = String(body.token ?? "");
  const password = String(body.password ?? "");
  const record = await PasswordResetTokenModel.findOne({ token }).lean();
  let result;
  if (!record || record.usedAt || new Date(record.expiresAt) < new Date()) {
    result = { ok: false, error: "This reset link is invalid or expired." };
  } else {
    await AdminUserModel.findByIdAndUpdate(record.userId, {
      passwordHash: await bcrypt.hash(password, 10),
    });
    await PasswordResetTokenModel.findByIdAndUpdate(record._id, {
      usedAt: new Date(),
    });
    result = { ok: true };
  }
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
