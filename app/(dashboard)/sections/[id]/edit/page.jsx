import Link from "next/link";
import { notFound } from "next/navigation";
import { publishSectionAction, saveSectionAction } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { getCategories } from "@/lib/sectionhub/categories/service";
import { getSectionFormData } from "@/lib/sectionhub/sections/service";

function ToggleRow({ name, label, defaultChecked = false }) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-[13px] font-medium text-[var(--text-primary)]">
        {label}
      </span>
      <span className="sectionhub-switch">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} />
        <span className="sectionhub-switch-track">
          <span className="sectionhub-switch-thumb" />
        </span>
      </span>
    </label>
  );
}

function formatStatus(status) {
  if (status === "PUBLISHED") {
    return "bg-[var(--success-light)] text-[var(--success)]";
  }

  if (status === "DRAFT") {
    return "bg-[var(--warning-light)] text-[var(--warning)]";
  }

  return "bg-[var(--surface-soft)] text-[var(--text-secondary)]";
}

export default async function EditSectionPage({ params, searchParams }) {
  const { id } = await params;
  const pageParams = await searchParams;
  const error = typeof pageParams.error === "string" ? pageParams.error : "";
  const saved = pageParams.saved === "1";
  const [section, categories] = await Promise.all([
    getSectionFormData(id),
    getCategories(),
  ]);

  if (!section) {
    notFound();
  }

  const tagIds = section.tags.map((tag) => tag.tagId).join(",");

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
        <div className="text-[12px] text-[var(--text-secondary)]">
          Sections / {section.name} / Edit
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {section.name}
              </h1>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${formatStatus(section.status)}`}
              >
                {section.status === "PUBLISHED" ? "Published" : section.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-[var(--text-secondary)]">
              <span>Created by Admin</span>
              <span>2 days ago</span>
              <span>Last edited 1 hour ago</span>
              <span className="font-medium text-[var(--color-primary)]">
                View in Marketplace
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
            >
              Preview
            </button>
            <Link
              href="/sections/new"
              className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
            >
              Duplicate
            </Link>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[var(--danger)]/30 bg-white px-4 text-[12px] font-semibold text-[var(--danger)]"
            >
              Unpublish
            </button>
            <button
              type="submit"
              form="edit-section-form"
              className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <form
        id="edit-section-form"
        action={saveSectionAction}
        className="grid gap-4 xl:grid-cols-[1.7fr_0.86fr]"
      >
        <input type="hidden" name="id" value={section.id} />

        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[var(--color-primary)]">✦</span>
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
                Section Configuration
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="sectionhub-field">
                <span className="sectionhub-field-label">Section Name</span>
                <input
                  name="name"
                  defaultValue={section.name}
                  className="sectionhub-input"
                />
              </label>

              <label className="sectionhub-field">
                <span className="sectionhub-field-label">Category</span>
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

              <div className="md:col-span-2">
                <label className="sectionhub-field">
                  <span className="sectionhub-field-label">Short Description</span>
                  <textarea
                    name="shortDescription"
                    defaultValue={section.shortDescription ?? ""}
                    className="sectionhub-textarea"
                  />
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
                Component Assets
              </h2>
              <button
                type="button"
                className="text-[12px] font-semibold text-[var(--color-primary)]"
              >
                Update All
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[10px] border border-[var(--border-default)] p-3">
                <div className="h-[120px] rounded-[8px] bg-[linear-gradient(180deg,#dbe8ef_0%,#8fc0ff_100%)]" />
                <div className="mt-3 text-center text-[12px] font-medium text-[var(--text-primary)]">
                  Thumbnail.png
                </div>
              </div>

              <div className="rounded-[10px] border border-[var(--border-default)] p-3">
                <div className="flex h-[120px] items-center justify-center rounded-[8px] bg-[var(--color-primary-light)] text-[12px] font-semibold text-[var(--color-primary)]">
                  JS
                </div>
                <div className="mt-3 text-center text-[12px] font-medium text-[var(--text-primary)]">
                  index.js
                </div>
              </div>

              <div className="rounded-[10px] border border-[var(--border-default)] p-3">
                <div className="flex h-[120px] items-center justify-center rounded-[8px] bg-[#d8e8ff] text-[12px] font-semibold text-[#4d6fd8]">
                  CSS
                </div>
                <div className="mt-3 text-center text-[12px] font-medium text-[var(--text-primary)]">
                  styles.css
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[10px] border border-dashed border-[var(--border-strong)] bg-[var(--background-page)] px-4 py-5 text-center text-[12px] text-[var(--text-secondary)]">
              Drop files to add or replace
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-[var(--border-default)] px-4 py-3">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                Version History
              </h3>
            </div>
            <div className="divide-y divide-[var(--border-default)]">
              {section.versions.slice(0, 3).map((version, index) => (
                <div key={`${version.version}-${index}`} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[16px] font-semibold text-[var(--text-primary)]">
                      {version.version}
                    </div>
                    <span className="text-[11px] text-[var(--text-tertiary)]">
                      {index === 0 ? "1h ago" : index === 1 ? "Yesterday" : "2 days ago"}
                    </span>
                  </div>
                  <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
                    {version.changelog || "Updated spacing and responsive behavior."}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Marketplace Stats
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[8px] bg-[var(--background-page)] p-4">
                <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  Installs
                </div>
                <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  {section._count.installEvents}
                </div>
              </div>
              <div className="rounded-[8px] bg-[var(--background-page)] p-4">
                <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  Rating
                </div>
                <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  4.8
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Permissions
            </h3>
            <div className="mt-4 space-y-4">
              <ToggleRow
                name="visibilityMarketplace"
                label="Public Access"
                defaultChecked={section.visibility === "MARKETPLACE"}
              />
              <ToggleRow name="allowForks" label="Allow Forks" />
            </div>
          </Card>

          <input type="hidden" name="slug" defaultValue={section.slug} />
          <input
            type="hidden"
            name="version"
            defaultValue={section.versions[0]?.version ?? "v1.0.0"}
          />
          <input
            type="hidden"
            name="fullDescription"
            defaultValue={section.fullDescription ?? ""}
          />
          <input
            type="hidden"
            name="pricingType"
            defaultValue={section.pricingType}
          />
          <input
            type="hidden"
            name="visibility"
            defaultValue={section.visibility}
          />
          <input
            type="hidden"
            name="price"
            defaultValue={section.priceCents / 100}
          />
          <input
            type="hidden"
            name="compareAtPrice"
            defaultValue={(section.compareAtPriceCents ?? 0) / 100}
          />
          <input
            type="hidden"
            name="accessType"
            defaultValue={section.accessType}
          />
          <input
            type="hidden"
            name="licenseType"
            defaultValue={section.licenseType}
          />
          <input
            type="hidden"
            name="previewUrl"
            defaultValue={section.previews?.[0]?.url ?? ""}
          />
          <input type="hidden" name="tagIds" defaultValue={tagIds} />
          <input
            type="hidden"
            name="metaTitle"
            defaultValue={section.metaTitle ?? ""}
          />
          <input
            type="hidden"
            name="metaDescription"
            defaultValue={section.metaDescription ?? ""}
          />
          <input
            type="hidden"
            name="featured"
            defaultValue={String(section.featured)}
          />
          <input
            type="hidden"
            name="os20Compatible"
            defaultValue={String(section.compatibility?.os20Compatible ?? false)}
          />
          <input
            type="hidden"
            name="appBlockSupport"
            defaultValue={String(section.compatibility?.appBlockSupport ?? false)}
          />
          <input type="hidden" name="status" defaultValue={section.status} />
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
          className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
        >
          Publish to Marketplace
        </button>
      </form>
    </div>
  );
}
