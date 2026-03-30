import "dotenv/config";
import bcrypt from "bcryptjs";
import connectToDatabase from "../lib/db.js";
import { getConfiguredAdmin } from "../lib/auth/default-admin.js";
import {
  ActivityLogModel,
  AdminUserModel,
  ApiCredentialModel,
  BundleModel,
  CategoryModel,
  CustomerModel,
  InstallEventModel,
  OrderModel,
  PasswordResetTokenModel,
  SectionModel,
  SessionModel,
  SettingModel,
  ShopModel,
  TagModel,
} from "../lib/models/index.js";

async function main() {
  await connectToDatabase();
  const configuredAdmin = getConfiguredAdmin();
  await Promise.all([
    ActivityLogModel.deleteMany({}),
    InstallEventModel.deleteMany({}),
    OrderModel.deleteMany({}),
    ShopModel.deleteMany({}),
    CustomerModel.deleteMany({}),
    BundleModel.deleteMany({}),
    SectionModel.deleteMany({}),
    TagModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    ApiCredentialModel.deleteMany({}),
    SettingModel.deleteMany({}),
    PasswordResetTokenModel.deleteMany({}),
    SessionModel.deleteMany({}),
    AdminUserModel.deleteMany({}),
  ]);
  const admin = await AdminUserModel.create({
    name: configuredAdmin.name,
    email: configuredAdmin.email,
    passwordHash: await bcrypt.hash(configuredAdmin.password, 10),
    role: "ADMIN",
    isActive: true,
  });
  const categories = await CategoryModel.insertMany([
    {
      name: "Headers",
      slug: "headers",
      description: "Premium storefront header sections.",
      icon: "LayoutTemplate",
      sortOrder: 1,
      visibility: "MARKETPLACE",
      status: "Active",
    },
    {
      name: "Footers",
      slug: "footers",
      description: "Footer systems and trust sections.",
      icon: "GalleryHorizontalEnd",
      sortOrder: 2,
      visibility: "MARKETPLACE",
      status: "Active",
    },
    {
      name: "Product Sections",
      slug: "product-sections",
      description: "Product-focused merchandising modules.",
      icon: "Package2",
      sortOrder: 3,
      visibility: "MARKETPLACE",
      status: "Active",
      featured: true,
    },
    {
      name: "Conversion Tools",
      slug: "conversion-tools",
      description: "High-converting intent capture and urgency sections.",
      icon: "Zap",
      sortOrder: 4,
      visibility: "MARKETPLACE",
      status: "Featured",
      featured: true,
    },
    {
      name: "Popups",
      slug: "popups",
      description: "Popup and modal growth tools.",
      icon: "MessageSquareMore",
      sortOrder: 5,
      visibility: "MARKETPLACE",
      status: "Active",
    },
    {
      name: "Testimonials",
      slug: "testimonials",
      description: "Social proof and credibility sections.",
      icon: "Quote",
      sortOrder: 6,
      visibility: "MARKETPLACE",
      status: "Inactive",
    },
  ]);
  const tags = await TagModel.insertMany([
    { name: "upsell", slug: "upsell", color: "violet" },
    { name: "conversion", slug: "conversion", color: "success" },
    { name: "os2.0", slug: "os2-0", color: "info" },
    { name: "product-page", slug: "product-page", color: "warning" },
    { name: "announcement", slug: "announcement", color: "danger" },
    { name: "mobile-first", slug: "mobile-first", color: "default" },
  ]);
  const tagMap = new Map(tags.map((tag) => [tag.slug, tag._id]));
  const categoryMap = new Map(
    categories.map((category) => [category.slug, category._id]),
  );
  async function createSection(input) {
    return SectionModel.create({
      name: input.name,
      slug: input.slug,
      categoryId: categoryMap.get(input.categorySlug),
      subcategory: "Primary",
      shortDescription: input.shortDescription,
      fullDescription: input.fullDescription,
      status: input.status,
      visibility: input.visibility,
      featured: input.featured ?? false,
      pricingType: input.pricingType,
      priceCents: input.priceCents,
      compareAtPriceCents: input.compareAtPriceCents,
      accessType: "SINGLE",
      licenseType: "SINGLE_STORE",
      authorId: admin._id,
      tagIds: input.tagSlugs.map((slug) => tagMap.get(slug)).filter(Boolean),
      versions: [
        {
          version: input.version,
          changelog: `${input.version} release`,
          checksum: `sha256:${input.slug}`,
          liquidFileUrl: `/uploads/${input.slug}.liquid`,
          assetZipUrl: `/uploads/${input.slug}.zip`,
          releaseDate: new Date(),
          createdById: admin._id,
          createdAt: new Date(),
        },
      ],
      previews: [
        {
          type: "IMAGE",
          url: `/previews/${input.slug}-1.png`,
          title: `${input.name} Preview 1`,
          caption: "Primary storefront state",
          altText: `${input.name} preview`,
          isThumbnail: true,
          sortOrder: 1,
        },
        {
          type: "IMAGE",
          url: `/previews/${input.slug}-2.png`,
          title: `${input.name} Preview 2`,
          caption: "Secondary content state",
          altText: `${input.name} preview alt`,
          isThumbnail: false,
          sortOrder: 2,
        },
      ],
      documentation: {
        installationSteps:
          "Upload section, add to template, configure content blocks.",
        usageNotes: "Optimized for premium Shopify OS 2.0 storefronts.",
        merchantInstructions: "Keep CTA short and media high contrast.",
        supportNotes: "Supports desktop and mobile.",
        changelog: `${input.version} release`,
      },
      compatibility: {
        themeCompatibility: "Dawn, Prestige, Impact",
        os20Compatible: true,
        appBlockSupport: true,
        dependencies: "No app dependency",
        testedEnvironments: "Desktop, tablet, mobile",
      },
      metaTitle: `${input.name} - SectionHub`,
      metaDescription: input.shortDescription,
      marketplaceSubtitle: input.shortDescription,
      internalKeywords: input.tagSlugs.join(", "),
      calloutBadgeText: input.featured ? "Top seller" : "Premium",
    });
  }
  const hero = await createSection({
    name: "Hero Banner Pro",
    slug: "hero-banner-pro",
    categorySlug: "headers",
    shortDescription: "Launch-ready hero for premium storefront campaigns.",
    fullDescription:
      "A conversion-focused hero section with structured media, CTA placement, and merchant-safe editing controls.",
    version: "v2.4.1",
    status: "PUBLISHED",
    visibility: "MARKETPLACE",
    featured: true,
    pricingType: "PAID",
    priceCents: 3900,
    compareAtPriceCents: 5900,
    tagSlugs: ["conversion", "os2-0", "mobile-first"],
  });
  const sticky = await createSection({
    name: "Sticky Header v2",
    slug: "sticky-header-v2",
    categorySlug: "headers",
    shortDescription:
      "Persistent navigation with controlled motion and announcement support.",
    fullDescription:
      "High-discipline header system for mobile and desktop storefronts.",
    version: "v1.8.0",
    status: "PUBLISHED",
    visibility: "MARKETPLACE",
    pricingType: "PAID",
    priceCents: 2400,
    compareAtPriceCents: 3400,
    tagSlugs: ["announcement", "mobile-first"],
  });
  const showcase = await createSection({
    name: "Product Showcase Grid",
    slug: "product-showcase-grid",
    categorySlug: "product-sections",
    shortDescription:
      "Editorial product grid with upsell-aware merchandising blocks.",
    fullDescription:
      "Supports rich storytelling, collection linking, and premium product merchandising layouts.",
    version: "v3.1.0",
    status: "PUBLISHED",
    visibility: "MARKETPLACE",
    featured: true,
    pricingType: "PAID",
    priceCents: 4900,
    compareAtPriceCents: 6900,
    tagSlugs: ["upsell", "product-page", "conversion"],
  });
  const megaFooter = await createSection({
    name: "Mega Footer",
    slug: "mega-footer",
    categorySlug: "footers",
    shortDescription:
      "Structured footer system with deep nav and trust callouts.",
    fullDescription:
      "Footer with policy groups, newsletter, and merchandising blocks.",
    version: "v1.3.5",
    status: "DRAFT",
    visibility: "INTERNAL",
    pricingType: "PAID",
    priceCents: 1900,
    compareAtPriceCents: 2900,
    tagSlugs: ["mobile-first"],
  });
  const popup = await createSection({
    name: "Newsletter Popup",
    slug: "newsletter-popup",
    categorySlug: "popups",
    shortDescription:
      "Fast email capture popup with high-intent display rules.",
    fullDescription:
      "Lightweight popup with timing controls and premium form layout.",
    version: "v2.0.2",
    status: "PUBLISHED",
    visibility: "MARKETPLACE",
    pricingType: "PAID",
    priceCents: 2900,
    compareAtPriceCents: 3900,
    tagSlugs: ["conversion", "announcement"],
  });
  const testimonial = await createSection({
    name: "Testimonials Slider",
    slug: "testimonials-slider",
    categorySlug: "testimonials",
    shortDescription: "Low-noise social proof module for premium storefronts.",
    fullDescription:
      "Structured testimonial slider with avatar, quote, and star support.",
    version: "v1.0.0",
    status: "ARCHIVED",
    visibility: "HIDDEN",
    pricingType: "FREE",
    priceCents: 0,
    tagSlugs: ["conversion"],
  });
  const bundleOne = await BundleModel.create({
    name: "Conversion Starter Pack",
    slug: "conversion-starter-pack",
    shortDescription:
      "Essential conversion modules for launch-ready storefronts.",
    niche: "Conversion",
    accessType: "BUNDLE",
    visibility: "MARKETPLACE",
    status: "ACTIVE",
    priceCents: 8900,
    compareAtPriceCents: 14100,
    installs: 438,
    sectionIds: [hero._id, popup._id, showcase._id],
  });
  const bundleTwo = await BundleModel.create({
    name: "Storefront Essentials",
    slug: "storefront-essentials",
    shortDescription:
      "Foundational layout sections for premium Shopify storefronts.",
    niche: "Store Setup",
    accessType: "SUBSCRIPTION",
    visibility: "PRIVATE",
    status: "DRAFT",
    priceCents: 12900,
    compareAtPriceCents: 18400,
    installs: 121,
    sectionIds: [sticky._id, megaFooter._id, showcase._id],
  });
  const customers = await CustomerModel.insertMany([
    { name: "Olive & Ivory", email: "ops@oliveandivory.co" },
    { name: "Nord Studios", email: "team@nordstudios.shop" },
    { name: "Luma Home", email: "support@lumahome.store" },
    { name: "Atelier Form", email: "owner@atelierform.com" },
  ]);
  const [customerA, customerB, customerC, customerD] = customers;
  const shops = await ShopModel.insertMany([
    {
      domain: "oliveandivory.co",
      customerId: customerA._id,
      planType: "Shopify",
      status: "Active",
    },
    {
      domain: "nordstudios.shop",
      customerId: customerB._id,
      planType: "Advanced",
      status: "Active",
    },
    {
      domain: "lumahome.store",
      customerId: customerC._id,
      planType: "Starter",
      status: "Trial",
    },
    {
      domain: "atelierform.com",
      customerId: customerD._id,
      planType: "Basic",
      status: "Churned",
    },
  ]);
  const [shopA, shopB, shopC, shopD] = shops;
  await OrderModel.insertMany([
    {
      orderNumber: "ORD-40291",
      customerId: customerA._id,
      shopId: shopA._id,
      totalAmountCents: 8900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: new Date(),
      items: [
        {
          itemType: "bundle",
          bundleId: bundleOne._id,
          titleSnapshot: bundleOne.name,
          unitPriceCents: 8900,
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: "ORD-40277",
      customerId: customerB._id,
      shopId: shopB._id,
      totalAmountCents: 3900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: new Date(),
      items: [
        {
          itemType: "section",
          sectionId: hero._id,
          titleSnapshot: hero.name,
          unitPriceCents: 3900,
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: "ORD-40264",
      customerId: customerC._id,
      shopId: shopC._id,
      totalAmountCents: 12900,
      currency: "USD",
      status: "PENDING",
      paymentProvider: "Manual",
      purchasedAt: new Date(),
      items: [
        {
          itemType: "bundle",
          bundleId: bundleTwo._id,
          titleSnapshot: bundleTwo.name,
          unitPriceCents: 12900,
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: "ORD-40231",
      customerId: customerD._id,
      shopId: shopD._id,
      totalAmountCents: 2900,
      currency: "USD",
      status: "REFUNDED",
      paymentProvider: "Stripe",
      purchasedAt: new Date(),
      items: [
        {
          itemType: "section",
          sectionId: popup._id,
          titleSnapshot: popup.name,
          unitPriceCents: 2900,
          quantity: 1,
        },
      ],
    },
  ]);
  await InstallEventModel.insertMany([
    {
      sectionId: hero._id,
      shopId: shopA._id,
      status: "SUCCESS",
      installedAt: new Date(),
    },
    {
      sectionId: hero._id,
      shopId: shopB._id,
      status: "SUCCESS",
      installedAt: new Date(),
    },
    {
      sectionId: showcase._id,
      shopId: shopA._id,
      status: "SUCCESS",
      installedAt: new Date(),
    },
    {
      sectionId: popup._id,
      shopId: shopD._id,
      status: "FAILED",
      installedAt: new Date(),
    },
    {
      sectionId: megaFooter._id,
      shopId: shopC._id,
      status: "FAILED",
      installedAt: new Date(),
    },
  ]);
  await SettingModel.insertMany([
    {
      key: "site_name",
      valueJson: JSON.stringify({ value: "SectionHub Enterprise" }),
      updatedById: admin._id,
    },
    {
      key: "default_currency",
      valueJson: JSON.stringify({ value: "USD" }),
      updatedById: admin._id,
    },
    {
      key: "maintenance_mode",
      valueJson: JSON.stringify({ value: false }),
      updatedById: admin._id,
    },
    {
      key: "site_logo",
      valueJson: JSON.stringify({ value: "/logo.svg" }),
      updatedById: admin._id,
    },
  ]);
  await ApiCredentialModel.create({
    clientId: "sh_live_8842_910x_jklp",
    encryptedSecret: "sec_live_sectionhub_local",
    status: "active",
    rotatedAt: new Date(),
  });
  await ActivityLogModel.insertMany([
    {
      actorId: admin._id,
      actorName: admin.name,
      action: "published",
      entityType: "section",
      entityId: String(hero._id),
      entityLabel: hero.name,
      metadataJson: JSON.stringify({ status: "PUBLISHED" }),
    },
    {
      actorId: admin._id,
      actorName: admin.name,
      action: "updated pricing on",
      entityType: "section",
      entityId: String(popup._id),
      entityLabel: popup.name,
      metadataJson: JSON.stringify({ priceCents: 2900 }),
    },
    {
      actorId: admin._id,
      actorName: admin.name,
      action: "created bundle",
      entityType: "bundle",
      entityId: String(bundleTwo._id),
      entityLabel: bundleTwo.name,
      metadataJson: JSON.stringify({ status: "DRAFT" }),
    },
    {
      actorName: "System",
      action: "rotated API key for",
      entityType: "api_credential",
      entityId: "Webhook Sync",
      entityLabel: "Webhook Sync",
      metadataJson: JSON.stringify({ status: "active" }),
    },
    {
      actorId: admin._id,
      actorName: admin.name,
      action: "archived",
      entityType: "section",
      entityId: String(testimonial._id),
      entityLabel: testimonial.name,
      metadataJson: JSON.stringify({ status: "ARCHIVED" }),
    },
  ]);
  console.log("Seed completed.");
  console.log(`Admin email: ${configuredAdmin.email}`);
  console.log(`Admin password: ${configuredAdmin.password}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exit(1);
  });
