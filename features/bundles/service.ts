import type { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import { BundleModel, SectionModel } from "@/models";
import { formatDate, formatPrice, toId } from "@/features/shared/format";

export async function getBundles() {
  await connectToDatabase();
  const [bundles, sections] = await Promise.all([
    BundleModel.find().sort({ updatedAt: -1 }).lean(),
    SectionModel.find().lean(),
  ]);

  return bundles.map((bundle: any) => ({
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
      ? Math.max(Math.round(((bundle.compareAtPriceCents - bundle.priceCents) / bundle.compareAtPriceCents) * 100), 0)
      : 0,
    sections: (bundle.sectionIds ?? [])
      .map((sectionId: Types.ObjectId) => sections.find((section: any) => toId(section._id) === toId(sectionId))?.name)
      .filter(Boolean),
  }));
}

export async function upsertBundle(input: {
  id?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  niche?: string;
  accessType?: string;
  visibility?: string;
  status?: string;
  priceCents?: number;
  compareAtPriceCents?: number;
  sectionIds?: string[];
}) {
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
    ? BundleModel.findByIdAndUpdate(input.id, data, { new: true, upsert: false })
    : BundleModel.create(data);
}
