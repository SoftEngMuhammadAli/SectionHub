import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { BundleModel, SectionModel } from "@/lib/models";
import { formatDate, formatPrice, toId } from "@/lib/sectionhub/shared/format";
export async function GET() {
  await connectToDatabase();
  const [bundles, sections] = await Promise.all([
    BundleModel.find().sort({ updatedAt: -1 }).lean(),
    SectionModel.find().lean(),
  ]);
  return NextResponse.json({
    items: bundles.map((bundle) => ({
      id: toId(bundle._id),
      name: bundle.name,
      slug: bundle.slug,
      shortDescription: bundle.shortDescription ?? "",
      niche: bundle.niche ?? "",
      accessType: bundle.accessType,
      visibility: bundle.visibility,
      status: bundle.status,
      price: formatPrice(bundle.priceCents),
      compareAtPrice: formatPrice(bundle.compareAtPriceCents),
      installs: bundle.installs,
      updatedAt: formatDate(bundle.updatedAt),
      savings: bundle.compareAtPriceCents
        ? Math.max(
            Math.round(
              ((bundle.compareAtPriceCents - bundle.priceCents) /
                bundle.compareAtPriceCents) *
                100,
            ),
            0,
          )
        : 0,
      sections: (bundle.sectionIds ?? [])
        .map(
          (sectionId) =>
            sections.find((section) => toId(section._id) === toId(sectionId))
              ?.name,
        )
        .filter(Boolean),
    })),
  });
}
