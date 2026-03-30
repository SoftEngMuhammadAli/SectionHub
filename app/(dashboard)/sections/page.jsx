import Link from "next/link";
import { deleteSectionAction } from "@/app/actions";
import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { getCategories } from "@/lib/sectionhub/categories/service";
import { getSections } from "@/lib/sectionhub/sections/service";
import { getTags } from "@/lib/sectionhub/tags/service";

function asValue(value) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parsePrice(value) {
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

function statusMeta(status) {
  if (status === "PUBLISHED") {
    return {
      label: "Active",
      className: "bg-[var(--success-light)] text-[var(--success)]",
    };
  }

  if (status === "ARCHIVED") {
    return {
      label: "Archived",
      className: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
    };
  }

  return {
    label: "Draft",
    className: "bg-[var(--warning-light)] text-[var(--warning)]",
  };
}

function gradientForIndex(index) {
  return [
    "linear-gradient(135deg,#c6baf8,#b9a5ff)",
    "linear-gradient(135deg,#c4d3f7,#aec2ff)",
    "linear-gradient(135deg,#bde8e0,#9ad5cb)",
    "linear-gradient(135deg,#d3d8df,#b7bec7)",
    "linear-gradient(135deg,#f2c7de,#e7afcc)",
    "linear-gradient(135deg,#b8d8f2,#9ec8eb)",
  ][index % 6];
}

function StatusBadge({ status }) {
  const meta = statusMeta(status);

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.className}`}
    >
      {meta.label}
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
    <div className="space-y-5">
      {created ? (
        <div className="rounded-[10px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[12px] font-medium text-[var(--success)]">
          Section created successfully.
        </div>
      ) : null}
      {deleted ? (
        <div className="rounded-[10px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[12px] font-medium text-[var(--success)]">
          Section deleted successfully.
        </div>
      ) : null}
      {published ? (
        <div className="rounded-[10px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[12px] font-medium text-[var(--success)]">
          Section published successfully.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[10px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-4 py-2.5 text-[12px] font-medium text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle
          title="Sections List"
          subtitle="Search sections by name, slug, category and publishing status."
        />
        <Link
          href="/sections/new"
          className="inline-flex min-h-9 items-center justify-center rounded-[10px] bg-[var(--primary)] px-3.5 text-[12px] font-semibold text-white"
        >
          + Upload Section
        </Link>
      </div>

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_repeat(5,minmax(0,0.82fr))_auto_auto]">
          <input
            name="search"
            defaultValue={query}
            placeholder="Search sections by name, slug or category..."
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
            <option value="updated">Recently Updated</option>
            <option value="name">Sort by Name</option>
          </select>
          <button
            type="submit"
            className="inline-flex min-h-9 items-center justify-center rounded-[10px] bg-[var(--primary)] px-4 text-[12px] font-semibold text-white"
          >
            Filter
          </button>
          <Link
            href="/sections"
            className="inline-flex min-h-9 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
          >
            Reset
          </Link>
        </form>
      </Card>

      <div className="sectionhub-mobile-list xl:hidden">
        {filteredSections.map((section, index) => (
          <Card key={section.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className="mt-0.5 h-10 w-14 shrink-0 rounded-[10px] border border-[var(--border-default)]"
                  style={{ background: gradientForIndex(index) }}
                />
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                    {section.name}
                  </div>
                  <div className="truncate font-mono-ui text-[11px] text-[var(--text-tertiary)]">
                    {section.slug}
                  </div>
                </div>
              </div>
              <StatusBadge status={section.status} />
            </div>

            <div className="sectionhub-data-card mt-4">
              <div className="sectionhub-data-card-row">
                <span>Category</span>
                <strong className="text-right">{section.category}</strong>
              </div>
              <div className="sectionhub-data-card-row">
                <span>Price</span>
                <strong>{section.price}</strong>
              </div>
              <div className="sectionhub-data-card-row">
                <span>Version</span>
                <strong className="font-mono-ui">{section.version}</strong>
              </div>
              <div className="sectionhub-data-card-row">
                <span>Installs</span>
                <strong className="font-mono-ui">{section.installs}</strong>
              </div>
              <div className="sectionhub-data-card-row">
                <span>Updated</span>
                <strong className="text-right">{section.updatedAt}</strong>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {(section.tags ?? []).slice(0, 3).map((item) => (
                <span
                  key={`${section.id}-${item}`}
                  className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]"
                >
                  {item}
                </span>
              ))}
              {(section.tags ?? []).length > 3 ? (
                <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
                  +{section.tags.length - 3}
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Link
                href={`/sections/${section.id}/edit`}
                className="inline-flex min-h-8 flex-1 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-3 text-[12px] font-semibold text-[var(--text-primary)]"
              >
                Edit
              </Link>
              <ConfirmActionDialog
                title="Delete this section?"
                description={`"${section.name}" will be permanently removed from the catalog, bundle references, installs, and metrics. This action cannot be undone.`}
                confirmLabel="Delete Section"
                triggerLabel="Delete"
                action={deleteSectionAction}
                fields={{ id: section.id }}
                triggerClassName="inline-flex min-h-8 w-full flex-1 items-center justify-center rounded-[10px] border border-[var(--danger)]/25 bg-white px-3 text-[12px] font-semibold text-[var(--danger)]"
              />
            </div>
          </Card>
        ))}

        {!filteredSections.length ? (
          <Card className="p-6 text-[13px] text-[var(--text-secondary)]">
            No sections found for the current filters.
          </Card>
        ) : null}
      </div>

      <Card className="hidden overflow-hidden p-0 xl:block">
        <div className="sectionhub-table-scroll">
          <table className="min-w-full table-fixed text-left">
            <thead className="border-b border-[var(--border-default)] bg-[var(--background-page)] text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              <tr>
                <th className="w-[44px] px-3 py-3">
                  <input
                    type="checkbox"
                    className="sectionhub-checkbox"
                    aria-label="Select all sections"
                  />
                </th>
                <th className="w-[92px] px-3 py-3">Thumb</th>
                <th className="w-[200px] px-3 py-3">Section</th>
                <th className="w-[160px] px-3 py-3">Category</th>
                <th className="w-[190px] px-3 py-3">Tags</th>
                <th className="w-[92px] px-3 py-3">Price</th>
                <th className="w-[96px] px-3 py-3 2xl:table-cell hidden">
                  Version
                </th>
                <th className="w-[84px] px-3 py-3">Installs</th>
                <th className="w-[110px] px-3 py-3">Updated</th>
                <th className="w-[92px] px-3 py-3">Status</th>
                <th className="w-[132px] px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((section, index) => (
                <tr
                  key={section.id}
                  className="border-b border-[var(--border-default)] text-[12px] last:border-b-0 hover:bg-[var(--surface-soft)]/40"
                >
                  <td className="px-3 py-3.5 align-top">
                    <input
                      type="checkbox"
                      className="sectionhub-checkbox"
                      aria-label={`Select ${section.name}`}
                    />
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <div
                      className="h-8 w-12 rounded-[8px] border border-[var(--border-default)]"
                      style={{ background: gradientForIndex(index) }}
                    />
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <div className="truncate font-semibold text-[13px] text-[var(--text-primary)]">
                      {section.name}
                    </div>
                    <div className="truncate font-mono-ui text-[11px] text-[var(--text-tertiary)]">
                      {section.slug}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 align-top text-[var(--text-secondary)]">
                    <div className="line-clamp-2">{section.category}</div>
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {(section.tags ?? []).slice(0, 2).map((item) => (
                        <span
                          key={`${section.id}-${item}`}
                          className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]"
                        >
                          {item}
                        </span>
                      ))}
                      {(section.tags ?? []).length > 2 ? (
                        <span className="rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
                          +{section.tags.length - 2}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 align-top font-mono-ui text-[12px] text-[var(--text-primary)]">
                    {section.price}
                  </td>
                  <td className="hidden px-3 py-3.5 align-top font-mono-ui text-[12px] text-[var(--text-secondary)] 2xl:table-cell">
                    {section.version}
                  </td>
                  <td className="px-3 py-3.5 align-top font-mono-ui text-[12px] text-[var(--text-secondary)]">
                    {section.installs}
                  </td>
                  <td className="px-3 py-3.5 align-top text-[12px] text-[var(--text-secondary)]">
                    {section.updatedAt}
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <StatusBadge status={section.status} />
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/sections/${section.id}/edit`}
                        className="inline-flex min-h-8 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-2.5 text-[11px] font-semibold text-[var(--text-primary)]"
                      >
                        Edit
                      </Link>
                      <ConfirmActionDialog
                        title="Delete this section?"
                        description={`"${section.name}" will be permanently removed from the catalog, bundle references, installs, and metrics. This action cannot be undone.`}
                        confirmLabel="Delete Section"
                        triggerLabel="Delete"
                        action={deleteSectionAction}
                        fields={{ id: section.id }}
                        triggerClassName="inline-flex min-h-8 items-center justify-center rounded-[10px] border border-[var(--danger)]/25 bg-white px-2.5 text-[11px] font-semibold text-[var(--danger)]"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredSections.length ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-5 py-12 text-center text-[13px] text-[var(--text-secondary)]"
                  >
                    No sections found for the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-col gap-3 text-[12px] text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
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
