"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, issuePasswordReset, loginWithPassword, logout, resetPassword, } from "@/lib/auth/server";
import { createActivityLog } from "@/lib/sectionhub/activity/service";
import { upsertBundle } from "@/lib/sectionhub/bundles/service";
import { upsertCategory } from "@/lib/sectionhub/categories/service";
import { createOrUpdateSection, publishSection, } from "@/lib/sectionhub/sections/service";
import { createApiCredential, regenerateApiCredentialSecret, runDatabaseMaintenance, updateSettings, } from "@/lib/sectionhub/settings/service";
import { upsertTag } from "@/lib/sectionhub/tags/service";
function asBool(value) {
    return value === "on" || value === "true";
}
export async function loginAction(formData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const result = await loginWithPassword(email, password);
    if (!result.ok)
        redirect(`/login?error=${encodeURIComponent(result.error)}`);
    redirect("/dashboard");
}
export async function loginActionState(_, formData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const result = await loginWithPassword(email, password);
    if (!result.ok) {
        return { error: result.error };
    }
    redirect("/dashboard");
}
export async function logoutAction() {
    await logout();
    redirect("/login");
}
export async function forgotPasswordAction(formData) {
    const email = String(formData.get("email") ?? "").trim();
    const result = await issuePasswordReset(email);
    redirect(`/forgot-password?sent=1${result.token ? `&token=${result.token}` : ""}`);
}
export async function resetPasswordAction(formData) {
    const token = String(formData.get("token") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    if (password.length < 8 || password !== confirmPassword)
        redirect("/reset-password?error=Password+validation+failed");
    const result = await resetPassword(token, password);
    if (!result.ok)
        redirect(`/reset-password?error=${encodeURIComponent(result.error)}`);
    redirect("/reset-password?success=1");
}
export async function saveCategoryAction(formData) {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    const category = await upsertCategory({
        id: String(formData.get("id") || "") || undefined,
        name: String(formData.get("name") || ""),
        slug: String(formData.get("slug") || ""),
        description: String(formData.get("description") || ""),
        icon: String(formData.get("icon") || "LayoutGrid"),
        sortOrder: Number(formData.get("sortOrder") || 0),
        visibility: String(formData.get("visibility") || "MARKETPLACE"),
        featured: asBool(formData.get("featured")),
        status: String(formData.get("status") || "Active"),
    });
    await createActivityLog({
        actorId: String(user._id),
        actorName: user.name,
        action: category?.createdAt?.getTime?.() === category?.updatedAt?.getTime?.()
            ? "created"
            : "updated",
        entityType: "category",
        entityId: String(category?._id),
        entityLabel: category?.name ?? "Category",
    });
    revalidatePath("/categories");
    redirect("/categories?saved=1");
}
export async function saveTagAction(formData) {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    const tag = await upsertTag({
        id: String(formData.get("id") || "") || undefined,
        name: String(formData.get("name") || ""),
        slug: String(formData.get("slug") || ""),
        color: String(formData.get("color") || "violet"),
    });
    await createActivityLog({
        actorId: String(user._id),
        actorName: user.name,
        action: "saved",
        entityType: "tag",
        entityId: String(tag?._id),
        entityLabel: tag?.name ?? "Tag",
    });
    revalidatePath("/tags");
    redirect("/tags?saved=1");
}
export async function saveBundleAction(formData) {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    const sectionIds = String(formData.get("sectionIds") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    const bundle = await upsertBundle({
        id: String(formData.get("id") || "") || undefined,
        name: String(formData.get("name") || ""),
        slug: String(formData.get("slug") || ""),
        shortDescription: String(formData.get("shortDescription") || ""),
        niche: String(formData.get("niche") || ""),
        accessType: String(formData.get("accessType") || "BUNDLE"),
        visibility: String(formData.get("visibility") || "MARKETPLACE"),
        status: String(formData.get("status") || "DRAFT"),
        priceCents: Math.round(Number(formData.get("price") || 0) * 100),
        compareAtPriceCents: Math.round(Number(formData.get("compareAtPrice") || 0) * 100),
        sectionIds,
    });
    if (bundle)
        await createActivityLog({
            actorId: String(user._id),
            actorName: user.name,
            action: "saved",
            entityType: "bundle",
            entityId: String(bundle._id),
            entityLabel: bundle.name,
        });
    revalidatePath("/bundles");
    redirect("/bundles?saved=1");
}
export async function saveSettingsAction(formData) {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    await updateSettings({
        siteName: String(formData.get("siteName") || "SectionHub Enterprise"),
        defaultCurrency: String(formData.get("defaultCurrency") || "USD"),
        maintenanceMode: asBool(formData.get("maintenanceMode")),
        siteLogo: String(formData.get("siteLogo") || ""),
        updatedById: String(user._id),
    });
    await createActivityLog({
        actorId: String(user._id),
        actorName: user.name,
        action: "updated",
        entityType: "setting",
        entityId: "global",
        entityLabel: "System Settings",
    });
    revalidatePath("/settings");
    redirect("/settings?saved=1");
}
export async function createApiCredentialAction() {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    const credential = await createApiCredential({ updatedById: String(user._id) });
    await createActivityLog({
        actorId: String(user._id),
        actorName: user.name,
        action: "created",
        entityType: "api_credential",
        entityId: String(credential?.id ?? "api-key"),
        entityLabel: "API Credential",
        metadata: { clientId: credential?.clientId ?? "" },
    });
    revalidatePath("/settings");
    redirect("/settings?keyCreated=1");
}
export async function regenerateApiCredentialAction(formData) {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    const id = String(formData.get("id") || "");
    if (!id)
        redirect("/settings");
    const credential = await regenerateApiCredentialSecret(id);
    await createActivityLog({
        actorId: String(user._id),
        actorName: user.name,
        action: "regenerated",
        entityType: "api_credential",
        entityId: id,
        entityLabel: "API Credential",
        metadata: { clientId: credential.clientId },
    });
    revalidatePath("/settings");
    redirect("/settings?keyRotated=1");
}
export async function runDatabaseMaintenanceAction() {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    const result = await runDatabaseMaintenance();
    await createActivityLog({
        actorId: String(user._id),
        actorName: user.name,
        action: "optimized",
        entityType: "database",
        entityId: "maintenance",
        entityLabel: "Database Maintenance",
        metadata: result,
    });
    revalidatePath("/settings");
    redirect("/settings?maintenanceRun=1");
}
export async function saveSectionAction(formData) {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    const id = String(formData.get("id") || "") || undefined;
    const tagIds = String(formData.get("tagIds") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    const previewUrl = String(formData.get("previewUrl") || "").trim();
    const section = await createOrUpdateSection({
        id,
        name: String(formData.get("name") || ""),
        slug: String(formData.get("slug") || ""),
        shortDescription: String(formData.get("shortDescription") || ""),
        fullDescription: String(formData.get("fullDescription") || ""),
        categoryId: String(formData.get("categoryId") || "") || null,
        subcategory: String(formData.get("subcategory") || ""),
        status: String(formData.get("status") || "DRAFT"),
        visibility: String(formData.get("visibility") || "INTERNAL"),
        featured: asBool(formData.get("featured")),
        pricingType: String(formData.get("pricingType") || "PAID"),
        priceCents: Math.round(Number(formData.get("price") || 0) * 100),
        compareAtPriceCents: Math.round(Number(formData.get("compareAtPrice") || 0) * 100) || null,
        accessType: String(formData.get("accessType") || "SINGLE"),
        licenseType: String(formData.get("licenseType") || "SINGLE_STORE"),
        authorId: String(user._id),
        version: String(formData.get("version") || "v1.0.0"),
        changelog: String(formData.get("changelog") || ""),
        metaTitle: String(formData.get("metaTitle") || ""),
        metaDescription: String(formData.get("metaDescription") || ""),
        internalKeywords: String(formData.get("internalKeywords") || ""),
        marketplaceSubtitle: String(formData.get("marketplaceSubtitle") || ""),
        calloutBadgeText: String(formData.get("calloutBadgeText") || ""),
        installationSteps: String(formData.get("installationSteps") || ""),
        usageNotes: String(formData.get("usageNotes") || ""),
        merchantInstructions: String(formData.get("merchantInstructions") || ""),
        supportNotes: String(formData.get("supportNotes") || ""),
        compatibilityTheme: String(formData.get("compatibilityTheme") || ""),
        os20Compatible: asBool(formData.get("os20Compatible")),
        appBlockSupport: asBool(formData.get("appBlockSupport")),
        dependencies: String(formData.get("dependencies") || ""),
        testedEnvironments: String(formData.get("testedEnvironments") || ""),
        tagIds,
        previews: previewUrl
            ? [
                {
                    type: "IMAGE",
                    url: previewUrl,
                    title: String(formData.get("name") || "Preview"),
                    altText: String(formData.get("name") || "Preview"),
                    isThumbnail: true,
                    sortOrder: 1,
                },
            ]
            : [],
    });
    await createActivityLog({
        actorId: String(user._id),
        actorName: user.name,
        action: id ? "updated" : "created",
        entityType: "section",
        entityId: String(section?._id),
        entityLabel: section?.name ?? "Section",
    });
    revalidatePath("/sections");
    redirect(`/sections/${section?._id}/edit?saved=1`);
}
export async function publishSectionAction(formData) {
    const user = await getCurrentUser();
    if (!user)
        redirect("/login");
    const id = String(formData.get("id") || "");
    const section = await publishSection(id);
    await createActivityLog({
        actorId: String(user._id),
        actorName: user.name,
        action: "published",
        entityType: "section",
        entityId: String(section?._id),
        entityLabel: section?.name ?? "Section",
    });
    revalidatePath("/sections");
    redirect(`/sections/${section?._id}/edit?published=1`);
}
