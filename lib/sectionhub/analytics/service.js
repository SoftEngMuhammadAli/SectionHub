import { buildAnalyticsInsights } from "@/lib/sectionhub/analytics/insights";

export async function getAnalyticsData(rangeDays = 30) {
  return buildAnalyticsInsights({ rangeDays });
}
