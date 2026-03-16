import { saveCategoryAction } from "@/app/actions";
import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getCategories } from "@/lib/sectionhub/categories/service";
export default async function CategoriesPage() {
    const categories = await getCategories();
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <SectionTitle title="Categories" subtitle="Dynamic category management with persistent data."/>
        <div className="text-[13px] text-[var(--text-secondary)]">
          {categories.length} categories
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_360px]">
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {categories.map((category) => (<Card key={category.id} className="p-5">
              <div className="text-[15px] font-semibold">{category.name}</div>
              <div className="mt-1 font-mono text-[11px] text-[var(--text-tertiary)]">
                {category.slug}
              </div>
              <div className="mt-4 space-y-2 text-[13px] text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-mono">{category.sectionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total installs</span>
                  <span className="font-mono">{category.installs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated</span>
                  <span className="font-mono">{category.lastUpdated}</span>
                </div>
              </div>
            </Card>))}
        </div>
        <form action={saveCategoryAction}>
          <Card className="p-5">
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Name</span>
                <input name="name" className="sectionhub-input"/>
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Slug</span>
                <input name="slug" className="sectionhub-input font-mono"/>
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Description</span>
                <textarea name="description" className="sectionhub-textarea"/>
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Icon</span>
                <input name="icon" defaultValue="LayoutGrid" className="sectionhub-input"/>
              </label>
              <label className="block space-y-2">
                <span className="text-[12px] font-medium">Sort Order</span>
                <input name="sortOrder" type="number" defaultValue="1" className="sectionhub-input"/>
              </label>
              <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white">
                Save Category
              </button>
            </div>
          </Card>
        </form>
      </div>
    </div>);
}
