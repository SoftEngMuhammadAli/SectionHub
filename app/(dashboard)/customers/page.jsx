import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getCustomers } from "@/lib/sectionhub/customers/service";
export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Customers / Shops"
        subtitle="Browse domains, spend, installs, and account status."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="p-5">
            <div className="text-[15px] font-semibold">{customer.name}</div>
            <div className="mt-1 break-all font-mono text-[11px] text-[var(--text-tertiary)]">
              {customer.domain}
            </div>
            <div className="mt-4 space-y-2 text-[13px] text-[var(--text-secondary)]">
              <div className="flex justify-between gap-3">
                <span>Email</span>
                <span className="text-right">{customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Total spent</span>
                <span className="font-mono">{customer.spent}</span>
              </div>
              <div className="flex justify-between">
                <span>Installs</span>
                <span className="font-mono">{customer.installs}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span>{customer.status}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
