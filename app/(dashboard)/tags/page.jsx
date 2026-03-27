import { saveTagAction } from "@/app/actions";
import { Card, SectionTitle } from "@/components/sectionhub/ui";
import { getTags } from "@/lib/sectionhub/tags/service";
export default async function TagsPage() {
  const tags = await getTags();
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Tags"
        subtitle="Persistent tag registry for section filtering and search."
      />
      <div className="grid gap-4 xl:grid-cols-[1.3fr_320px]">
        <Card className="overflow-hidden">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-4 text-[13px] first:border-t-0"
            >
              <div className="min-w-0">
                <div className="font-medium">{tag.name}</div>
                <div className="truncate font-mono text-[11px] text-[var(--text-tertiary)]">
                  {tag.slug}
                </div>
              </div>
              <div className="font-mono text-[12px] text-[var(--text-secondary)]">
                {tag.usage} uses
              </div>
            </div>
          ))}
        </Card>
        <form action={saveTagAction}>
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
                <span className="text-[12px] font-medium">Color</span>
                <input
                  name="color"
                  defaultValue="violet"
                  className="sectionhub-input"
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-10 w-full items-center justify-center rounded-[8px] bg-[var(--primary)] px-4 text-[13px] font-medium text-white"
              >
                Save Tag
              </button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}

