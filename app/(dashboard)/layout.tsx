import { requireAdmin } from "@/lib/auth/server";
import { DashboardShell } from "@/components/sectionhub/layout";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();
  return <DashboardShell>{children}</DashboardShell>;
}
