import connectToDatabase from "@/lib/db";
import { CustomerModel, OrderModel, ShopModel } from "@/lib/models";
import { formatDate, formatPrice, toId } from "@/lib/sectionhub/shared/format";

export async function getOrders() {
  await connectToDatabase();
  const [orders, customers, shops] = await Promise.all([
    OrderModel.find().sort({ purchasedAt: -1 }).lean(),
    CustomerModel.find().lean(),
    ShopModel.find().lean(),
  ]);

  return orders.map((order: any) => ({
    id: toId(order._id),
    number: order.orderNumber,
    customer: customers.find((item: any) => toId(item._id) === toId(order.customerId))?.name ?? "Unknown",
    shop: shops.find((item: any) => toId(item._id) === toId(order.shopId))?.domain ?? "-",
    amount: formatPrice(order.totalAmountCents),
    provider: order.paymentProvider,
    status: order.status,
    date: formatDate(order.purchasedAt),
    purchasedItems: (order.items ?? []).map((item: any) => item.titleSnapshot).join(", "),
  }));
}
