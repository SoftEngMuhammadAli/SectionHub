import connectToDatabase from "@/lib/db";
import { ActivityLogModel } from "@/lib/models";
import { formatDate, toId } from "@/lib/sectionhub/shared/format";
export async function getActivityLogs() {
    await connectToDatabase();
    const logs = await ActivityLogModel.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    return logs.map((log) => ({
        id: toId(log._id),
        actor: log.actorName ?? (log.actorId ? "Admin" : "System"),
        action: log.action,
        target: log.entityLabel,
        entityType: log.entityType,
        createdAt: formatDate(log.createdAt),
        metadata: log.metadataJson,
    }));
}
export async function createActivityLog(input) {
    await connectToDatabase();
    await ActivityLogModel.create({
        actorId: input.actorId || undefined,
        actorName: input.actorName || undefined,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        entityLabel: input.entityLabel,
        metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
    });
}
