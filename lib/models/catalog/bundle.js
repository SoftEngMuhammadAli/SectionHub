import mongoose, { Schema } from "mongoose";
const objectId = Schema.Types.ObjectId;
const BundleSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: String,
    niche: String,
    accessType: {
        type: String,
        enum: ["SINGLE", "BUNDLE", "SUBSCRIPTION", "INTERNAL"],
        default: "BUNDLE",
    },
    visibility: {
        type: String,
        enum: ["INTERNAL", "MARKETPLACE", "HIDDEN", "PRIVATE"],
        default: "MARKETPLACE",
    },
    status: {
        type: String,
        enum: ["DRAFT", "ACTIVE", "ARCHIVED"],
        default: "DRAFT",
    },
    priceCents: { type: Number, default: 0 },
    compareAtPriceCents: Number,
    installs: { type: Number, default: 0 },
    sectionIds: [{ type: objectId, ref: "Section" }],
}, { timestamps: true });
export const BundleModel = mongoose.models.Bundle || mongoose.model("Bundle", BundleSchema);
