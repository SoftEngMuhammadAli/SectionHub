import connectToDatabase from "@/lib/db";
import { InstallEventModel, OrderModel } from "@/models";
import { getBundles } from "@/features/bundles/service";
import { getCategories } from "@/features/categories/service";
import { getCustomers } from "@/features/customers/service";
import { getSections } from "@/features/sections/service";

export async function getAnalyticsData() {
  await connectToDatabase();
  const [sections, categories, bundles, customers, installs, orders] = await Promise.all([
    getSections(),
    getCategories(),
    getBundles(),
    getCustomers(),
    InstallEventModel.find().lean(),
    OrderModel.find({ status: "PAID" }).lean(),
  ]);

  return {
    sections,
    categories,
    bundles,
    customers,
    installs,
    revenue: orders.reduce((sum, order: any) => sum + (order.totalAmountCents ?? 0), 0),
  };
}
