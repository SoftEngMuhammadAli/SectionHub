import Link from "next/link";
import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getCategories } from "@/features/categories/service";
import { getSections } from "@/features/sections/service";
import { getTags } from "@/features/tags/service";

type SearchParams = Record<string, string | string[] | undefined>;

function asValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SectionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const search = asValue(params.search).trim().toLowerCase();
  const categoryFilter = asValue(params.category);
  const tagFilter = asValue(params.tag);
  const statusFilter = asValue(params.status);
  const pricingFilter = asValue(params.pricing);

  const [sections, categories, tags] = await Promise.all([getSections(), getCategories(), getTags()]);

  const filteredSections = sections.filter((section) => {
    const matchesSearch =
      !search ||
      section.name.toLowerCase().includes(search) ||
      section.slug.toLowerCase().includes(search) ||
      section.category.toLowerCase().includes(search) ||
      section.tags.some((tag) => tag.toLowerCase().includes(search));
    const matchesCategory = !categoryFilter || section.category === categoryFilter;
    const matchesTag = !tagFilter || section.tags.includes(tagFilter);
    const matchesStatus = !statusFilter || section.status === statusFilter;
    const matchesPricing =
      !pricingFilter ||
      (pricingFilter === "FREE" ? section.price === "$0.00" : section.price !== "$0.00");

    return matchesSearch && matchesCategory && matchesTag && matchesStatus && matchesPricing;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionTitle title="Sections" subtitle="Manage premium Shopify Liquid sections, versions, previews, pricing, and publishing states." />
        <Link href="/sections/new" className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white">+ Upload Section</Link>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.8fr_repeat(4,1fr)_auto]">
          <input name="search" defaultValue={search} className="sectionhub-input" placeholder="Search sections, slugs, or tags" />
          <select name="category" defaultValue={categoryFilter} className="sectionhub-select">
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select>
          <select name="tag" defaultValue={tagFilter} className="sectionhub-select">
            <option value="">All tags</option>
            {tags.map((tag) => <option key={tag.id} value={tag.name}>{tag.name}</option>)}
          </select>
          <select name="status" defaultValue={statusFilter} className="sectionhub-select">
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select name="pricing" defaultValue={pricingFilter} className="sectionhub-select">
            <option value="">All pricing</option>
            <option value="PAID">Paid</option>
            <option value="FREE">Free</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white">Apply</button>
            <Link href="/sections" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white px-4 text-[13px] font-medium text-[var(--text-primary)]">Reset</Link>
          </div>
        </form>
      </Card>

      <div className="text-[13px] text-[var(--text-secondary)]">{filteredSections.length} result(s)</div>

      <div className="sectionhub-mobile-list md:hidden">
        {filteredSections.map((section) => (
          <Card key={section.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold">{section.name}</div>
                <div className="truncate font-mono text-[11px] text-[var(--text-tertiary)]">{section.slug}</div>
              </div>
              <div className="rounded-full bg-[var(--primary-light)] px-2.5 py-1 text-[11px] font-medium text-[var(--primary-light-text)]">{section.status}</div>
            </div>
            <div className="mt-4 space-y-2 text-[13px] text-[var(--text-secondary)]">
              <div className="flex justify-between gap-3"><span>Category</span><span className="text-right">{section.category}</span></div>
              <div className="flex justify-between gap-3"><span>Tags</span><span className="text-right">{section.tags.join(", ") || "Ã¢â‚¬â€"}</span></div>
              <div className="flex justify-between gap-3"><span>Price</span><span className="font-mono">{section.price}</span></div>
              <div className="flex justify-between gap-3"><span>Version</span><span className="font-mono">{section.version}</span></div>
              <div className="flex justify-between gap-3"><span>Installs</span><span className="font-mono">{section.installs}</span></div>
              <div className="flex justify-between gap-3"><span>Updated</span><span>{section.updatedAt}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/sections/${section.id}/edit`} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white px-3 text-[13px] font-medium text-[var(--text-primary)]">Edit</Link>
              <button type="button" className="inline-flex min-h-10 flex-1 items-center justify-center rounded-[8px] border border-[var(--danger)]/20 bg-white px-3 text-[13px] font-medium text-[var(--danger)]">Delete</button>
            </div>
          </Card>
        ))}
        {!filteredSections.length ? <Card className="p-6 text-[13px] text-[var(--text-secondary)]">No sections match the current filters.</Card> : null}
      </div>

      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] text-left text-[13px]">
            <thead className="bg-[var(--page-bg)] text-[12px] text-[var(--text-tertiary)]">
              <tr>
                <th className="px-5 py-3">Section</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Tags</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Version</th>
                <th className="px-5 py-3">Installs</th>
                <th className="px-5 py-3">Updated</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((section) => (
                <tr key={section.id} className="border-t border-[var(--border)]">
                  <td className="px-5 py-4">
                    <div className="font-medium">{section.name}</div>
                    <div className="font-mono text-[11px] text-[var(--text-tertiary)]">{section.slug}</div>
                  </td>
                  <td className="px-5 py-4">{section.category}</td>
                  <td className="px-5 py-4">{section.tags.join(", ")}</td>
                  <td className="px-5 py-4 font-mono">{section.price}</td>
                  <td className="px-5 py-4 font-mono">{section.version}</td>
                  <td className="px-5 py-4 font-mono">{section.installs}</td>
                  <td className="px-5 py-4">{section.updatedAt}</td>
                  <td className="px-5 py-4">{section.status}</td>
                  <td className="px-5 py-4"><Link className="text-[var(--primary)]" href={`/sections/${section.id}/edit`}>Edit</Link></td>
                </tr>
              ))}
              {!filteredSections.length ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-[13px] text-[var(--text-secondary)]">No sections match the current filters.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
