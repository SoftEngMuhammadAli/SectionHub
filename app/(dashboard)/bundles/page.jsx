import Link from "next/link";
import { saveBundleAction, setBundleStatusAction } from "@/app/actions";
import { Card } from "@/components/sectionhub/ui";
import { MultiSelectChips } from "@/components/sectionhub/forms/multi-select-chips";
import { getBundles } from "@/lib/sectionhub/bundles/service";
import { getSections } from "@/lib/sectionhub/sections/service";

function asValue(value) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function getBundleStatusLabel(status) {
  if (status === "ACTIVE") return "Published";
  if (status === "ARCHIVED") return "Archived";
  return "Draft";
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
    meta: `${section.slug} • ${section.category}`,
  }));
  const filteredBundles = bundles.filter(
    (bundle) => !statusFilter || bundle.status === statusFilter,
  );
  const draftCount = bundles.filter((bundle) => bundle.status === "DRAFT").length;
  const publishedCount = bundles.filter((bundle) => bundle.status === "ACTIVE").length;

  return (
    <div className="space-y-5">
      {saved ? (
        <div className="rounded-[8px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[13px] text-[var(--success)]">
          Bundle saved successfully.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[8px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-4 py-2.5 text-[13px] text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">Bundles</h1>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            Design, curate and manage your premium section packages.
          </p>
        </div>
        <Link
          href="#new-bundle"
          className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[14px] font-medium text-white"
        >
          + New Bundle
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-[var(--border-default)] bg-white p-1">
        <Link
          href="/bundles"
          className={`rounded-[8px] px-4 py-2 text-[14px] font-medium ${
            !statusFilter
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--text-secondary)]"
          }`}
        >
          All Bundles
        </Link>
        <Link
          href="/bundles?status=ACTIVE"
          className={`rounded-[8px] px-4 py-2 text-[14px] font-medium ${
            statusFilter === "ACTIVE"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--text-secondary)]"
          }`}
        >
          Active ({publishedCount})
        </Link>
        <Link
          href="/bundles?status=DRAFT"
          className={`rounded-[8px] px-4 py-2 text-[14px] font-medium ${
            statusFilter === "DRAFT"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--text-secondary)]"
          }`}
        >
          Drafts ({draftCount})
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="min-w-full text-left">
          <thead className="border-b border-[var(--border-default)] bg-[var(--background-page)]">
            <tr className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              <th className="px-5 py-3">Bundle Name</th>
              <th className="px-5 py-3">Included Sections</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Savings</th>
              <th className="px-5 py-3">Installs</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBundles.map((bundle) => (
              <tr
                key={bundle.id}
                className="border-b border-[var(--border-default)] text-[14px] last:border-b-0"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-[8px] bg-[var(--surface-soft)]" />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-[var(--text-primary)]">
                        {bundle.name}
                      </div>
                      <div className="truncate text-[13px] text-[var(--text-secondary)]">
                        {bundle.shortDescription || bundle.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    {bundle.sections.slice(0, 3).map((section, index) => (
                      <span
                        key={section}
                        className="inline-flex h-7 min-w-7 items-center justify-center rounded-[6px] border border-[var(--border-default)] bg-[var(--surface-soft)] px-1.5 text-[11px] text-[var(--text-secondary)]"
                        title={section}
                      >
                        {index + 1}
                      </span>
                    ))}
                    <span className="ml-1 text-[12px] text-[var(--text-secondary)]">
                      +{bundle.sections.length}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-[13px] text-[var(--text-primary)]">
                  {bundle.price}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[var(--success-light)] px-2.5 py-1 text-[12px] font-medium text-[var(--success)]">
                    {bundle.savings}% OFF
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-[13px] text-[var(--text-secondary)]">
                  {new Intl.NumberFormat("en-US").format(bundle.installs)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium ${
                      bundle.status === "ACTIVE"
                        ? "bg-[var(--primary-light)] text-[var(--primary-light-text)]"
                        : "bg-[var(--surface-soft)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {getBundleStatusLabel(bundle.status)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <form action={setBundleStatusAction} className="inline-flex">
                    <input type="hidden" name="id" value={bundle.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={bundle.status === "ACTIVE" ? "DRAFT" : "ACTIVE"}
                    />
                    <button
                      type="submit"
                      className="inline-flex h-8 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-3 text-[12px] font-medium text-[var(--text-primary)]"
                    >
                      {bundle.status === "ACTIVE" ? "Move Draft" : "Publish"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {!filteredBundles.length ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-[14px] text-[var(--text-secondary)]"
                >
                  No bundles match the selected state.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="border-t border-[var(--border-default)] px-5 py-3 text-[14px] text-[var(--text-secondary)]">
          Showing 1-{Math.min(filteredBundles.length, 10)} of {filteredBundles.length}{" "}
          bundles
        </div>
      </Card>

      <Card id="new-bundle" className="p-5">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Create New Bundle
        </h2>
        <form action={saveBundleAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-[12px] font-medium text-[var(--text-secondary)]">
              Bundle Name
            </span>
            <input name="name" className="sectionhub-input" required />
          </label>
          <label className="space-y-1.5">
            <span className="text-[12px] font-medium text-[var(--text-secondary)]">
              Slug
            </span>
            <input name="slug" className="sectionhub-input font-mono" required />
          </label>
          <label className="space-y-1.5">
            <span className="text-[12px] font-medium text-[var(--text-secondary)]">
              Status
            </span>
            <select name="status" defaultValue="DRAFT" className="sectionhub-select">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Published</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-[12px] font-medium text-[var(--text-secondary)]">
              Price ($)
            </span>
            <input name="price" type="number" step="0.01" className="sectionhub-input" />
          </label>
          <label className="space-y-1.5">
            <span className="text-[12px] font-medium text-[var(--text-secondary)]">
              Compare at ($)
            </span>
            <input
              name="compareAtPrice"
              type="number"
              step="0.01"
              className="sectionhub-input"
            />
          </label>
          <div className="md:col-span-2">
            <MultiSelectChips
              name="sectionIds"
              label="Sections"
              placeholder="Search sections by name..."
              options={sectionOptions}
              emptyText="No sections found."
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[14px] font-medium text-white"
            >
              Save Bundle
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
