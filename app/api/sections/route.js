import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { InstallEventModel, SectionModel } from "@/lib/models";
import {
  formatCount,
  formatDate,
  formatPrice,
  toId,
} from "@/lib/sectionhub/shared/format";
async function withSectionRelations(query) {
  return query.populate("categoryId").populate("tagIds").lean();
}
function mapSectionRow(section, installCount) {
  return {
    id: toId(section._id),
    name: section.name,
    slug: section.slug,
    category: section.categoryId?.name ?? "Unassigned",
    tags: (section.tagIds ?? []).map((tag) => tag.name),
    price: formatPrice(section.priceCents),
    version: section.versions?.[0]?.version ?? "v1.0.0",
    installs: formatCount(installCount),
    updatedAt: formatDate(section.updatedAt),
    status: section.status,
    visibility: section.visibility,
    featured: section.featured,
    author: "Alex Rivera",
  };
}
export async function GET(request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const filters = {};
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  if (q) {
    filters.$or = [
      { name: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
    ];
  }
  if (status) filters.status = status;
  const sections = await withSectionRelations(
    SectionModel.find(filters).sort({ updatedAt: -1 }),
  );
  const installs = await InstallEventModel.find({ status: "SUCCESS" }).lean();
  const installMap = new Map();
  for (const install of installs) {
    installMap.set(
      toId(install.sectionId),
      (installMap.get(toId(install.sectionId)) ?? 0) + 1,
    );
  }
  return NextResponse.json({
    items: sections
      .filter((section) => !category || section.categoryId?.slug === category)
      .filter(
        (section) =>
          !tag || (section.tagIds ?? []).some((item) => item.slug === tag),
      )
      .map((section) =>
        mapSectionRow(section, installMap.get(toId(section._id)) ?? 0),
      ),
  });
}
