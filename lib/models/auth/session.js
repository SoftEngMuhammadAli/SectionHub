import mongoose, { Schema } from "mongoose";
const objectId = Schema.Types.ObjectId;
const SessionSchema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: objectId, ref: "AdminUser", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const SessionModel =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);
