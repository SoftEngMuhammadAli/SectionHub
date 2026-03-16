import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getOrders } from "@/features/orders/service";

type SearchParams = Record<string, string | string[] | undefined>;

function asValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = asValue(params.search).trim().toLowerCase();
  const status = asValue(params.status);
  const provider = asValue(params.provider);

  const orders = await getOrders();
  const filteredOrders = orders.filter((order) => {
    const matchesQuery =
      !query ||
      order.number.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.shop.toLowerCase().includes(query) ||
      order.purchasedItems.toLowerCase().includes(query);
    const matchesStatus = !status || order.status === status;
    const matchesProvider = !provider || order.provider === provider;
    return matchesQuery && matchesStatus && matchesProvider;
  });

  const providers = Array.from(new Set(orders.map((order) => order.provider)));
  const statuses = Array.from(new Set(orders.map((order) => order.status)));

  return (
    <div className="space-y-6">
      <SectionTitle title="Orders / Purchases" subtitle="Track transactions, payment state, and purchased items." />

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.8fr_1fr_1fr_auto]">
          <input name="search" defaultValue={query} className="sectionhub-input" placeholder="Search by order, customer, shop" />
          <select name="status" defaultValue={status} className="sectionhub-select">
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select name="provider" defaultValue={provider} className="sectionhub-select">
            <option value="">All providers</option>
            {providers.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="submit" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white">Apply</button>
            <a href="/orders" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white px-4 text-[13px] font-medium text-[var(--text-primary)]">Reset</a>
          </div>
        </form>
      </Card>

      <div className="text-[13px] text-[var(--text-secondary)]">{filteredOrders.length} result(s)</div>

      <div className="sectionhub-mobile-list md:hidden">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold">{order.number}</div>
                <div className="text-[11px] text-[var(--text-tertiary)]">{order.date}</div>
              </div>
              <div className="rounded-full bg-[var(--primary-light)] px-2.5 py-1 text-[11px] font-medium text-[var(--primary-light-text)]">{order.status}</div>
            </div>
            <div className="mt-4 space-y-2 text-[13px] text-[var(--text-secondary)]">
              <div className="flex justify-between gap-3"><span>Customer</span><span className="text-right">{order.customer}</span></div>
              <div className="flex justify-between gap-3"><span>Shop</span><span className="font-mono text-right">{order.shop}</span></div>
              <div className="flex justify-between gap-3"><span>Items</span><span className="text-right">{order.purchasedItems}</span></div>
              <div className="flex justify-between gap-3"><span>Amount</span><span className="font-mono">{order.amount}</span></div>
              <div className="flex justify-between gap-3"><span>Provider</span><span>{order.provider}</span></div>
            </div>
          </Card>
        ))}
        {!filteredOrders.length ? <Card className="p-6 text-[13px] text-[var(--text-secondary)]">No orders match the current filters.</Card> : null}
      </div>

      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead className="bg-[var(--page-bg)] text-[12px] text-[var(--text-tertiary)]">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer / Shop</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Provider</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-[var(--border)]">
                  <td className="px-5 py-4">
                    <div className="font-medium">{order.number}</div>
                    <div className="text-[11px] text-[var(--text-tertiary)]">{order.date}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div>{order.customer}</div>
                    <div className="font-mono text-[11px] text-[var(--text-tertiary)]">{order.shop}</div>
                  </td>
                  <td className="px-5 py-4">{order.purchasedItems}</td>
                  <td className="px-5 py-4 font-mono">{order.amount}</td>
                  <td className="px-5 py-4">{order.provider}</td>
                  <td className="px-5 py-4">{order.status}</td>
                </tr>
              ))}
              {!filteredOrders.length ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[var(--text-secondary)]">No orders match the current filters.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
