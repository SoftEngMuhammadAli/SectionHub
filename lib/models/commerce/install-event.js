import mongoose, { Schema } from "mongoose";
const objectId = Schema.Types.ObjectId;
const InstallEventSchema = new Schema({
    sectionId: { type: objectId, ref: "Section", required: true },
    shopId: { type: objectId, ref: "Shop", required: true },
    status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
    installedAt: { type: Date, default: Date.now },
}, { timestamps: false });
export const InstallEventModel = mongoose.models.InstallEvent ||
    mongoose.model("InstallEvent", InstallEventSchema);
