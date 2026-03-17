import Link from "next/link";
import { saveBundleAction, setBundleStatusAction } from "@/app/actions";
import { Card, SectionTitle } from "@/components/sectionhub/ui";
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

  const [bundles, sections] = await Promise.all([getBundles(), getSections()]);
  const filteredBundles = bundles.filter(
    (bundle) => !statusFilter || bundle.status === statusFilter,
  );
  const draftCount = bundles.filter((bundle) => bundle.status === "DRAFT").length;
  const publishedCount = bundles.filter((bundle) => bundle.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Bundles"
        subtitle="Manage draft and published bundles with persistent catalog data."
      />

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <select name="status" defaultValue={statusFilter} className="sectionhub-select">
            <option value="">All bundle states</option>
            <option value="ACTIVE">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white"
          >
            Apply
          </button>
          <Link
            href="/bundles"
            className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white px-4 text-[13px] font-medium text-[var(--text-primary)]"
          >
            Reset
          </Link>
          <div className="flex items-center justify-end gap-3 text-[12px] text-[var(--text-secondary)]">
            <span>Published: {publishedCount}</span>
            <span>Draft: {draftCount}</span>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_360px]">
        <div className="space-y-4">
          {filteredBundles.map((bundle) => (
            <Card key={bundle.id} className="p-5">
              <div className="text-[15px] font-semibold">{bundle.name}</div>
              <div className="mt-1 font-mono text-[11px] text-[var(--text-tertiary)]">
                {bundle.slug}
              </div>
              <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
                {bundle.shortDescription || "No description"}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {bundle.sections.map((section) => (
                  <span
                    key={section}
                    className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-[11px] text-[var(--primary-light-text)]"
                  >
                    {section}
                  </span>
                ))}
                {!bundle.sections.length ? (
                  <span className="text-[12px] text-[var(--text-tertiary)]">
                    No sections linked
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 text-[13px]">
                <span className="font-mono">{bundle.price}</span>
                <span>{getBundleStatusLabel(bundle.status)}</span>
              </div>
              <div className="mt-4">
                <form action={setBundleStatusAction}>
                  <input type="hidden" name="id" value={bundle.id} />
                  <input
                    type="hidden"
                    name="status"
                    value={bundle.status === "ACTIVE" ? "DRAFT" : "ACTIVE"}
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white px-4 text-[13px] font-medium text-[var(--text-primary)]"
                  >
                    {bundle.status === "ACTIVE" ? "Move to Draft" : "Publish Bundle"}
                  </button>
                </form>
              </div>
            </Card>
          ))}
          {!filteredBundles.length ? (
            <Card className="p-6 text-[13px] text-[var(--text-secondary)]">
              No bundles match the selected status.
            </Card>
          ) : null}
        </div>
        <form action={saveBundleAction}>
          <Card className="p-5">
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Name</span>
                <input name="name" className="sectionhub-input" />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Slug</span>
                <input name="slug" className="sectionhub-input font-mono" />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Status</span>
                <select name="status" defaultValue="DRAFT" className="sectionhub-select">
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Published</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Price</span>
                <input name="price" type="number" step="0.01" className="sectionhub-input" />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Compare At</span>
                <input
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  className="sectionhub-input"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">
                  Section IDs (comma separated)
                </span>
                <input
                  name="sectionIds"
                  defaultValue={sections
                    .slice(0, 3)
                    .map((item) => item.id)
                    .join(",")}
                  className="sectionhub-input font-mono"
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white"
              >
                Save Bundle
              </button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
