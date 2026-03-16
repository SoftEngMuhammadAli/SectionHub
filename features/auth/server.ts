import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import { AdminUserModel, PasswordResetTokenModel, SessionModel } from "@/models";

const SESSION_COOKIE = "sectionhub_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export async function getCurrentUser() {
  await connectToDatabase();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await SessionModel.findOne({ token }).lean();
  if (!session || new Date(session.expiresAt) < new Date()) return null;

  return AdminUserModel.findById(session.userId).lean();
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function loginWithPassword(email: string, password: string) {
  await connectToDatabase();
  const user = await AdminUserModel.findOne({ email }).lean();
  if (!user || !user.isActive) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { ok: false as const, error: "Invalid email or password." };
  }

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

  return { ok: true as const, user };
}

export async function logout() {
  await connectToDatabase();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await SessionModel.deleteMany({ token });
  cookieStore.delete(SESSION_COOKIE);
}

export async function issuePasswordReset(email: string) {
  await connectToDatabase();
  const user = await AdminUserModel.findOne({ email }).lean();
  if (!user) return { ok: true as const, token: null };

  const token = crypto.randomBytes(18).toString("hex");
  await PasswordResetTokenModel.create({
    token,
    userId: user._id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30),
  });

  return { ok: true as const, token };
}

export async function resetPassword(token: string, password: string) {
  await connectToDatabase();
  const record = await PasswordResetTokenModel.findOne({ token }).lean();
  if (!record || record.usedAt || new Date(record.expiresAt) < new Date()) {
    return { ok: false as const, error: "This reset link is invalid or expired." };
  }

  await AdminUserModel.findByIdAndUpdate(record.userId, {
    passwordHash: await bcrypt.hash(password, 10),
  });
  await PasswordResetTokenModel.findByIdAndUpdate(record._id, { usedAt: new Date() });

  return { ok: true as const };
}
