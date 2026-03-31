import { buildDashboardInsights } from "@/lib/sectionhub/analytics/insights";

export async function getDashboardData() {
  return buildDashboardInsights();
}
