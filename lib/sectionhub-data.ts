export type SectionItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  price: string;
  version: string;
  installs: string;
  updatedAt: string;
  status: string;
  visibility: string;
  featured: boolean;
  author: string;
};

export const navGroups = [
  { label: "CONTENT", items: [
    { href: "/dashboard", label: "Dashboard", icon: "home" },
    { href: "/sections", label: "Sections", icon: "layers" },
    { href: "/sections/new", label: "Upload Section", icon: "upload" },
    { href: "/bundles", label: "Bundles", icon: "package" },
  ]},
  { label: "TAXONOMY", items: [
    { href: "/categories", label: "Categories", icon: "grid" },
    { href: "/tags", label: "Tags", icon: "tag" },
  ]},
  { label: "INSIGHTS", items: [
    { href: "/analytics", label: "Analytics", icon: "chart" },
    { href: "/orders", label: "Orders", icon: "receipt" },
    { href: "/customers", label: "Customers", icon: "users" },
    { href: "/activity", label: "Activity Log", icon: "activity" },
  ]},
  { label: "SYSTEM", items: [{ href: "/settings", label: "Settings", icon: "settings" }] },
];

export const sectionRows: SectionItem[] = [
  { id: "sec_hero_banner_pro", name: "Hero Banner Pro", slug: "hero-banner-pro", category: "Headers", tags: ["featured", "conversion", "os2.0"], price: "$39.00", version: "v2.4.1", installs: "1,248", updatedAt: "Mar 14, 2026", status: "Published", visibility: "Marketplace", featured: true, author: "Alex Rivera" },
  { id: "sec_sticky_header_v2", name: "Sticky Header v2", slug: "sticky-header-v2", category: "Headers", tags: ["navigation", "mobile-first"], price: "$24.00", version: "v1.8.0", installs: "986", updatedAt: "Mar 12, 2026", status: "Published", visibility: "Marketplace", featured: false, author: "Nadia Khan" },
  { id: "sec_product_showcase_grid", name: "Product Showcase Grid", slug: "product-showcase-grid", category: "Product Sections", tags: ["upsell", "product-page"], price: "$49.00", version: "v3.1.0", installs: "1,642", updatedAt: "Mar 10, 2026", status: "Published", visibility: "Marketplace", featured: true, author: "Alex Rivera" },
  { id: "sec_mega_footer", name: "Mega Footer", slug: "mega-footer", category: "Footers", tags: ["navigation", "branding"], price: "$19.00", version: "v1.3.5", installs: "622", updatedAt: "Mar 8, 2026", status: "Draft", visibility: "Internal", featured: false, author: "Sarah Dean" },
  { id: "sec_newsletter_popup", name: "Newsletter Popup", slug: "newsletter-popup", category: "Popups", tags: ["conversion", "email-capture"], price: "$29.00", version: "v2.0.2", installs: "812", updatedAt: "Mar 5, 2026", status: "Published", visibility: "Marketplace", featured: false, author: "Nadia Khan" },
  { id: "sec_testimonials_slider", name: "Testimonials Slider", slug: "testimonials-slider", category: "Testimonials", tags: ["social-proof", "conversion"], price: "$0.00", version: "v1.0.0", installs: "2,104", updatedAt: "Mar 1, 2026", status: "Archived", visibility: "Hidden", featured: false, author: "Alex Rivera" },
];

export const bundles = [
  { id: "bun_conversion_starter", name: "Conversion Starter Pack", slug: "conversion-starter-pack", niche: "Conversion", accessType: "Bundle", visibility: "Marketplace", status: "Active", price: "$89.00", compareAtPrice: "$141.00", installs: "438", updatedAt: "Mar 11, 2026", savings: "37%", sections: ["Hero Banner Pro", "Newsletter Popup", "Upsell Product Strip"] },
  { id: "bun_storefront_essentials", name: "Storefront Essentials", slug: "storefront-essentials", niche: "Store Setup", accessType: "Subscription", visibility: "Private", status: "Draft", price: "$129.00", compareAtPrice: "$184.00", installs: "121", updatedAt: "Mar 9, 2026", savings: "29%", sections: ["Sticky Header v2", "Mega Footer", "Product Showcase Grid"] },
];

export const categories = [
  { name: "Headers", slug: "headers", count: 24, installs: "4.2k", updatedAt: "Mar 12", status: "Active", icon: "H" },
  { name: "Footers", slug: "footers", count: 9, installs: "1.1k", updatedAt: "Mar 7", status: "Active", icon: "F" },
  { name: "Product Sections", slug: "product-sections", count: 31, installs: "7.9k", updatedAt: "Mar 15", status: "Active", icon: "P" },
  { name: "Conversion Tools", slug: "conversion-tools", count: 18, installs: "3.8k", updatedAt: "Mar 14", status: "Featured", icon: "C" },
  { name: "Popups", slug: "popups", count: 12, installs: "1.9k", updatedAt: "Mar 10", status: "Active", icon: "U" },
  { name: "Testimonials", slug: "testimonials", count: 6, installs: "990", updatedAt: "Feb 28", status: "Inactive", icon: "T" },
];

export const tags = [
  { name: "upsell", slug: "upsell", color: "violet", usage: 18 },
  { name: "conversion", slug: "conversion", color: "success", usage: 26 },
  { name: "os2.0", slug: "os2-0", color: "info", usage: 15 },
  { name: "product-page", slug: "product-page", color: "warning", usage: 12 },
  { name: "announcement", slug: "announcement", color: "danger", usage: 7 },
  { name: "mobile-first", slug: "mobile-first", color: "default", usage: 9 },
];

export const recentActivity = [
  { actor: "Alex Rivera", action: "published", target: "Hero Banner Pro", time: "8m ago" },
  { actor: "Nadia Khan", action: "updated pricing on", target: "Newsletter Popup", time: "21m ago" },
  { actor: "Sarah Dean", action: "created bundle", target: "Storefront Essentials", time: "43m ago" },
  { actor: "System", action: "rotated API key for", target: "Webhook Sync", time: "1h ago" },
  { actor: "Alex Rivera", action: "archived", target: "Testimonials Slider", time: "2h ago" },
];

export const orders = [
  { number: "ORD-40291", customer: "Olive & Ivory", shop: "oliveandivory.co", amount: "$89.00", provider: "Stripe", status: "Paid", date: "Mar 15, 2026" },
  { number: "ORD-40277", customer: "Nord Studios", shop: "nordstudios.shop", amount: "$39.00", provider: "Stripe", status: "Paid", date: "Mar 15, 2026" },
  { number: "ORD-40264", customer: "Luma Home", shop: "lumahome.store", amount: "$129.00", provider: "Manual", status: "Pending", date: "Mar 14, 2026" },
  { number: "ORD-40231", customer: "Atelier Form", shop: "atelierform.com", amount: "$29.00", provider: "Stripe", status: "Refunded", date: "Mar 13, 2026" },
];

export const customers = [
  { name: "Olive & Ivory", email: "ops@oliveandivory.co", domain: "oliveandivory.co", spent: "$438", installs: 12, status: "Active" },
  { name: "Nord Studios", email: "team@nordstudios.shop", domain: "nordstudios.shop", spent: "$214", installs: 7, status: "Active" },
  { name: "Luma Home", email: "support@lumahome.store", domain: "lumahome.store", spent: "$129", installs: 3, status: "Trial" },
  { name: "Atelier Form", email: "owner@atelierform.com", domain: "atelierform.com", spent: "$89", installs: 2, status: "Churned" },
];

export const analyticsSummary = { totalSections: 86, totalInstalls: 12842, revenueMonth: "$24,380", activeShops: 318 };
export function getSectionById(id: string) { return sectionRows.find((section) => section.id === id) ?? sectionRows[0]; }
