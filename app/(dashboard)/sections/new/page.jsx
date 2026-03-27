import { saveSectionAction } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { MultiSelectChips } from "@/components/sectionhub/forms/multi-select-chips";
import { getCategories } from "@/lib/sectionhub/categories/service";
import { getTags } from "@/lib/sectionhub/tags/service";

function ToggleRow({ name, label, defaultChecked = false }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[12px] border border-[var(--border-default)] bg-[var(--background-page)] px-4 py-3">
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

export default async function NewSectionPage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  const tagOptions = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    meta: tag.slug,
  }));

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-[8px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-4 py-2.5 text-[13px] text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      <div className="space-y-1">
        <h1 className="text-[20px] font-semibold text-[var(--text-primary)]">
          Upload New Section
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Add pricing, metadata, compatibility and publishing information.
        </p>
      </div>

      <form action={saveSectionAction} className="grid gap-4 xl:grid-cols-[1.75fr_0.9fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
                Basic Information
              </h2>
              <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                v1.0.0
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Section Name
                </span>
                <input name="name" required className="sectionhub-input" />
              </label>
              <label className="sectionhub-field">
                <span className="sectionhub-field-label">
                  Slug
                </span>
                <div className="sectionhub-input-group">
                  <span className="sectionhub-input-addon sectionhub-input-addon--left font-mono-ui">
                    /s/
                  </span>
                  <input
                    name="slug"
                    className="sectionhub-input rounded-l-none font-mono-ui"
                    placeholder="hero-banner-pro"
                  />
                </div>
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Short Description
                </span>
                <input name="shortDescription" className="sectionhub-input" />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Full Description
                </span>
                <textarea name="fullDescription" className="sectionhub-textarea" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Category
                </span>
                <select name="categoryId" className="sectionhub-select">
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
                  Subcategory
                </span>
                <input name="subcategory" className="sectionhub-input" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Version
                </span>
                <input
                  name="version"
                  defaultValue="v1.0.0"
                  className="sectionhub-input font-mono"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Author
                </span>
                <input defaultValue="Admin" disabled className="sectionhub-input" />
              </label>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
                Pricing & Access
              </h2>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-[var(--text-secondary)]">Pricing Type</span>
                <select name="pricingType" className="sectionhub-select min-w-[110px]">
                  <option value="PAID">Paid</option>
                  <option value="FREE">Free</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Price ($)
                </span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue="29"
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
                  defaultValue="49"
                  className="sectionhub-input"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Access Type
                </span>
                <select name="accessType" className="sectionhub-select">
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
                <select name="licenseType" className="sectionhub-select">
                  <option value="SINGLE_STORE">Single Store</option>
                  <option value="MULTI_STORE">Multi Store</option>
                  <option value="UNLIMITED">Unlimited</option>
                </select>
              </label>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">Liquid File</h2>
            <div className="mt-4 rounded-[8px] border border-dashed border-[var(--border-strong)] bg-[var(--background-page)] p-8 text-center">
              <div className="text-[14px] font-medium text-[var(--text-primary)]">
                Click to upload or drag and drop
              </div>
              <div className="mt-1 text-[12px] text-[var(--text-tertiary)]">
                .liquid files only, max 2MB
              </div>
            </div>
            <div className="mt-3 rounded-[8px] bg-[#0d1735] px-3 py-2 font-mono text-[12px] text-white">
              SHA-256: 8f3a...e9b2
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Media Preview
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Preview URL
                </span>
                <input
                  name="previewUrl"
                  className="sectionhub-input"
                  placeholder="/previews/hero-banner-pro.png"
                />
              </label>
              <div className="md:col-span-2">
                <MultiSelectChips
                  name="tagIds"
                  label="Tags"
                  placeholder="Search tags by name..."
                  options={tagOptions}
                  emptyText="No tags found."
                />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Documentation & Compatibility
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Installation Steps
                </span>
                <textarea name="installationSteps" className="sectionhub-textarea" />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Usage Notes
                </span>
                <textarea name="usageNotes" className="sectionhub-textarea" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Compatibility Theme
                </span>
                <input
                  name="compatibilityTheme"
                  defaultValue="Dawn, Prestige, Impact"
                  className="sectionhub-input"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Tested Environments
                </span>
                <input
                  name="testedEnvironments"
                  defaultValue="Desktop Chrome, Safari, Mobile iOS"
                  className="sectionhub-input"
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Dependencies
                </span>
                <input
                  name="dependencies"
                  placeholder="theme.css, app.js"
                  className="sectionhub-input"
                />
              </label>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">SEO Metadata</h2>
            <div className="mt-4 grid gap-3">
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Meta Title
                </span>
                <input name="metaTitle" className="sectionhub-input" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Meta Description
                </span>
                <textarea name="metaDescription" className="sectionhub-textarea" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Internal Keywords
                </span>
                <input
                  name="internalKeywords"
                  placeholder="hero, conversion, cta"
                  className="sectionhub-input"
                />
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                    Marketplace Subtitle
                  </span>
                  <input name="marketplaceSubtitle" className="sectionhub-input" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                    Callout Badge
                  </span>
                  <input name="calloutBadgeText" className="sectionhub-input" />
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">Publishing</h2>
            <div className="mt-4 space-y-3 text-[14px] text-[var(--text-secondary)]">
              <ToggleRow name="featured" label="Featured Section" />
              <ToggleRow
                name="os20Compatible"
                label="OS 2.0 Compatible"
                defaultChecked
              />
              <ToggleRow
                name="appBlockSupport"
                label="App Block Support"
                defaultChecked
              />
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Status
                </span>
                <select name="status" defaultValue="DRAFT" className="sectionhub-select">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Visibility
                </span>
                <select name="visibility" defaultValue="MARKETPLACE" className="sectionhub-select">
                  <option value="MARKETPLACE">Public</option>
                  <option value="INTERNAL">Internal</option>
                  <option value="HIDDEN">Hidden</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </label>
            </div>
            <div className="mt-4 space-y-2">
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center rounded-[10px] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-white"
              >
                Save Changes
              </button>
              <button
                type="submit"
                name="status"
                value="DRAFT"
                className="inline-flex h-10 w-full items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-white px-4 text-[12px] font-semibold text-[var(--text-primary)]"
              >
                Save as Draft
              </button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Requirements Checklist
            </h3>
            <div className="mt-3 space-y-2 text-[13px] text-[var(--text-secondary)]">
              <div>- Basic information completed</div>
              <div>- Liquid file uploaded and verified</div>
              <div>- Primary preview image added</div>
              <div>- Pricing and access rules defined</div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Version State
            </h3>
            <div className="mt-3 text-[13px] text-[var(--text-secondary)]">
              Pending upload...
            </div>
          </Card>

          <input type="hidden" name="merchantInstructions" value="" />
          <input type="hidden" name="supportNotes" value="" />
          <input type="hidden" name="changelog" value="Initial release." />
        </div>
      </form>
    </div>
  );
}

