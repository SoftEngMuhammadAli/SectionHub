import mongoose, { Schema } from "mongoose";
const objectId = Schema.Types.ObjectId;
const PasswordResetTokenSchema = new Schema({
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: objectId, ref: "AdminUser", required: true },
    expiresAt: { type: Date, required: true },
    usedAt: Date,
}, { timestamps: { createdAt: true, updatedAt: false } });
export const PasswordResetTokenModel = mongoose.models.PasswordResetToken ||
    mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
