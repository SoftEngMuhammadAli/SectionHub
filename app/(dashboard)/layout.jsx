import { requireAdmin } from "@/lib/auth/server";
import { DashboardShell } from "@/components/sectionhub/layout";
export default async function AdminLayout({ children, }) {
    await requireAdmin();
    return <DashboardShell>{children}</DashboardShell>;
}
