import bcrypt from "bcryptjs";
import connectToDatabase from "../db.js";
import { AdminUserModel } from "../models/index.js";

export function getConfiguredAdmin() {
  return {
    name: String(process.env.SECTIONHUB_ADMIN_NAME || "Muhammad Ali").trim(),
    email: String(process.env.SECTIONHUB_ADMIN_EMAIL || "admin@sectionhub.com")
      .trim()
      .toLowerCase(),
    password: String(process.env.SECTIONHUB_ADMIN_PASSWORD || "admin12345"),
  };
}

export async function syncConfiguredAdminUser() {
  const config = getConfiguredAdmin();

  if (!config.email || !config.password) {
    return null;
  }

  await connectToDatabase();

  let existingUser = await AdminUserModel.findOne({ email: config.email });

  if (!existingUser) {
    return AdminUserModel.create({
      name: config.name,
      email: config.email,
      passwordHash: await bcrypt.hash(config.password, 10),
      role: "ADMIN",
      isActive: true,
    });
  }

  const updates = {};

  if (existingUser.name !== config.name) {
    updates.name = config.name;
  }
  if (existingUser.role !== "ADMIN") {
    updates.role = "ADMIN";
  }
  if (!existingUser.isActive) {
    updates.isActive = true;
  }

  const passwordMatches = await bcrypt.compare(
    config.password,
    existingUser.passwordHash,
  );
  if (!passwordMatches) {
    updates.passwordHash = await bcrypt.hash(config.password, 10);
  }

  if (Object.keys(updates).length === 0) {
    return existingUser;
  }

  existingUser = await AdminUserModel.findByIdAndUpdate(
    existingUser._id,
    updates,
    { new: true },
  );

  return existingUser;
}
