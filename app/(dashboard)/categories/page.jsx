import {
  Boxes,
  Folder,
  Grid2x2,
  LayoutGrid,
  Triangle,
  X,
} from "lucide-react";
import { saveCategoryAction } from "@/app/actions";
import { Card } from "@/components/sectionhub/ui";
import { getCategories } from "@/lib/sectionhub/categories/service";

function Toggle({ name, label, description, defaultChecked = false }) {
  return (
    <label className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[13px] font-semibold text-[var(--text-primary)]">
          {label}
        </div>
        <div className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
          {description}
        </div>
      </div>
      <span className="sectionhub-switch">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} />
        <span className="sectionhub-switch-track">
          <span className="sectionhub-switch-thumb" />
        </span>
      </span>
    </label>
  );
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  const featured = categories[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            Categories Management
          </h1>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            Organize the section library into smarter storefront browsing groups.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category, index) => (
            <Card key={category.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  {index % 2 === 0 ? (
                    <LayoutGrid className="h-4 w-4" />
                  ) : (
                    <Folder className="h-4 w-4" />
                  )}
                </div>
                <button
                  type="button"
                  className="rounded-[8px] border border-[var(--border-default)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]"
                >
                  Edit
                </button>
              </div>

              <div className="mt-5">
                <div className="text-[16px] font-semibold text-[var(--text-primary)]">
                  {category.name}
                </div>
                <div className="mt-1 text-[12px] text-[var(--text-secondary)]">
                  {category.description || "Smart category grouping for catalog navigation."}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-[12px]">
                <div>
                  <div className="text-[var(--text-tertiary)]">Sections</div>
                  <div className="mt-1 font-semibold text-[var(--text-primary)]">
                    {category.sectionCount}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--text-tertiary)]">Sort Order</div>
                  <div className="mt-1 font-semibold text-[var(--text-primary)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <form action={saveCategoryAction} className="xl:sticky xl:top-[88px]">
          <Card className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                  Edit Category
                </h2>
                <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
                  Modify properties for storefront navigation groups.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-soft)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="sectionhub-field">
              <span className="sectionhub-field-label">Name</span>
              <input
                name="name"
                defaultValue={featured?.name ?? "Navigation Bars"}
                className="sectionhub-input"
              />
            </label>

            <label className="sectionhub-field">
              <span className="sectionhub-field-label">Slug</span>
              <input
                name="slug"
                defaultValue={featured?.slug ?? "nav-bars"}
                className="sectionhub-input font-mono-ui"
              />
            </label>

            <label className="sectionhub-field">
              <span className="sectionhub-field-label">Description</span>
              <textarea
                name="description"
                defaultValue={
                  featured?.description ??
                  "Standard and sticky navigation components including mega-menus and mobile layouts."
                }
                className="sectionhub-textarea"
              />
            </label>

            <div className="sectionhub-field">
              <span className="sectionhub-field-label">Icon Selection</span>
              <div className="flex gap-2">
                {[
                  { icon: Boxes, active: true },
                  { icon: Triangle, active: false },
                  { icon: Grid2x2, active: false },
                  { icon: LayoutGrid, active: false },
                ].map((item, index) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-[8px] border ${
                        item.active
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-[var(--border-default)] bg-white text-[var(--text-tertiary)]"
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="sectionhub-field">
                <span className="sectionhub-field-label">Parent Category</span>
                <select className="sectionhub-select">
                  <option>None</option>
                  {categories.slice(1).map((category) => (
                    <option key={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>

              <label className="sectionhub-field">
                <span className="sectionhub-field-label">Sort Order</span>
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue="2"
                  className="sectionhub-input"
                />
              </label>
            </div>

            <Toggle
              name="categoryVisibilityPreview"
              label="Visibility"
              description="Enable or disable category on front-end."
              defaultChecked
            />
            <Toggle
              name="featured"
              label="Featured"
              description="Show in recommended categories section."
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-[8px] border border-[var(--border-default)] bg-white text-[12px] font-semibold text-[var(--text-primary)]"
              >
                Discard
              </button>
              <button
                type="submit"
                className="inline-flex h-10 flex-1 items-center justify-center rounded-[8px] bg-[var(--color-primary)] text-[12px] font-semibold text-white"
              >
                Save Changes
              </button>
            </div>

            <input type="hidden" name="id" value={featured?.id ?? ""} />
            <input type="hidden" name="icon" value="LayoutGrid" />
            <input type="hidden" name="visibility" value="MARKETPLACE" />
            <input type="hidden" name="status" value="Active" />
          </Card>
        </form>
      </div>
    </div>
  );
}
