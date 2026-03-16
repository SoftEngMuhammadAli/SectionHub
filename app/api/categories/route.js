import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { CategoryModel, InstallEventModel, SectionModel } from "@/lib/models";
import { formatDate, toId } from "@/lib/sectionhub/shared/format";
export async function GET() {
    await connectToDatabase();
    const categories = await CategoryModel.find().sort({ sortOrder: 1 }).lean();
    const sections = await SectionModel.find().lean();
    const installs = await InstallEventModel.find({ status: "SUCCESS" }).lean();
    return NextResponse.json({
        items: categories.map((category) => {
            const scoped = sections.filter((section) => section.categoryId && toId(section.categoryId) === toId(category._id));
            const installTotal = installs.filter((install) => scoped.some((section) => toId(section._id) === toId(install.sectionId))).length;
            return {
                id: toId(category._id),
                name: category.name,
                slug: category.slug,
                description: category.description ?? "",
                icon: category.icon ?? "LayoutGrid",
                sectionCount: scoped.length,
                installs: installTotal,
                lastUpdated: formatDate(category.updatedAt),
                status: category.status,
                featured: category.featured,
                visibility: category.visibility,
                sortOrder: category.sortOrder,
            };
        }),
    });
}
