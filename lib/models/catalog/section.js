import mongoose, { Schema } from "mongoose";
import { SectionCompatibilitySchema, SectionDocumentationSchema, SectionPreviewSchema, SectionVersionSchema, } from "../shared/subdocuments.js";
const objectId = Schema.Types.ObjectId;
const SectionSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: String,
    fullDescription: String,
    categoryId: { type: objectId, ref: "Category" },
    subcategory: String,
    status: {
        type: String,
        enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
        default: "DRAFT",
    },
    visibility: {
        type: String,
        enum: ["INTERNAL", "MARKETPLACE", "HIDDEN", "PRIVATE"],
        default: "INTERNAL",
    },
    featured: { type: Boolean, default: false },
    pricingType: { type: String, enum: ["FREE", "PAID"], default: "PAID" },
    priceCents: { type: Number, default: 0 },
    compareAtPriceCents: Number,
    accessType: {
        type: String,
        enum: ["SINGLE", "BUNDLE", "SUBSCRIPTION", "INTERNAL"],
        default: "SINGLE",
    },
    licenseType: {
        type: String,
        enum: ["SINGLE_STORE", "MULTI_STORE", "UNLIMITED"],
        default: "SINGLE_STORE",
    },
    authorId: { type: objectId, ref: "AdminUser" },
    tagIds: [{ type: objectId, ref: "Tag" }],
    versions: [SectionVersionSchema],
    previews: [SectionPreviewSchema],
    documentation: SectionDocumentationSchema,
    compatibility: SectionCompatibilitySchema,
    internalKeywords: String,
    metaTitle: String,
    metaDescription: String,
    marketplaceSubtitle: String,
    calloutBadgeText: String,
}, { timestamps: true });
export const SectionModel = mongoose.models.Section || mongoose.model("Section", SectionSchema);
