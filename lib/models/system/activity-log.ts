import mongoose, { Schema } from "mongoose";

const objectId = Schema.Types.ObjectId;

const ActivityLogSchema = new Schema(
  {
    actorId: { type: objectId, ref: "AdminUser" },
    actorName: String,
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    entityLabel: { type: String, required: true },
    metadataJson: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ActivityLogModel =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", ActivityLogSchema);
