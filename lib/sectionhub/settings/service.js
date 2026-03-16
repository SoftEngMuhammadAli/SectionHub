import connectToDatabase from "@/lib/db";
import { ApiCredentialModel, SettingModel } from "@/lib/models";
export async function getSettingsData() {
    await connectToDatabase();
    const [settings, apiCredential] = await Promise.all([
        SettingModel.find().lean(),
        ApiCredentialModel.findOne().sort({ createdAt: -1 }).lean(),
    ]);
    const map = new Map(settings.map((item) => [item.key, JSON.parse(item.valueJson).value]));
    return {
        siteName: map.get("site_name") ?? "SectionHub Enterprise",
        defaultCurrency: map.get("default_currency") ?? "USD",
        maintenanceMode: Boolean(map.get("maintenance_mode")),
        siteLogo: map.get("site_logo") ?? "",
        apiCredential: apiCredential ? { clientId: apiCredential.clientId, status: apiCredential.status } : null,
    };
}
export async function updateSettings(input) {
    await connectToDatabase();
    const rows = [
        { key: "site_name", value: input.siteName },
        { key: "default_currency", value: input.defaultCurrency },
        { key: "maintenance_mode", value: input.maintenanceMode },
    ];
    for (const row of rows) {
        await SettingModel.findOneAndUpdate({ key: row.key }, {
            key: row.key,
            valueJson: JSON.stringify({ value: row.value }),
            updatedById: input.updatedById || undefined,
        }, { upsert: true, new: true });
    }
}
