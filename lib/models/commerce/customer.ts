import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const CustomerModel =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
