import mongoose, { Schema } from "mongoose";
const TagSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    color: { type: String, default: "violet" },
}, { timestamps: { createdAt: true, updatedAt: false } });
export const TagModel = mongoose.models.Tag || mongoose.model("Tag", TagSchema);
