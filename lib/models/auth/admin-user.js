import mongoose, { Schema } from "mongoose";
const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "EDITOR"], default: "ADMIN" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const AdminUserModel =
  mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
