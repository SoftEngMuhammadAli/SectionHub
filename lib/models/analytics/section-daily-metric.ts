import mongoose, { Schema } from "mongoose";

const objectId = Schema.Types.ObjectId;

const SectionDailyMetricSchema = new Schema(
  {
    sectionId: { type: objectId, ref: "Section", required: true },
    date: { type: Date, required: true },
    installs: { type: Number, default: 0 },
    revenueCents: { type: Number, default: 0 },
    activeShops: { type: Number, default: 0 },
  },
  { timestamps: false },
);

export const SectionDailyMetricModel =
  mongoose.models.SectionDailyMetric ||
  mongoose.model("SectionDailyMetric", SectionDailyMetricSchema);
