import mongoose, { Schema } from "mongoose";
const objectId = Schema.Types.ObjectId;
const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    valueJson: { type: String, required: true },
    updatedById: { type: objectId, ref: "AdminUser" },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);
export const SettingModel =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
