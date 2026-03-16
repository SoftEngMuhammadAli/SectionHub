import { DashboardShell } from "@/components/sectionhub/layout";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
