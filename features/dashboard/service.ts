import connectToDatabase from "@/lib/db";
import { ActivityLogModel, CategoryModel, InstallEventModel, OrderModel, SectionModel, ShopModel } from "@/models";
import { formatDate, formatPrice, toId } from "@/features/shared/format";

async function withSectionRelations(query: ReturnType<typeof SectionModel.find>) {
  return query.populate("categoryId").populate("tagIds").lean();
}

export async function getDashboardData() {
  await connectToDatabase();
  const [sections, installs, paidOrders, shops, logs, categories] = await Promise.all([
    withSectionRelations(SectionModel.find().sort({ updatedAt: -1 })),
    InstallEventModel.find().sort({ installedAt: -1 }).lean(),
    OrderModel.find({ status: "PAID" }).lean(),
    ShopModel.countDocuments({ status: { $ne: "Churned" } }),
    ActivityLogModel.find().sort({ createdAt: -1 }).limit(5).lean(),
    CategoryModel.find().sort({ sortOrder: 1 }).lean(),
  ]);

  const installMap = new Map<string, number>();
  for (const install of installs) {
    if (install.status !== "SUCCESS") continue;
    const key = toId(install.sectionId);
    installMap.set(key, (installMap.get(key) ?? 0) + 1);
  }

  const totalRevenue = paidOrders.reduce((sum, order: any) => sum + (order.totalAmountCents ?? 0), 0);
  const rows = sections.map((section: any) => ({
    id: toId(section._id),
    name: section.name,
    slug: section.slug,
    category: section.categoryId?.name ?? "Unassigned",
    price: formatPrice(section.priceCents),
    version: section.versions?.[0]?.version ?? "v1.0.0",
    installs: installMap.get(toId(section._id)) ?? 0,
    updatedAt: formatDate(section.updatedAt),
    status: section.status,
  }));

  return {
    overview: {
      totalSections: rows.length,
      totalInstalls: installs.filter((item: any) => item.status === "SUCCESS").length,
      revenueMonth: formatPrice(totalRevenue),
      activeShops: shops,
    },
    recentSections: rows.slice(0, 4),
    topSections: rows
      .slice()
      .sort((a, b) => b.installs - a.installs)
      .slice(0, 4)
      .map((row) => ({
        name: row.name,
        slug: row.slug,
        installs: String(row.installs),
      })),
    activity: logs.map((log: any) => ({
      actor: log.actorName ?? (log.actorId ? "Admin" : "System"),
      action: log.action,
      target: log.entityLabel,
      time: formatDate(log.createdAt),
    })),
    categories: categories.slice(0, 4).map((category: any) => ({
      name: category.name,
      count: rows.filter((row) => row.category === category.name).length,
    })),
    installsByDay: Array.from({ length: 7 }, (_, index) => ({
      label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
      value: 50 + index * 8,
    })),
  };
}
