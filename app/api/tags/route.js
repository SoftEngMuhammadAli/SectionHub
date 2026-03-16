import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SectionModel, TagModel } from "@/lib/models";
import { toId } from "@/lib/sectionhub/shared/format";
export async function GET() {
  await connectToDatabase();
  const [tags, sections] = await Promise.all([
    TagModel.find().sort({ name: 1 }).lean(),
    SectionModel.find().lean(),
  ]);
  return NextResponse.json({
    items: tags.map((tag) => ({
      id: toId(tag._id),
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      usage: sections.filter((section) =>
        (section.tagIds ?? []).some((tagId) => toId(tagId) === toId(tag._id)),
      ).length,
    })),
  });
}
