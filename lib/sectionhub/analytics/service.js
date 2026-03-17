import connectToDatabase from "@/lib/db";
import { InstallEventModel, OrderModel } from "@/lib/models";
import { getBundles } from "@/lib/sectionhub/bundles/service";
import { getCategories } from "@/lib/sectionhub/categories/service";
import { getCustomers } from "@/lib/sectionhub/customers/service";
import { getSections } from "@/lib/sectionhub/sections/service";
export async function getAnalyticsData() {
  await connectToDatabase();
  const [sections, categories, bundles, customers, installs, orders] =
    await Promise.all([
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
    revenue: orders.reduce(
      (sum, order) => sum + (order.totalAmountCents ?? 0),
      0,
    ),
  };
}
