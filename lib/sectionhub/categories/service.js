import connectToDatabase from "@/lib/db";
import { CategoryModel, InstallEventModel, SectionModel } from "@/lib/models";
import { formatDate, toId } from "@/lib/sectionhub/shared/format";
export async function getCategories() {
  await connectToDatabase();
  const categories = await CategoryModel.find().sort({ sortOrder: 1 }).lean();
  const sections = await SectionModel.find().lean();
  const installs = await InstallEventModel.find({ status: "SUCCESS" }).lean();
  return categories.map((category) => {
    const scoped = sections.filter(
      (section) =>
        section.categoryId && toId(section.categoryId) === toId(category._id),
    );
    const installTotal = installs.filter((install) =>
      scoped.some((section) => toId(section._id) === toId(install.sectionId)),
    ).length;
    return {
      id: toId(category._id),
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      icon: category.icon ?? "LayoutGrid",
      parentId: category.parentId ? toId(category.parentId) : "",
      parentName:
        categories.find((item) => toId(item._id) === toId(category.parentId))
          ?.name ?? "",
      sectionCount: scoped.length,
      installs: installTotal,
      lastUpdated: formatDate(category.updatedAt),
      status: category.status,
      featured: category.featured,
      visibility: category.visibility,
      sortOrder: category.sortOrder,
    };
  });
}
export async function upsertCategory(input) {
  await connectToDatabase();
  const data = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    icon: input.icon,
    parentId: input.parentId || null,
    sortOrder: input.sortOrder ?? 0,
    visibility: input.visibility ?? "MARKETPLACE",
    featured: input.featured ?? false,
    status: input.status ?? "Active",
  };
  return input.id
    ? CategoryModel.findByIdAndUpdate(input.id, data, {
        new: true,
        upsert: false,
      })
    : CategoryModel.create(data);
}
