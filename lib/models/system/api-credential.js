import mongoose, { Schema } from "mongoose";
const ApiCredentialSchema = new Schema(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    encryptedSecret: { type: String, required: true },
    status: { type: String, default: "active" },
    rotatedAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const ApiCredentialModel =
  mongoose.models.ApiCredential ||
  mongoose.model("ApiCredential", ApiCredentialSchema);
