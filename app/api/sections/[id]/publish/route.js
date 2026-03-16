import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SectionModel } from "@/lib/models";
export async function POST(_, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const section = await SectionModel.findById(id).lean();
    if (!section) throw new Error("Section not found.");
    if (
      !section.name ||
      !section.slug ||
      !section.categoryId ||
      !(section.previews ?? []).length ||
      (section.pricingType === "PAID" && (section.priceCents ?? 0) <= 0)
    ) {
      throw new Error("Section is not publish-ready.");
    }
    const item = await SectionModel.findByIdAndUpdate(
      id,
      {
        status: "PUBLISHED",
        visibility:
          section.visibility === "INTERNAL"
            ? "MARKETPLACE"
            : section.visibility,
      },
      { new: true },
    );
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to publish.",
      },
      { status: 400 },
    );
  }
}
