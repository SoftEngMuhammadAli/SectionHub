import mongoose, { Schema } from "mongoose";
import { OrderItemSchema } from "@/lib/models/shared/subdocuments";
const objectId = Schema.Types.ObjectId;
const OrderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerId: { type: objectId, ref: "Customer", required: true },
    shopId: { type: objectId, ref: "Shop", required: true },
    totalAmountCents: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: {
        type: String,
        enum: ["PENDING", "PAID", "REFUNDED", "FAILED"],
        default: "PENDING",
    },
    paymentProvider: { type: String, required: true },
    purchasedAt: { type: Date, default: Date.now },
    items: [OrderItemSchema],
}, { timestamps: false });
export const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);
