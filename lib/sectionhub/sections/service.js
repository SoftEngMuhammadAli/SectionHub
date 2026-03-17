import connectToDatabase from "@/lib/db";
import {
  BundleModel,
  InstallEventModel,
  SectionDailyMetricModel,
  SectionModel,
} from "@/lib/models";
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
export async function getSections(params) {
  await connectToDatabase();
  const filters = {};
  if (params?.q) {
    filters.$or = [
      { name: { $regex: params.q, $options: "i" } },
      { slug: { $regex: params.q, $options: "i" } },
    ];
  }
  if (params?.status) filters.status = params.status;
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
  return sections
    .filter(
      (section) =>
        !params?.category || section.categoryId?.slug === params.category,
    )
    .filter(
      (section) =>
        !params?.tag ||
        (section.tagIds ?? []).some((tag) => tag.slug === params.tag),
    )
    .map((section) =>
      mapSectionRow(section, installMap.get(toId(section._id)) ?? 0),
    );
}
export async function getSectionFormData(id) {
  await connectToDatabase();
  const section = await SectionModel.findById(id)
    .populate("categoryId")
    .populate("tagIds")
    .lean();
  if (!section) return null;
  const installs = await InstallEventModel.countDocuments({
    sectionId: section._id,
    status: "SUCCESS",
  });
  const bundles = await BundleModel.countDocuments({ sectionIds: section._id });
  return {
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
}
export async function createOrUpdateSection(input) {
  await connectToDatabase();
  const data = {
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
    ? SectionModel.findByIdAndUpdate(
        input.id,
        data.$push ? { ...data, $push: data.$push } : data,
        { new: true },
      )
    : SectionModel.create(data);
}

export async function publishSection(id) {
  await connectToDatabase();

  const section = await SectionModel.findById(id);

  if (!section) {
    throw new Error("Section not found.");
  }

  // 🔧 Ensure previews is always an array (fix crash issue)
  if (!Array.isArray(section.previews)) {
    section.previews = [];
  }

  // 🔍 Validation errors
  const errors = [];

  if (!section.name || section.name.trim() === "") {
    errors.push("Name is missing");
  }

  if (!section.slug || section.slug.trim() === "") {
    errors.push("Slug is missing");
  }

  if (!section.categoryId) {
    errors.push("Category is not selected");
  }

  // ⚠️ Relaxed preview validation (NO BLOCK)
  const hasPreview = section.previews.length > 0;

  // 💰 Pricing validation
  if (section.pricingType === "PAID" && (section.priceCents ?? 0) <= 0) {
    errors.push("Price must be greater than 0 for paid sections");
  }

  // 🛑 Only block critical fields (NOT preview)
  if (errors.length > 0) {
    console.error("❌ Publish Validation Failed:", {
      sectionId: id,
      errors,
    });

    throw new Error(errors.join(", "));
  }

  // 🔥 Optional: auto-add fallback preview (DEV or fallback UX)
  if (!hasPreview) {
    section.previews = [
      {
        url: "/uploads/fallback.png",
        type: "IMAGE",
      },
    ];
  }

  // ✅ Save + publish
  const updatedSection = await SectionModel.findByIdAndUpdate(
    id,
    {
      status: "PUBLISHED",
      visibility:
        section.visibility === "INTERNAL" ? "MARKETPLACE" : section.visibility,
      previews: section.previews, // ensure saved
      publishedAt: new Date(),
    },
    { new: true },
  );

  return updatedSection;
}

export async function deleteSection(id) {
  await connectToDatabase();

  if (!id) {
    throw new Error("Section id is required.");
  }

  const section = await SectionModel.findById(id).lean();

  if (!section) {
    throw new Error("Section not found.");
  }

  await Promise.all([
    BundleModel.updateMany(
      { sectionIds: section._id },
      { $pull: { sectionIds: section._id } },
    ),
    InstallEventModel.deleteMany({ sectionId: section._id }),
    SectionDailyMetricModel.deleteMany({ sectionId: section._id }),
    SectionModel.findByIdAndDelete(section._id),
  ]);

  return section;
}
