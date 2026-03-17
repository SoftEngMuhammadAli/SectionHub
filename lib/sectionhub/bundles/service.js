import connectToDatabase from "@/lib/db";
import { BundleModel, SectionModel } from "@/lib/models";
import { formatDate, formatPrice, toId } from "@/lib/sectionhub/shared/format";
export async function getBundles() {
  await connectToDatabase();
  const [bundles, sections] = await Promise.all([
    BundleModel.find().sort({ updatedAt: -1 }).lean(),
    SectionModel.find().lean(),
  ]);
  return bundles.map((bundle) => ({
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
  }));
}
export async function upsertBundle(input) {
  await connectToDatabase();
  const data = {
    name: input.name,
    slug: input.slug,
    shortDescription: input.shortDescription,
    niche: input.niche,
    accessType: input.accessType ?? "BUNDLE",
    visibility: input.visibility ?? "MARKETPLACE",
    status: input.status ?? "DRAFT",
    priceCents: input.priceCents ?? 0,
    compareAtPriceCents: input.compareAtPriceCents,
    sectionIds: input.sectionIds ?? [],
  };
  return input.id
    ? BundleModel.findByIdAndUpdate(input.id, data, {
        new: true,
        upsert: false,
      })
    : BundleModel.create(data);
}

export async function setBundleStatus(id, status) {
  await connectToDatabase();

  const nextStatus = status === "ACTIVE" ? "ACTIVE" : "DRAFT";
  const updated = await BundleModel.findByIdAndUpdate(
    id,
    { status: nextStatus },
    { new: true, upsert: false },
  );

  if (!updated) {
    throw new Error("Bundle not found.");
  }

  return updated;
}
