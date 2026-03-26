import Link from "next/link";
import { notFound } from "next/navigation";
import { publishSectionAction, saveSectionAction } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { MultiSelectChips } from "@/components/sectionhub/forms/multi-select-chips";
import { getCategories } from "@/lib/sectionhub/categories/service";
import { getSectionFormData } from "@/lib/sectionhub/sections/service";
import { getTags } from "@/lib/sectionhub/tags/service";

export default async function EditSectionPage({ params, searchParams }) {
  const { id } = await params;
  const pageParams = await searchParams;
  const error = typeof pageParams.error === "string" ? pageParams.error : "";
  const saved = pageParams.saved === "1";
  const [section, categories, tags] = await Promise.all([
    getSectionFormData(id),
    getCategories(),
    getTags(),
  ]);

  if (!section) {
    notFound();
  }

  const tagIds = section.tags.map((tag) => tag.tagId).join(",");
  const tagOptions = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    meta: tag.slug,
  }));

  return (
    <div className="space-y-5">
      {saved ? (
        <div className="rounded-[8px] border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 text-[13px] text-[var(--success)]">
          Section updated successfully.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[8px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-4 py-2.5 text-[13px] text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="text-[14px] text-[var(--text-secondary)]">
          Sections / {section.name} / Edit
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[24px] font-semibold text-[var(--text-primary)]">
              {section.name}
            </h1>
            <div className="mt-1 text-[14px] text-[var(--text-secondary)]">
              Created by Admin • Last edited today •{" "}
              <span className="text-[var(--color-primary)]">View in Marketplace ↗</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/sections/new"
              className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[14px] font-medium text-[var(--text-primary)]"
            >
              Duplicate
            </Link>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[var(--danger)]/40 bg-white px-4 text-[14px] font-medium text-[var(--danger)]"
            >
              Unpublish
            </button>
          </div>
        </div>
      </div>

      <form action={saveSectionAction} className="grid gap-4 xl:grid-cols-[1.75fr_0.9fr]">
        <input type="hidden" name="id" value={section.id} />

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
              Section Configuration
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Section Name
                </span>
                <input
                  name="name"
                  defaultValue={section.name}
                  className="sectionhub-input"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Category
                </span>
                <select
                  name="categoryId"
                  defaultValue={section.categoryId ?? ""}
                  className="sectionhub-select"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Slug
                </span>
                <input
                  name="slug"
                  defaultValue={section.slug}
                  className="sectionhub-input font-mono"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Version
                </span>
                <input
                  name="version"
                  defaultValue={section.versions[0]?.version ?? "v1.0.0"}
                  className="sectionhub-input font-mono"
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Short Description
                </span>
                <textarea
                  name="shortDescription"
                  defaultValue={section.shortDescription ?? ""}
                  className="sectionhub-textarea"
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Full Description
                </span>
                <textarea
                  name="fullDescription"
                  defaultValue={section.fullDescription ?? ""}
                  className="sectionhub-textarea"
                />
              </label>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
              Pricing, Visibility & Metadata
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Pricing Type
                </span>
                <select
                  name="pricingType"
                  defaultValue={section.pricingType}
                  className="sectionhub-select"
                >
                  <option value="PAID">Paid</option>
                  <option value="FREE">Free</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Visibility
                </span>
                <select
                  name="visibility"
                  defaultValue={section.visibility}
                  className="sectionhub-select"
                >
                  <option value="MARKETPLACE">Public</option>
                  <option value="INTERNAL">Internal</option>
                  <option value="HIDDEN">Hidden</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Price ($)
                </span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={section.priceCents / 100}
                  className="sectionhub-input"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Compare at ($)
                </span>
                <input
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  defaultValue={(section.compareAtPriceCents ?? 0) / 100}
                  className="sectionhub-input"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Access Type
                </span>
                <select
                  name="accessType"
                  defaultValue={section.accessType}
                  className="sectionhub-select"
                >
                  <option value="SINGLE">Single Purchase</option>
                  <option value="BUNDLE">Bundle</option>
                  <option value="SUBSCRIPTION">Subscription</option>
                  <option value="INTERNAL">Internal</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  License Type
                </span>
                <select
                  name="licenseType"
                  defaultValue={section.licenseType}
                  className="sectionhub-select"
                >
                  <option value="SINGLE_STORE">Single Store</option>
                  <option value="MULTI_STORE">Multi Store</option>
                  <option value="UNLIMITED">Unlimited</option>
                </select>
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Preview URL
                </span>
                <input
                  name="previewUrl"
                  defaultValue={section.previews?.[0]?.url ?? ""}
                  className="sectionhub-input"
                />
              </label>
              <div className="md:col-span-2">
                <MultiSelectChips
                  name="tagIds"
                  label="Tags"
                  placeholder="Search tags by name..."
                  options={tagOptions}
                  initialSelectedIds={tagIds}
                  emptyText="No tags found."
                />
              </div>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Meta Title
                </span>
                <input
                  name="metaTitle"
                  defaultValue={section.metaTitle ?? ""}
                  className="sectionhub-input"
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Meta Description
                </span>
                <textarea
                  name="metaDescription"
                  defaultValue={section.metaDescription ?? ""}
                  className="sectionhub-textarea"
                />
              </label>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="space-y-3 text-[14px] text-[var(--text-secondary)]">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="rounded-full bg-[var(--success-light)] px-2 py-0.5 text-[12px] font-medium text-[var(--success)]">
                  {section.status}
                </span>
              </div>
              <label className="flex items-center justify-between">
                <span>Featured</span>
                <input type="checkbox" name="featured" defaultChecked={section.featured} />
              </label>
              <label className="flex items-center justify-between">
                <span>OS 2.0 Compatible</span>
                <input
                  type="checkbox"
                  name="os20Compatible"
                  defaultChecked={section.compatibility?.os20Compatible}
                />
              </label>
              <label className="flex items-center justify-between">
                <span>App Block Support</span>
                <input
                  type="checkbox"
                  name="appBlockSupport"
                  defaultChecked={section.compatibility?.appBlockSupport}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Status
                </span>
                <select name="status" defaultValue={section.status} className="sectionhub-select">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>
            </div>
            <div className="mt-4 space-y-2">
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[14px] font-medium text-white"
              >
                Save Changes
              </button>
              <button
                type="submit"
                name="status"
                value="DRAFT"
                className="inline-flex h-10 w-full items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[14px] font-medium text-[var(--text-primary)]"
              >
                Save as Draft
              </button>
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-[var(--border-default)] px-4 py-3">
              <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Version History
              </h3>
            </div>
            <div className="max-h-[260px] space-y-0 overflow-y-auto">
              {section.versions.slice(0, 6).map((version, index) => (
                <div
                  key={`${version.version}-${index}`}
                  className="border-t border-[var(--border-default)] px-4 py-3 first:border-t-0"
                >
                  <div className="font-mono text-[14px] font-medium text-[var(--text-primary)]">
                    {version.version}
                  </div>
                  <div className="mt-1 text-[13px] text-[var(--text-secondary)]">
                    {version.changelog || "Version update."}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Marketplace Stats
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-[8px] bg-[var(--background-page)] p-3">
                <div className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  Installs
                </div>
                <div className="mt-1 font-mono text-[24px] font-semibold text-[var(--text-primary)]">
                  {section._count.installEvents}
                </div>
              </div>
              <div className="rounded-[8px] bg-[var(--background-page)] p-3">
                <div className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  Bundles
                </div>
                <div className="mt-1 font-mono text-[24px] font-semibold text-[var(--text-primary)]">
                  {section._count.bundleSections}
                </div>
              </div>
            </div>
          </Card>

          <input
            type="hidden"
            name="subcategory"
            defaultValue={section.subcategory ?? ""}
          />
          <input
            type="hidden"
            name="internalKeywords"
            defaultValue={section.internalKeywords ?? ""}
          />
          <input
            type="hidden"
            name="marketplaceSubtitle"
            defaultValue={section.marketplaceSubtitle ?? ""}
          />
          <input
            type="hidden"
            name="calloutBadgeText"
            defaultValue={section.calloutBadgeText ?? ""}
          />
          <input
            type="hidden"
            name="installationSteps"
            defaultValue={section.documentation?.installationSteps ?? ""}
          />
          <input
            type="hidden"
            name="usageNotes"
            defaultValue={section.documentation?.usageNotes ?? ""}
          />
          <input
            type="hidden"
            name="merchantInstructions"
            defaultValue={section.documentation?.merchantInstructions ?? ""}
          />
          <input
            type="hidden"
            name="supportNotes"
            defaultValue={section.documentation?.supportNotes ?? ""}
          />
          <input
            type="hidden"
            name="changelog"
            defaultValue={section.documentation?.changelog ?? ""}
          />
          <input
            type="hidden"
            name="compatibilityTheme"
            defaultValue={section.compatibility?.themeCompatibility ?? ""}
          />
          <input
            type="hidden"
            name="dependencies"
            defaultValue={section.compatibility?.dependencies ?? ""}
          />
          <input
            type="hidden"
            name="testedEnvironments"
            defaultValue={section.compatibility?.testedEnvironments ?? ""}
          />
        </div>
      </form>

      <form action={publishSectionAction}>
        <input type="hidden" name="id" value={section.id} />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[14px] font-medium text-[var(--text-primary)]"
        >
          Publish to Marketplace
        </button>
      </form>
    </div>
  );
}
