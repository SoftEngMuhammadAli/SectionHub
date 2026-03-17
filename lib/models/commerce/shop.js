import mongoose, { Schema } from "mongoose";
const objectId = Schema.Types.ObjectId;
const ShopSchema = new Schema(
  {
    domain: { type: String, required: true, unique: true, index: true },
    customerId: { type: objectId, ref: "Customer", required: true },
    planType: String,
    status: { type: String, default: "Active" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const ShopModel =
  mongoose.models.Shop || mongoose.model("Shop", ShopSchema);
