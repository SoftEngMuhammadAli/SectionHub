import mongoose, { Schema } from "mongoose";
const objectId = Schema.Types.ObjectId;
const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    icon: String,
    parentId: { type: objectId, ref: "Category" },
    sortOrder: { type: Number, default: 0 },
    visibility: {
      type: String,
      enum: ["INTERNAL", "MARKETPLACE", "HIDDEN", "PRIVATE"],
      default: "MARKETPLACE",
    },
    featured: { type: Boolean, default: false },
    status: { type: String, default: "Active" },
  },
  { timestamps: true },
);
export const CategoryModel =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
