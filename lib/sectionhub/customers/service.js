import connectToDatabase from "@/lib/db";
import {
  CustomerModel,
  InstallEventModel,
  OrderModel,
  ShopModel,
} from "@/lib/models";
import { formatPrice, toId } from "@/lib/sectionhub/shared/format";
export async function getCustomers() {
  await connectToDatabase();
  const [customers, shops, orders, installs] = await Promise.all([
    CustomerModel.find().sort({ createdAt: -1 }).lean(),
    ShopModel.find().lean(),
    OrderModel.find().lean(),
    InstallEventModel.find({ status: "SUCCESS" }).lean(),
  ]);
  return customers.map((customer) => {
    const customerShops = shops.filter(
      (shop) => toId(shop.customerId) === toId(customer._id),
    );
    const spent = orders
      .filter((order) => toId(order.customerId) === toId(customer._id))
      .reduce((sum, order) => sum + (order.totalAmountCents ?? 0), 0);
    const installCount = installs.filter((install) =>
      customerShops.some((shop) => toId(shop._id) === toId(install.shopId)),
    ).length;
    return {
      id: toId(customer._id),
      name: customer.name,
      email: customer.email,
      domain: customerShops[0]?.domain ?? "-",
      spent: formatPrice(spent),
      installs: installCount,
      status: customerShops[0]?.status ?? "Inactive",
    };
  });
}
