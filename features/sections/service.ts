import type { Types } from "mongoose";
import connectToDatabase from "@/lib/db";
import { BundleModel, InstallEventModel, SectionModel } from "@/models";
import { formatCount, formatDate, formatPrice, toId } from "@/features/shared/format";

async function withSectionRelations(query: ReturnType<typeof SectionModel.find>) {
  return query.populate("categoryId").populate("tagIds").lean();
}

function mapSectionRow(section: any, installCount: number) {
  return {
    id: toId(section._id),
    name: section.name,
    slug: section.slug,
    category: section.categoryId?.name ?? "Unassigned",
    tags: (section.tagIds ?? []).map((tag: any) => tag.name),
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

export async function getSections(params?: {
  q?: string;
  category?: string;
  status?: string;
  tag?: string;
}) {
  await connectToDatabase();
  const filters: any = {};
  if (params?.q) {
    filters.$or = [
      { name: { $regex: params.q, $options: "i" } },
      { slug: { $regex: params.q, $options: "i" } },
    ];
  }
  if (params?.status) filters.status = params.status;

  const sections = await withSectionRelations(SectionModel.find(filters).sort({ updatedAt: -1 }));
  const installs = await InstallEventModel.find({ status: "SUCCESS" }).lean();
  const installMap = new Map<string, number>();
  for (const install of installs) {
    installMap.set(toId(install.sectionId), (installMap.get(toId(install.sectionId)) ?? 0) + 1);
  }

  return sections
    .filter((section: any) => !params?.category || section.categoryId?.slug === params.category)
    .filter((section: any) => !params?.tag || (section.tagIds ?? []).some((tag: any) => tag.slug === params.tag))
    .map((section: any) => mapSectionRow(section, installMap.get(toId(section._id)) ?? 0));
}

export async function getSectionFormData(id: string) {
  await connectToDatabase();
  const section = await SectionModel.findById(id).populate("categoryId").populate("tagIds").lean();
  if (!section) return null;

  const installs = await InstallEventModel.countDocuments({ sectionId: section._id, status: "SUCCESS" });
  const bundles = await BundleModel.countDocuments({ sectionIds: section._id });

  return {
    ...section,
    id: toId(section._id),
    categoryId: section.categoryId?._id ? toId(section.categoryId._id) : "",
    category: section.categoryId,
    tags: (section.tagIds ?? []).map((tag: any) => ({
      tagId: toId(tag._id),
      tag,
    })),
    _count: { installEvents: installs, bundleSections: bundles },
  };
}

export async function createOrUpdateSection(input: {
  id?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryId?: string | null;
  subcategory?: string;
  status?: string;
  visibility?: string;
  featured?: boolean;
  pricingType?: string;
  priceCents?: number;
  compareAtPriceCents?: number | null;
  accessType?: string;
  licenseType?: string;
  authorId?: string | null;
  version?: string;
  changelog?: string;
  metaTitle?: string;
  metaDescription?: string;
  internalKeywords?: string;
  marketplaceSubtitle?: string;
  calloutBadgeText?: string;
  installationSteps?: string;
  usageNotes?: string;
  merchantInstructions?: string;
  supportNotes?: string;
  compatibilityTheme?: string;
  os20Compatible?: boolean;
  appBlockSupport?: boolean;
  dependencies?: string;
  testedEnvironments?: string;
  tagIds?: string[];
  previews?: Array<{
    type: string;
    url: string;
    title?: string;
    caption?: string;
    altText?: string;
    isThumbnail?: boolean;
    sortOrder?: number;
  }>;
}) {
  await connectToDatabase();

  const data: any = {
    name: input.name,
    slug: input.slug,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    categoryId: input.categoryId || undefined,
    subcategory: input.subcategory,
    status: input.status ?? "DRAFT",
    visibility: input.visibility ?? "INTERNAL",
    featured: input.featured ?? false,
    pricingType: input.pricingType ?? "PAID",
    priceCents: input.priceCents ?? 0,
    compareAtPriceCents: input.compareAtPriceCents ?? null,
    accessType: input.accessType ?? "SINGLE",
    licenseType: input.licenseType ?? "SINGLE_STORE",
    authorId: input.authorId || undefined,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    internalKeywords: input.internalKeywords,
    marketplaceSubtitle: input.marketplaceSubtitle,
    calloutBadgeText: input.calloutBadgeText,
    documentation: {
      installationSteps: input.installationSteps,
      usageNotes: input.usageNotes,
      merchantInstructions: input.merchantInstructions,
      supportNotes: input.supportNotes,
      changelog: input.changelog,
    },
    compatibility: {
      themeCompatibility: input.compatibilityTheme,
      os20Compatible: input.os20Compatible ?? true,
      appBlockSupport: input.appBlockSupport ?? false,
      dependencies: input.dependencies,
      testedEnvironments: input.testedEnvironments,
    },
    tagIds: input.tagIds ?? [],
    previews: input.previews ?? [],
  };

  if (input.version) {
    const versionEntry = {
      version: input.version,
      changelog: input.changelog ?? "",
      liquidFileUrl: `/uploads/${input.slug}.liquid`,
      assetZipUrl: `/uploads/${input.slug}.zip`,
      checksum: `sha256:${input.slug}`,
      releaseDate: new Date(),
      createdById: input.authorId || undefined,
      createdAt: new Date(),
    };
    if (input.id) data.$push = { versions: versionEntry };
    else data.versions = [versionEntry];
  }

  return input.id
    ? SectionModel.findByIdAndUpdate(input.id, data.$push ? { ...data, $push: data.$push } : data, { new: true })
    : SectionModel.create(data);
}

export async function publishSection(id: string) {
  await connectToDatabase();
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

  return SectionModel.findByIdAndUpdate(
    id,
    {
      status: "PUBLISHED",
      visibility: section.visibility === "INTERNAL" ? "MARKETPLACE" : section.visibility,
    },
    { new: true },
  );
}
