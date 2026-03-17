import { requireAdmin } from "@/lib/auth/server";
import { AppShell } from "@/components/shared/layout/app-shell";
export default async function AdminLayout({ children, }) {
    await requireAdmin();
    return <AppShell>{children}</AppShell>;
}
