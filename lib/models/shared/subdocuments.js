import { Schema } from "mongoose";
const objectId = Schema.Types.ObjectId;
export const SectionVersionSchema = new Schema({
    version: { type: String, required: true },
    changelog: String,
    liquidFileUrl: String,
    assetZipUrl: String,
    checksum: String,
    releaseDate: Date,
    createdById: { type: objectId, ref: "AdminUser" },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
export const SectionPreviewSchema = new Schema({
    type: {
        type: String,
        enum: ["IMAGE", "VIDEO", "YOUTUBE", "LIVE_URL"],
        default: "IMAGE",
    },
    url: { type: String, required: true },
    title: String,
    caption: String,
    altText: String,
    isThumbnail: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
}, { _id: true });
export const SectionDocumentationSchema = new Schema({
    installationSteps: String,
    usageNotes: String,
    merchantInstructions: String,
    supportNotes: String,
    changelog: String,
}, { _id: false });
export const SectionCompatibilitySchema = new Schema({
    themeCompatibility: String,
    os20Compatible: { type: Boolean, default: true },
    appBlockSupport: { type: Boolean, default: false },
    dependencies: String,
    testedEnvironments: String,
}, { _id: false });
export const OrderItemSchema = new Schema({
    itemType: { type: String, required: true },
    sectionId: { type: objectId, ref: "Section" },
    bundleId: { type: objectId, ref: "Bundle" },
    titleSnapshot: { type: String, required: true },
    unitPriceCents: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
}, { _id: true });
