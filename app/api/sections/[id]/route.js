import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { BundleModel, InstallEventModel, SectionModel } from "@/lib/models";
import { toId } from "@/lib/sectionhub/shared/format";
export async function GET(_, context) {
  await connectToDatabase();
  const { id } = await context.params;
  const section = await SectionModel.findById(id)
    .populate("categoryId")
    .populate("tagIds")
    .lean();
  if (!section) {
    return NextResponse.json({ item: null }, { status: 404 });
  }
  const installs = await InstallEventModel.countDocuments({
    sectionId: section._id,
    status: "SUCCESS",
  });
  const bundles = await BundleModel.countDocuments({ sectionIds: section._id });
  const item = {
    ...section,
    id: toId(section._id),
    categoryId: section.categoryId?._id ? toId(section.categoryId._id) : "",
    category: section.categoryId,
    tags: (section.tagIds ?? []).map((tag) => ({
      tagId: toId(tag._id),
      tag,
    })),
    _count: { installEvents: installs, bundleSections: bundles },
  };
  return NextResponse.json({ item }, { status: item ? 200 : 404 });
}
