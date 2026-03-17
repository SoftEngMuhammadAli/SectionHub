import { saveSectionAction } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/sectionhub/ui/section-title";
import { getCategories } from "@/lib/sectionhub/categories/service";
import { getTags } from "@/lib/sectionhub/tags/service";
export default async function NewSectionPage({ searchParams }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-[8px] border border-[var(--danger)]/20 bg-[var(--danger-light)] px-4 py-2.5 text-[13px] text-[var(--danger)]">
          {error}
        </div>
      ) : null}
      <SectionTitle
        title="Upload New Section"
        subtitle="Create a persistent section with versioning, pricing, metadata, and preview support."
      />
      <form
        action={saveSectionAction}
        className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr]"
      >
        <div className="space-y-4">
          <Card className="p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Section name</span>
                <input name="name" required className="sectionhub-input" />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Slug</span>
                <input
                  name="slug"
                  className="sectionhub-input font-mono"
                  placeholder="hero-banner-pro"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Category</span>
                <select name="categoryId" className="sectionhub-select">
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Version</span>
                <input
                  name="version"
                  defaultValue="v1.0.0"
                  className="sectionhub-input font-mono"
                />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="text-[12px] font-medium">
                  Short description
                </span>
                <input name="shortDescription" className="sectionhub-input" />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="text-[12px] font-medium">
                  Full description
                </span>
                <textarea
                  name="fullDescription"
                  className="sectionhub-textarea"
                />
              </label>
            </div>
          </Card>
          <Card className="p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Pricing Type</span>
                <select name="pricingType" className="sectionhub-select">
                  <option value="PAID">Paid</option>
                  <option value="FREE">Free</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Price</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue="39"
                  className="sectionhub-input"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Compare At</span>
                <input
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  defaultValue="59"
                  className="sectionhub-input"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Visibility</span>
                <select name="visibility" className="sectionhub-select">
                  <option value="INTERNAL">Internal</option>
                  <option value="MARKETPLACE">Marketplace</option>
                </select>
              </label>
            </div>
          </Card>
          <Card className="p-5">
            <div className="grid gap-4">
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Preview URL</span>
                <input
                  name="previewUrl"
                  className="sectionhub-input"
                  placeholder="/previews/new-section.png"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Tag IDs</span>
                <input
                  name="tagIds"
                  defaultValue={tags
                    .slice(0, 3)
                    .map((tag) => tag.id)
                    .join(",")}
                  className="sectionhub-input font-mono"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">
                  Installation Steps
                </span>
                <textarea
                  name="installationSteps"
                  className="sectionhub-textarea"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">
                  Compatibility Theme
                </span>
                <input
                  name="compatibilityTheme"
                  defaultValue="Dawn, Prestige, Impact"
                  className="sectionhub-input"
                />
              </label>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <div className="space-y-3 text-[13px] text-[var(--text-secondary)]">
              <label className="flex items-center justify-between">
                <span>Featured</span>
                <input type="checkbox" name="featured" />
              </label>
              <label className="flex items-center justify-between">
                <span>OS 2.0 compatible</span>
                <input type="checkbox" name="os20Compatible" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span>App block support</span>
                <input type="checkbox" name="appBlockSupport" defaultChecked />
              </label>
            </div>
          </Card>
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
