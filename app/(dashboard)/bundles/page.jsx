import Link from "next/link";
import { saveBundleAction, setBundleStatusAction } from "@/app/actions";
import { Card } from "@/components/sectionhub/ui";
import { MultiSelectChips } from "@/components/sectionhub/forms/multi-select-chips";
import { getBundles } from "@/lib/sectionhub/bundles/service";
import { getSections } from "@/lib/sectionhub/sections/service";

function asValue(value) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function getBundleStatusMeta(status) {
  if (status === "ACTIVE") {
    return {
      label: "Active",
      className: "bg-[var(--primary-light)] text-[var(--primary-light-text)]",
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

export default async function BundlesPage({ searchParams }) {
  const params = await searchParams;
  const statusFilter = asValue(params.status);
  const saved = asValue(params.saved) === "1";
  const error = asValue(params.error);

  const [bundles, sections] = await Promise.all([getBundles(), getSections()]);
  const sectionOptions = sections.map((section) => ({
    id: section.id,
    name: section.name,
    meta: `${section.slug} - ${section.category}`,
  }));
  const filteredBundles = bundles.filter(
    (bundle) => !statusFilter || bundle.status === statusFilter,
  );
  const draftCount = bundles.filter((bundle) => bundle.status === "DRAFT").length;
  const publishedCount = bundles.filter((bundle) => bundle.status === "ACTIVE").length;

  return (
    <div className="space-y-5">
      {saved ? (
        <div className="rounded-[10px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[12px] font-medium text-[var(--success)]">
          Bundle saved successfully.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[10px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-4 py-2.5 text-[12px] font-medium text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 text-[12px] text-[var(--text-secondary)]">
            Admin / Bundles Management
          </div>
          <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">Bundles</h1>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            Design, curate and manage your premium section packages.
          </p>
        </div>
        <Link
          href="#new-bundle"
          className="inline-flex min-h-9 items-center justify-center rounded-[10px] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-white"
        >
          + New Bundle
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[var(--border-default)] bg-white/82 p-1.5">
        <Link
          href="/bundles"
          className={`rounded-[10px] px-3.5 py-2 text-[12px] font-semibold ${
            !statusFilter
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--text-secondary)]"
          }`}
        >
          All Bundles
        </Link>
        <Link
          href="/bundles?status=ACTIVE"
          className={`rounded-[10px] px-3.5 py-2 text-[12px] font-semibold ${
            statusFilter === "ACTIVE"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--text-secondary)]"
          }`}
        >
          Active ({publishedCount})
        </Link>
        <Link
          href="/bundles?status=DRAFT"
          className={`rounded-[10px] px-3.5 py-2 text-[12px] font-semibold ${
            statusFilter === "DRAFT"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--text-secondary)]"
          }`}
        >
          Drafts ({draftCount})
        </Link>
      </div>

      <div className="sectionhub-mobile-list lg:hidden">
        {filteredBundles.map((bundle) => {
          const statusMeta = getBundleStatusMeta(bundle.status);
          return (
            <Card key={bundle.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-[10px] bg-[var(--surface-soft)]" />
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                      {bundle.name}
                    </div>
                    <div className="truncate text-[12px] text-[var(--text-secondary)]">
                      {bundle.shortDescription || bundle.slug}
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusMeta.className}`}
                >
                  {statusMeta.label}
                </span>
              </div>

              <div className="sectionhub-data-card mt-4">
                <div className="sectionhub-data-card-row">
                  <span>Price</span>
                  <strong className="font-mono">{bundle.price}</strong>
                </div>
                <div className="sectionhub-data-card-row">
                  <span>Savings</span>
                  <strong>{bundle.savings}% OFF</strong>
                </div>
                <div className="sectionhub-data-card-row">
                  <span>Installs</span>
                  <strong>{new Intl.NumberFormat("en-US").format(bundle.installs)}</strong>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {bundle.sections.slice(0, 4).map((section, index) => (
                  <span
                    key={section}
                    className="inline-flex h-7 min-w-7 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-[var(--surface-soft)] px-2 text-[10px] font-semibold text-[var(--text-secondary)]"
                    title={section}
                  >
                    {index + 1}
                  </span>
                ))}
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                  {bundle.sections.length} sections
                </span>
              </div>

              <form action={setBundleStatusAction} className="mt-4">
                <input type="hidden" name="id" value={bundle.id} />
                <input
                  type="hidden"
                  name="status"
                  value={bundle.status === "ACTIVE" ? "DRAFT" : "ACTIVE"}
                />
                <button
                  type="submit"
                  className="inline-flex min-h-8 w-full items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-3 text-[12px] font-semibold text-[var(--text-primary)]"
                >
                  {bundle.status === "ACTIVE" ? "Move to Draft" : "Publish"}
                </button>
              </form>
            </Card>
          );
        })}

        {!filteredBundles.length ? (
          <Card className="p-6 text-[13px] text-[var(--text-secondary)]">
            No bundles match the selected state.
          </Card>
        ) : null}
      </div>

      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="sectionhub-table-scroll">
          <table className="min-w-full table-fixed text-left">
            <thead className="border-b border-[var(--border-default)] bg-[var(--background-page)]">
              <tr className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <th className="w-[34%] px-4 py-3">Bundle Name</th>
                <th className="w-[16%] px-4 py-3">Included</th>
                <th className="w-[12%] px-4 py-3">Price</th>
                <th className="w-[12%] px-4 py-3">Savings</th>
                <th className="w-[10%] px-4 py-3">Installs</th>
                <th className="w-[10%] px-4 py-3">Status</th>
                <th className="w-[16%] px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBundles.map((bundle) => {
                const statusMeta = getBundleStatusMeta(bundle.status);
                return (
                  <tr
                    key={bundle.id}
                    className="border-b border-[var(--border-default)] text-[12px] last:border-b-0 hover:bg-[var(--surface-soft)]/35"
                  >
                    <td className="px-4 py-3.5 align-top">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-[10px] bg-[var(--surface-soft)]" />
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-semibold text-[var(--text-primary)]">
                            {bundle.name}
                          </div>
                          <div className="truncate text-[12px] text-[var(--text-secondary)]">
                            {bundle.shortDescription || bundle.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {bundle.sections.slice(0, 3).map((section, index) => (
                          <span
                            key={section}
                            className="inline-flex h-7 min-w-7 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-[var(--surface-soft)] px-2 text-[10px] font-semibold text-[var(--text-secondary)]"
                            title={section}
                          >
                            {index + 1}
                          </span>
                        ))}
                        <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                          +{bundle.sections.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top font-mono text-[12px] text-[var(--text-primary)]">
                      {bundle.price}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <span className="inline-flex rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--success)]">
                        {bundle.savings}% OFF
                      </span>
                    </td>
                    <td className="px-4 py-3.5 align-top font-mono text-[12px] text-[var(--text-secondary)]">
                      {new Intl.NumberFormat("en-US").format(bundle.installs)}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right align-top">
                      <form action={setBundleStatusAction} className="inline-flex">
                        <input type="hidden" name="id" value={bundle.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={bundle.status === "ACTIVE" ? "DRAFT" : "ACTIVE"}
                        />
                        <button
                          type="submit"
                          className="inline-flex min-h-8 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-3 text-[11px] font-semibold text-[var(--text-primary)]"
                        >
                          {bundle.status === "ACTIVE" ? "Move Draft" : "Publish"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {!filteredBundles.length ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-[13px] text-[var(--text-secondary)]"
                  >
                    No bundles match the selected state.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[var(--border-default)] px-4 py-3 text-[12px] text-[var(--text-secondary)]">
          Showing 1-{Math.min(filteredBundles.length, 10)} of {filteredBundles.length} bundles
        </div>
      </Card>

      <Card id="new-bundle" className="p-4 sm:p-5">
        <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
          Create New Bundle
        </h2>
        <form action={saveBundleAction} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_170px_minmax(0,1fr)] xl:items-start">
          <label className="sectionhub-field">
            <span className="sectionhub-field-label">Bundle Name</span>
            <input name="name" className="sectionhub-input" required />
          </label>
          <label className="sectionhub-field">
            <span className="sectionhub-field-label">Slug</span>
            <input name="slug" className="sectionhub-input font-mono" required />
          </label>
          <label className="sectionhub-field">
            <span className="sectionhub-field-label">Status</span>
            <select name="status" defaultValue="DRAFT" className="sectionhub-select">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Published</option>
            </select>
          </label>
          <label className="sectionhub-field">
            <span className="sectionhub-field-label">Price ($)</span>
            <input name="price" type="number" step="0.01" className="sectionhub-input" />
          </label>
          <label className="sectionhub-field">
            <span className="sectionhub-field-label">Compare at ($)</span>
            <input
              name="compareAtPrice"
              type="number"
              step="0.01"
              className="sectionhub-input"
            />
          </label>
          <div className="md:col-span-2 xl:col-span-4">
            <MultiSelectChips
              name="sectionIds"
              label="Sections"
              placeholder="Search sections by name..."
              options={sectionOptions}
              emptyText="No sections found."
            />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="inline-flex min-h-9 w-full items-center justify-center rounded-[10px] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-white sm:w-auto"
            >
              Save Bundle
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
