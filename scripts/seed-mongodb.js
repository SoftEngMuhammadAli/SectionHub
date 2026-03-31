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
  console.log("Database cleared. Seeding with sample data...");
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
  const now = new Date();
  function daysAgo(days, hour = 11) {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    date.setHours(hour, 0, 0, 0);
    return date;
  }
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
  const storefrontProfiles = [
    {
      key: "luxe",
      name: "Luxe Beauty",
      email: "team@luxe-beauty.com",
      domain: "luxe-beauty.myshopify.com",
      planType: "Shopify",
      status: "Active",
      createdAt: daysAgo(120),
    },
    {
      key: "retro",
      name: "Retro Kickz",
      email: "ops@retro-kickz.com",
      domain: "retro-kickz.com",
      planType: "Advanced",
      status: "Active",
      createdAt: daysAgo(96),
    },
    {
      key: "urban",
      name: "Urban Flora",
      email: "hello@urban-flora.store",
      domain: "urban-flora.store",
      planType: "Shopify",
      status: "Active",
      createdAt: daysAgo(82),
    },
    {
      key: "tech",
      name: "Tech Minimal",
      email: "team@tech-minimal.io",
      domain: "tech-minimal.io",
      planType: "Advanced",
      status: "Active",
      createdAt: daysAgo(63),
    },
    {
      key: "velvet",
      name: "Velvet Decor",
      email: "support@velvet-decor.com",
      domain: "velvet-decor.com",
      planType: "Basic",
      status: "Active",
      createdAt: daysAgo(44),
    },
    {
      key: "olive",
      name: "Olive & Ivory",
      email: "ops@oliveandivory.co",
      domain: "oliveandivory.co",
      planType: "Shopify",
      status: "Active",
      createdAt: daysAgo(20),
    },
    {
      key: "nord",
      name: "Nord Studios",
      email: "team@nordstudios.shop",
      domain: "nordstudios.shop",
      planType: "Starter",
      status: "Trial",
      createdAt: daysAgo(12),
    },
    {
      key: "atelier",
      name: "Atelier Form",
      email: "owner@atelierform.com",
      domain: "atelierform.com",
      planType: "Basic",
      status: "Churned",
      createdAt: daysAgo(74),
    },
  ];
  const customers = await CustomerModel.insertMany(
    storefrontProfiles.map((profile) => ({
      name: profile.name,
      email: profile.email,
    })),
  );
  const customerMap = new Map(
    storefrontProfiles.map((profile, index) => [profile.key, customers[index]]),
  );
  const shops = await ShopModel.insertMany(
    storefrontProfiles.map((profile) => ({
      domain: profile.domain,
      customerId: customerMap.get(profile.key)._id,
      planType: profile.planType,
      status: profile.status,
      createdAt: profile.createdAt,
    })),
  );
  const shopMap = new Map(
    storefrontProfiles.map((profile, index) => [profile.key, shops[index]]),
  );
  const sectionMap = {
    hero,
    sticky,
    showcase,
    megaFooter,
    popup,
    testimonial,
  };
  await OrderModel.insertMany([
    {
      orderNumber: "ORD-51091",
      customerId: customerMap.get("luxe")._id,
      shopId: shopMap.get("luxe")._id,
      totalAmountCents: 8900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(14),
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
      orderNumber: "ORD-51088",
      customerId: customerMap.get("retro")._id,
      shopId: shopMap.get("retro")._id,
      totalAmountCents: 3900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(10),
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
      orderNumber: "ORD-51074",
      customerId: customerMap.get("urban")._id,
      shopId: shopMap.get("urban")._id,
      totalAmountCents: 4900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(7),
      items: [
        {
          itemType: "section",
          sectionId: showcase._id,
          titleSnapshot: showcase.name,
          unitPriceCents: 4900,
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: "ORD-51061",
      customerId: customerMap.get("tech")._id,
      shopId: shopMap.get("tech")._id,
      totalAmountCents: 2400,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(5),
      items: [
        {
          itemType: "section",
          sectionId: sticky._id,
          titleSnapshot: sticky.name,
          unitPriceCents: 2400,
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: "ORD-51057",
      customerId: customerMap.get("velvet")._id,
      shopId: shopMap.get("velvet")._id,
      totalAmountCents: 2900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(3),
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
    {
      orderNumber: "ORD-51049",
      customerId: customerMap.get("olive")._id,
      shopId: shopMap.get("olive")._id,
      totalAmountCents: 3900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(1),
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
      orderNumber: "ORD-50988",
      customerId: customerMap.get("olive")._id,
      shopId: shopMap.get("olive")._id,
      totalAmountCents: 3900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(36),
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
      orderNumber: "ORD-50972",
      customerId: customerMap.get("nord")._id,
      shopId: shopMap.get("nord")._id,
      totalAmountCents: 8900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(42),
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
      orderNumber: "ORD-50941",
      customerId: customerMap.get("urban")._id,
      shopId: shopMap.get("urban")._id,
      totalAmountCents: 2900,
      currency: "USD",
      status: "PAID",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(50),
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
    {
      orderNumber: "ORD-51044",
      customerId: customerMap.get("atelier")._id,
      shopId: shopMap.get("atelier")._id,
      totalAmountCents: 2900,
      currency: "USD",
      status: "REFUNDED",
      paymentProvider: "Stripe",
      purchasedAt: daysAgo(2),
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
    {
      orderNumber: "ORD-51039",
      customerId: customerMap.get("nord")._id,
      shopId: shopMap.get("nord")._id,
      totalAmountCents: 12900,
      currency: "USD",
      status: "PENDING",
      paymentProvider: "Manual",
      purchasedAt: daysAgo(8),
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
  ]);
  await InstallEventModel.insertMany([
    {
      sectionId: sectionMap.hero._id,
      shopId: shopMap.get("olive")._id,
      status: "SUCCESS",
      installedAt: daysAgo(1, 15),
    },
    {
      sectionId: sectionMap.popup._id,
      shopId: shopMap.get("velvet")._id,
      status: "SUCCESS",
      installedAt: daysAgo(2, 14),
    },
    {
      sectionId: sectionMap.showcase._id,
      shopId: shopMap.get("nord")._id,
      status: "SUCCESS",
      installedAt: daysAgo(3, 13),
    },
    {
      sectionId: sectionMap.hero._id,
      shopId: shopMap.get("tech")._id,
      status: "SUCCESS",
      installedAt: daysAgo(4, 16),
    },
    {
      sectionId: sectionMap.showcase._id,
      shopId: shopMap.get("urban")._id,
      status: "SUCCESS",
      installedAt: daysAgo(6, 12),
    },
    {
      sectionId: sectionMap.sticky._id,
      shopId: shopMap.get("retro")._id,
      status: "SUCCESS",
      installedAt: daysAgo(8, 11),
    },
    {
      sectionId: sectionMap.popup._id,
      shopId: shopMap.get("velvet")._id,
      status: "SUCCESS",
      installedAt: daysAgo(11, 10),
    },
    {
      sectionId: sectionMap.sticky._id,
      shopId: shopMap.get("tech")._id,
      status: "SUCCESS",
      installedAt: daysAgo(12, 9),
    },
    {
      sectionId: sectionMap.hero._id,
      shopId: shopMap.get("luxe")._id,
      status: "SUCCESS",
      installedAt: daysAgo(14, 15),
    },
    {
      sectionId: sectionMap.showcase._id,
      shopId: shopMap.get("urban")._id,
      status: "SUCCESS",
      installedAt: daysAgo(18, 14),
    },
    {
      sectionId: sectionMap.showcase._id,
      shopId: shopMap.get("luxe")._id,
      status: "SUCCESS",
      installedAt: daysAgo(21, 13),
    },
    {
      sectionId: sectionMap.hero._id,
      shopId: shopMap.get("retro")._id,
      status: "SUCCESS",
      installedAt: daysAgo(24, 12),
    },
    {
      sectionId: sectionMap.popup._id,
      shopId: shopMap.get("olive")._id,
      status: "SUCCESS",
      installedAt: daysAgo(27, 11),
    },
    {
      sectionId: sectionMap.hero._id,
      shopId: shopMap.get("olive")._id,
      status: "SUCCESS",
      installedAt: daysAgo(29, 10),
    },
    {
      sectionId: sectionMap.hero._id,
      shopId: shopMap.get("luxe")._id,
      status: "SUCCESS",
      installedAt: daysAgo(35, 15),
    },
    {
      sectionId: sectionMap.popup._id,
      shopId: shopMap.get("atelier")._id,
      status: "FAILED",
      installedAt: daysAgo(37, 14),
    },
    {
      sectionId: sectionMap.hero._id,
      shopId: shopMap.get("urban")._id,
      status: "SUCCESS",
      installedAt: daysAgo(38, 13),
    },
    {
      sectionId: sectionMap.popup._id,
      shopId: shopMap.get("tech")._id,
      status: "SUCCESS",
      installedAt: daysAgo(40, 12),
    },
    {
      sectionId: sectionMap.showcase._id,
      shopId: shopMap.get("nord")._id,
      status: "SUCCESS",
      installedAt: daysAgo(45, 11),
    },
    {
      sectionId: sectionMap.sticky._id,
      shopId: shopMap.get("retro")._id,
      status: "SUCCESS",
      installedAt: daysAgo(47, 10),
    },
    {
      sectionId: sectionMap.showcase._id,
      shopId: shopMap.get("luxe")._id,
      status: "SUCCESS",
      installedAt: daysAgo(55, 9),
    },
    {
      sectionId: sectionMap.megaFooter._id,
      shopId: shopMap.get("atelier")._id,
      status: "FAILED",
      installedAt: daysAgo(9, 8),
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
