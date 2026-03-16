import type { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import { SectionModel, TagModel } from "@/lib/models";
import { toId } from "@/lib/sectionhub/shared/format";

export async function getTags() {
  await connectToDatabase();
  const [tags, sections] = await Promise.all([
    TagModel.find().sort({ name: 1 }).lean(),
    SectionModel.find().lean(),
  ]);

  return tags.map((tag: any) => ({
    id: toId(tag._id),
    name: tag.name,
    slug: tag.slug,
    color: tag.color,
    usage: sections.filter((section: any) =>
      (section.tagIds ?? []).some((tagId: Types.ObjectId) => toId(tagId) === toId(tag._id)),
    ).length,
  }));
}

export async function upsertTag(input: {
  id?: string;
  name: string;
  slug: string;
  color?: string;
}) {
  await connectToDatabase();
  const data = {
    name: input.name,
    slug: input.slug,
    color: input.color ?? "violet",
  };

  return input.id
    ? TagModel.findByIdAndUpdate(input.id, data, { new: true, upsert: false })
    : TagModel.create(data);
}
