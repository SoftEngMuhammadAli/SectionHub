import connectToDatabase from "@/lib/db";
import {
  ActivityLogModel,
  CategoryModel,
  InstallEventModel,
  OrderModel,
  SectionModel,
  ShopModel,
} from "@/lib/models";
import { formatDate, formatPrice, toId } from "@/lib/sectionhub/shared/format";

const numberFormatter = new Intl.NumberFormat("en-US");
const chartDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});
const rangeDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});
const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});
const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

async function withSectionRelations(query) {
  return query.populate("categoryId").populate("tagIds").lean();
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(value) {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
}

function addDays(value, amount) {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function toDateKey(value) {
  return startOfDay(value).toISOString().slice(0, 10);
}

function isWithinRange(value, start, end) {
  const time = new Date(value).getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function resolveAnchorDate(installs, orders) {
  const latestInstall = installs[0]?.installedAt
    ? new Date(installs[0].installedAt)
    : null;
  const latestOrder = orders[0]?.purchasedAt
    ? new Date(orders[0].purchasedAt)
    : null;

  if (latestInstall && latestOrder) {
    return latestInstall > latestOrder ? latestInstall : latestOrder;
  }

  return latestInstall ?? latestOrder ?? new Date();
}

function buildPeriod(rangeDays, anchorDate) {
  const currentEnd = endOfDay(anchorDate);
  const currentStart = startOfDay(addDays(currentEnd, -(rangeDays - 1)));
  const previousEnd = endOfDay(addDays(currentStart, -1));
  const previousStart = startOfDay(addDays(previousEnd, -(rangeDays - 1)));

  return {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
  };
}

function formatDelta(current, previous) {
  let raw = 0;

  if (previous === 0) {
    raw = current === 0 ? 0 : 100;
  } else {
    raw = ((current - previous) / previous) * 100;
  }

  const rounded =
    Math.abs(raw) >= 100 ? Math.round(raw) : Number(raw.toFixed(1));

  return {
    value: raw,
    tone: raw < 0 ? "danger" : "success",
    label: `${rounded >= 0 ? "+" : "-"}${Math.abs(rounded)}%`,
  };
}

function formatRelativeTime(value, now = new Date()) {
  const target = new Date(value);
  const diffMs = target.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (Math.abs(diffMinutes) < 60) {
    return relativeTimeFormatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return relativeTimeFormatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return relativeTimeFormatter.format(diffDays, "day");
}

function buildDailySeries(start, end, valuesByDay) {
  const items = [];
  let cursor = startOfDay(start);

  while (cursor.getTime() <= end.getTime()) {
    const key = toDateKey(cursor);
    items.push({
      key,
      date: new Date(cursor),
      label: chartDateFormatter.format(cursor),
      shortLabel: weekdayFormatter.format(cursor).toUpperCase(),
      value: valuesByDay.get(key) ?? 0,
    });
    cursor = addDays(cursor, 1);
  }

  return items;
}

function sumOrderRevenue(orders) {
  return orders.reduce((sum, order) => sum + (order.totalAmountCents ?? 0), 0);
}

async function loadAnalyticsSourceData() {
  await connectToDatabase();

  const [sections, categories, installs, paidOrders, shops, logs] =
    await Promise.all([
      withSectionRelations(SectionModel.find().sort({ updatedAt: -1 })),
      CategoryModel.find().sort({ sortOrder: 1 }).lean(),
      InstallEventModel.find().sort({ installedAt: -1 }).lean(),
      OrderModel.find({ status: "PAID" }).sort({ purchasedAt: -1 }).lean(),
      ShopModel.find().lean(),
      ActivityLogModel.find().sort({ createdAt: -1 }).limit(8).lean(),
    ]);

  return {
    sections,
    categories,
    installs,
    paidOrders,
    shops,
    logs,
  };
}

export async function buildAnalyticsInsights({ rangeDays = 30 } = {}) {
  const { sections, categories, installs, paidOrders, shops } =
    await loadAnalyticsSourceData();

  const successfulInstalls = installs.filter(
    (item) => item.status === "SUCCESS",
  );
  const anchorDate = resolveAnchorDate(successfulInstalls, paidOrders);
  const period = buildPeriod(rangeDays, anchorDate);

  const currentInstalls = successfulInstalls.filter((item) =>
    isWithinRange(item.installedAt, period.currentStart, period.currentEnd),
  );
  const previousInstalls = successfulInstalls.filter((item) =>
    isWithinRange(item.installedAt, period.previousStart, period.previousEnd),
  );
  const currentOrders = paidOrders.filter((item) =>
    isWithinRange(item.purchasedAt, period.currentStart, period.currentEnd),
  );
  const previousOrders = paidOrders.filter((item) =>
    isWithinRange(item.purchasedAt, period.previousStart, period.previousEnd),
  );

  const sectionMap = new Map(
    sections.map((section) => [toId(section._id), section]),
  );
  const categoryInstallMap = new Map();
  const sectionInstallMap = new Map();
  const shopMap = new Map(shops.map((shop) => [toId(shop._id), shop]));

  for (const install of currentInstalls) {
    const sectionId = toId(install.sectionId);
    const count = (sectionInstallMap.get(sectionId) ?? 0) + 1;
    sectionInstallMap.set(sectionId, count);

    const categoryName =
      sectionMap.get(sectionId)?.categoryId?.name ?? "Unassigned";
    categoryInstallMap.set(
      categoryName,
      (categoryInstallMap.get(categoryName) ?? 0) + 1,
    );
  }

  const allTimeSectionInstallMap = new Map();
  for (const install of successfulInstalls) {
    const sectionId = toId(install.sectionId);
    allTimeSectionInstallMap.set(
      sectionId,
      (allTimeSectionInstallMap.get(sectionId) ?? 0) + 1,
    );
  }

  const sectionRankingSource =
    currentInstalls.length > 0 ? sectionInstallMap : allTimeSectionInstallMap;

  const topSections = sections
    .map((section) => {
      const installCount = sectionRankingSource.get(toId(section._id)) ?? 0;
      return {
        id: toId(section._id),
        name: section.name,
        slug: section.slug,
        category: section.categoryId?.name ?? "Unassigned",
        installCount,
        installs: numberFormatter.format(installCount),
      };
    })
    .filter((section) => section.installCount > 0)
    .sort((left, right) => right.installCount - left.installCount)
    .slice(0, 3);

  const fallbackCategoryBreakdown = categories
    .map((category) => ({
      name: category.name,
      installCount: sections.filter(
        (section) => section.categoryId?.name === category.name,
      ).length,
    }))
    .filter((item) => item.installCount > 0);

  const categoryRows =
    currentInstalls.length > 0
      ? Array.from(categoryInstallMap.entries()).map(
          ([name, installCount]) => ({
            name,
            installCount,
          }),
        )
      : fallbackCategoryBreakdown;

  const categoryTotal = categoryRows.reduce(
    (sum, item) => sum + item.installCount,
    0,
  );

  const categoryBreakdown = categoryRows
    .sort((left, right) => right.installCount - left.installCount)
    .slice(0, 4)
    .map((item) => ({
      ...item,
      percent: categoryTotal
        ? Math.round((item.installCount / categoryTotal) * 100)
        : 0,
    }));

  const revenueByDay = new Map();
  for (const order of currentOrders) {
    const key = toDateKey(order.purchasedAt);
    revenueByDay.set(
      key,
      (revenueByDay.get(key) ?? 0) + (order.totalAmountCents ?? 0),
    );
  }

  const installsByDay = new Map();
  for (const install of currentInstalls) {
    const key = toDateKey(install.installedAt);
    installsByDay.set(key, (installsByDay.get(key) ?? 0) + 1);
  }

  const revenueSeries = buildDailySeries(
    period.currentStart,
    period.currentEnd,
    revenueByDay,
  ).map((item) => ({
    ...item,
    revenueCents: item.value,
    revenueLabel: formatPrice(item.value),
    installCount: installsByDay.get(item.key) ?? 0,
  }));

  const currentInstallShopIds = new Set(
    currentInstalls.map((install) => toId(install.shopId)),
  );
  const previousInstallShopIds = new Set(
    previousInstalls.map((install) => toId(install.shopId)),
  );
  const currentPaidShopIds = new Set(
    currentOrders.map((order) => toId(order.shopId)),
  );
  const previousPaidShopIds = new Set(
    previousOrders.map((order) => toId(order.shopId)),
  );

  const currentActiveShops = shops.filter(
    (shop) =>
      String(shop.status).toLowerCase() !== "churned" &&
      (!shop.createdAt || new Date(shop.createdAt) <= period.currentEnd),
  ).length;
  const previousActiveShops = shops.filter(
    (shop) =>
      String(shop.status).toLowerCase() !== "churned" &&
      (!shop.createdAt || new Date(shop.createdAt) <= period.previousEnd),
  ).length;

  const currentConversionRate = currentInstallShopIds.size
    ? (currentPaidShopIds.size / currentInstallShopIds.size) * 100
    : 0;
  const previousConversionRate = previousInstallShopIds.size
    ? (previousPaidShopIds.size / previousInstallShopIds.size) * 100
    : 0;

  const recentInstalls = successfulInstalls.slice(0, 5).map((install) => {
    const shop = shopMap.get(toId(install.shopId));
    const section = sectionMap.get(toId(install.sectionId));

    return {
      id: toId(install._id),
      domain: shop?.domain ?? "Unknown shop",
      sectionName: section?.name ?? "Unknown section",
      relativeTime: formatRelativeTime(install.installedAt, anchorDate),
      installedAt: rangeDateFormatter.format(new Date(install.installedAt)),
    };
  });

  return {
    rangeDays,
    rangeLabel: `${rangeDateFormatter.format(period.currentStart)} - ${rangeDateFormatter.format(period.currentEnd)}`,
    overview: {
      installs: currentInstalls.length,
      installsDelta: formatDelta(
        currentInstalls.length,
        previousInstalls.length,
      ),
      revenueCents: sumOrderRevenue(currentOrders),
      revenueLabel: formatPrice(sumOrderRevenue(currentOrders)),
      revenueDelta: formatDelta(
        sumOrderRevenue(currentOrders),
        sumOrderRevenue(previousOrders),
      ),
      activeShops: currentActiveShops,
      activeShopsDelta: formatDelta(currentActiveShops, previousActiveShops),
      conversionRate: Number(currentConversionRate.toFixed(2)),
      conversionLabel: `${currentConversionRate.toFixed(2)}%`,
      conversionDelta: formatDelta(
        currentConversionRate,
        previousConversionRate,
      ),
    },
    revenueSeries,
    recentInstalls,
    topSections,
    categoryBreakdown,
  };
}

export async function buildDashboardInsights() {
  const { sections, categories, installs, paidOrders, shops, logs } =
    await loadAnalyticsSourceData();

  const successfulInstalls = installs.filter(
    (item) => item.status === "SUCCESS",
  );
  const anchorDate = resolveAnchorDate(successfulInstalls, paidOrders);
  const monthlyPeriod = buildPeriod(30, anchorDate);
  const weeklyPeriod = buildPeriod(7, anchorDate);

  const currentMonthlyOrders = paidOrders.filter((item) =>
    isWithinRange(
      item.purchasedAt,
      monthlyPeriod.currentStart,
      monthlyPeriod.currentEnd,
    ),
  );
  const previousMonthlyOrders = paidOrders.filter((item) =>
    isWithinRange(
      item.purchasedAt,
      monthlyPeriod.previousStart,
      monthlyPeriod.previousEnd,
    ),
  );

  const currentMonthlyInstalls = successfulInstalls.filter((item) =>
    isWithinRange(
      item.installedAt,
      monthlyPeriod.currentStart,
      monthlyPeriod.currentEnd,
    ),
  );
  const previousMonthlyInstalls = successfulInstalls.filter((item) =>
    isWithinRange(
      item.installedAt,
      monthlyPeriod.previousStart,
      monthlyPeriod.previousEnd,
    ),
  );

  const currentWeeklyInstalls = successfulInstalls.filter((item) =>
    isWithinRange(
      item.installedAt,
      weeklyPeriod.currentStart,
      weeklyPeriod.currentEnd,
    ),
  );

  const currentActiveShops = shops.filter(
    (shop) =>
      String(shop.status).toLowerCase() !== "churned" &&
      (!shop.createdAt || new Date(shop.createdAt) <= monthlyPeriod.currentEnd),
  ).length;
  const previousActiveShops = shops.filter(
    (shop) =>
      String(shop.status).toLowerCase() !== "churned" &&
      (!shop.createdAt ||
        new Date(shop.createdAt) <= monthlyPeriod.previousEnd),
  ).length;

  const currentSectionCount = sections.filter(
    (section) =>
      !section.createdAt ||
      new Date(section.createdAt) <= monthlyPeriod.currentEnd,
  ).length;
  const previousSectionCount = sections.filter(
    (section) =>
      !section.createdAt ||
      new Date(section.createdAt) <= monthlyPeriod.previousEnd,
  ).length;

  const weeklyInstallMap = new Map();
  for (const install of currentWeeklyInstalls) {
    const key = toDateKey(install.installedAt);
    weeklyInstallMap.set(key, (weeklyInstallMap.get(key) ?? 0) + 1);
  }

  const monthlyRevenueMap = new Map();
  for (const order of currentMonthlyOrders) {
    const key = toDateKey(order.purchasedAt);
    monthlyRevenueMap.set(
      key,
      (monthlyRevenueMap.get(key) ?? 0) + (order.totalAmountCents ?? 0),
    );
  }

  const sectionInstallMap = new Map();
  for (const install of successfulInstalls) {
    const key = toId(install.sectionId);
    sectionInstallMap.set(key, (sectionInstallMap.get(key) ?? 0) + 1);
  }

  const rows = sections.map((section) => ({
    id: toId(section._id),
    name: section.name,
    slug: section.slug,
    category: section.categoryId?.name ?? "Unassigned",
    price: formatPrice(section.priceCents),
    version: section.versions?.[0]?.version ?? "v1.0.0",
    installs: sectionInstallMap.get(toId(section._id)) ?? 0,
    updatedAt: formatDate(section.updatedAt),
    status: section.status,
  }));

  const revenueSeries = buildDailySeries(
    monthlyPeriod.currentStart,
    monthlyPeriod.currentEnd,
    monthlyRevenueMap,
  ).map((item) => ({
    ...item,
    revenueCents: item.value,
  }));

  return {
    rangeLabel: `${rangeDateFormatter.format(weeklyPeriod.currentStart)} - ${rangeDateFormatter.format(weeklyPeriod.currentEnd)}`,
    overview: {
      totalSections: currentSectionCount,
      totalSectionsDelta: formatDelta(
        currentSectionCount,
        previousSectionCount,
      ),
      totalInstalls: currentMonthlyInstalls.length,
      totalInstallsDelta: formatDelta(
        currentMonthlyInstalls.length,
        previousMonthlyInstalls.length,
      ),
      revenueMonth: formatPrice(sumOrderRevenue(currentMonthlyOrders)),
      revenueDelta: formatDelta(
        sumOrderRevenue(currentMonthlyOrders),
        sumOrderRevenue(previousMonthlyOrders),
      ),
      activeShops: currentActiveShops,
      activeShopsDelta: formatDelta(currentActiveShops, previousActiveShops),
    },
    recentSections: rows.slice(0, 4),
    topSections: rows
      .slice()
      .sort((a, b) => b.installs - a.installs)
      .slice(0, 4)
      .map((row) => ({
        name: row.name,
        slug: row.slug,
        installs: numberFormatter.format(row.installs),
      })),
    activity: logs.map((log) => ({
      actor: log.actorName ?? (log.actorId ? "Admin" : "System"),
      action: log.action,
      target: log.entityLabel,
      time: formatRelativeTime(log.createdAt, anchorDate),
    })),
    categories: categories.slice(0, 4).map((category) => ({
      name: category.name,
      count: rows.filter((row) => row.category === category.name).length,
    })),
    installsByDay: buildDailySeries(
      weeklyPeriod.currentStart,
      weeklyPeriod.currentEnd,
      weeklyInstallMap,
    ).map((item) => ({
      label: item.shortLabel,
      value: item.value,
    })),
    revenueTrend: revenueSeries,
  };
}
