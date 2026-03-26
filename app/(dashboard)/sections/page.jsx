import Link from "next/link";
import { deleteSectionAction } from "@/app/actions";
import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getCategories } from "@/lib/sectionhub/categories/service";
import { getSections } from "@/lib/sectionhub/sections/service";
import { getTags } from "@/lib/sectionhub/tags/service";

function asValue(value) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parsePrice(value) {
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

function StatusBadge({ status }) {
  const tones = {
    PUBLISHED: "bg-[var(--success-light)] text-[var(--success)]",
    ARCHIVED: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
    DRAFT: "bg-[var(--warning-light)] text-[var(--warning)]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium ${
        tones[status] ?? tones.DRAFT
      }`}
    >
      {status === "PUBLISHED"
        ? "Active"
        : status === "DRAFT"
          ? "Draft"
          : "Archived"}
    </span>
  );
}

export default async function SectionsPage({ searchParams }) {
  const params = await searchParams;
  const query = asValue(params.search || params.q).trim();
  const category = asValue(params.category).trim();
  const tag = asValue(params.tag).trim();
  const status = asValue(params.status).trim();
  const pricing = asValue(params.pricing).trim();
  const sort = asValue(params.sort || "updated").trim();

  const [sections, categories, tags] = await Promise.all([
    getSections({
      q: query,
      category: category || undefined,
      tag: tag || undefined,
      status: status || undefined,
    }),
    getCategories(),
    getTags(),
  ]);

  const filteredSections = sections
    .filter((section) => {
      const priceValue = parsePrice(section.price);
      if (pricing === "free") return priceValue === 0;
      if (pricing === "paid") return priceValue > 0;
      return true;
    })
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  const created = params.created === "1";
  const deleted = params.deleted === "1";
  const published = params.published === "1";
  const error = asValue(params.error);

  return (
    <div className="space-y-6">
      {created ? (
        <div className="rounded-[8px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[13px] text-[var(--success)]">
          Section created successfully.
        </div>
      ) : null}
      {deleted ? (
        <div className="rounded-[8px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[13px] text-[var(--success)]">
          Section deleted successfully.
        </div>
      ) : null}
      {published ? (
        <div className="rounded-[8px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[13px] text-[var(--success)]">
          Section published successfully.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[8px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-4 py-2.5 text-[13px] text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <SectionTitle
          title="Sections List"
          subtitle="Search sections by name, slug, category and publishing status."
        />
        <Link
          href="/sections/new"
          className="inline-flex min-h-9 items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[14px] font-medium text-white"
        >
          + Upload Section
        </Link>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 lg:grid-cols-[1.6fr_0.9fr_0.8fr_0.7fr_0.8fr_0.8fr_auto]">
          <input
            name="search"
            defaultValue={query}
            placeholder="Search by section name or slug..."
            className="sectionhub-input"
          />
          <select
            name="category"
            defaultValue={category}
            className="sectionhub-select"
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select name="tag" defaultValue={tag} className="sectionhub-select">
            <option value="">All Tags</option>
            {tags.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={status}
            className="sectionhub-select"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select
            name="pricing"
            defaultValue={pricing}
            className="sectionhub-select"
          >
            <option value="">Pricing: All</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
          <select name="sort" defaultValue={sort} className="sectionhub-select">
            <option value="updated">Sort: Recently Updated</option>
            <option value="name">Sort: Name</option>
          </select>
          <button
            type="submit"
            className="inline-flex min-h-9 items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[14px] font-medium text-white"
          >
            Filter
          </button>
        </form>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-left">
          <thead className="border-b border-[var(--border-default)] bg-[var(--background-page)] text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--border-default)]"
                />
              </th>
              <th className="px-5 py-3">Thumbnail</th>
              <th className="px-5 py-3">Section</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Tags</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Version</th>
              <th className="px-5 py-3">Installs</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSections.map((section, index) => (
              <tr
                key={section.id}
                className="border-b border-[var(--border-default)] text-[14px] last:border-b-0 hover:bg-[var(--surface-soft)]/40"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[var(--border-default)]"
                  />
                </td>
                <td className="px-5 py-4">
                  <div
                    className="h-8 w-12 rounded-[6px] border border-[var(--border-default)]"
                    style={{
                      background: [
                        "linear-gradient(135deg,#c6baf8,#b9a5ff)",
                        "linear-gradient(135deg,#c4d3f7,#aec2ff)",
                        "linear-gradient(135deg,#bde8e0,#9ad5cb)",
                        "linear-gradient(135deg,#d3d8df,#b7bec7)",
                        "linear-gradient(135deg,#f2c7de,#e7afcc)",
                        "linear-gradient(135deg,#b8d8f2,#9ec8eb)",
                      ][index % 6],
                    }}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-[var(--text-primary)]">
                    {section.name}
                  </div>
                  <div className="font-mono-ui text-[12px] text-[var(--text-tertiary)]">
                    {section.slug}
                  </div>
                </td>
                <td className="px-5 py-4 text-[var(--text-secondary)]">
                  {section.category}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(section.tags ?? []).slice(0, 2).map((item) => (
                      <span
                        key={`${section.id}-${item}`}
                        className="rounded-full bg-[var(--surface-soft)] px-2 py-1 text-[11px] text-[var(--text-secondary)]"
                      >
                        {item}
                      </span>
                    ))}
                    {(section.tags ?? []).length > 2 ? (
                      <span className="rounded-full bg-[var(--surface-soft)] px-2 py-1 text-[11px] text-[var(--text-secondary)]">
                        +{section.tags.length - 2}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-5 py-4 font-mono-ui text-[13px]">
                  {section.price}
                </td>
                <td className="px-5 py-4 font-mono-ui text-[13px] text-[var(--text-secondary)]">
                  {section.version}
                </td>
                <td className="px-5 py-4 font-mono-ui text-[13px] text-[var(--text-secondary)]">
                  {section.installs}
                </td>
                <td className="px-5 py-4 text-[13px] text-[var(--text-secondary)]">
                  {section.updatedAt}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={section.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/sections/${section.id}/edit`}
                      className="inline-flex min-h-8 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-3 text-[12px] font-medium text-[var(--text-primary)]"
                    >
                      Edit
                    </Link>
                    <form action={deleteSectionAction}>
                      <input type="hidden" name="id" value={section.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-8 items-center justify-center rounded-[8px] border border-[var(--danger)]/25 bg-white px-3 text-[12px] font-medium text-[var(--danger)]"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredSections.length ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-5 py-12 text-center text-[14px] text-[var(--text-secondary)]"
                >
                  No sections found for the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between text-[14px] text-[var(--text-secondary)]">
        <div>
          Showing 1-{Math.min(filteredSections.length, 10)} of{" "}
          {filteredSections.length}
        </div>
        <div className="flex items-center gap-1">
          <button className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-secondary)]">
            &lt;
          </button>
          <button className="h-8 w-8 rounded-[8px] bg-[var(--color-primary)] text-white">
            1
          </button>
          <button className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-primary)]">
            2
          </button>
          <button className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-primary)]">
            3
          </button>
          <span className="px-1 text-[var(--text-tertiary)]">...</span>
          <button className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-primary)]">
            13
          </button>
          <button className="h-8 w-8 rounded-[8px] border border-[var(--border-default)] bg-white text-[var(--text-secondary)]">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
