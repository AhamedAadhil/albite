import { Settings } from "@/models/setting";

export async function getValueByKey(
  key: string
): Promise<{ value: string; updatedAt: Date } | null> {
  const setting = await Settings.findOne({ key }).exec();
  return setting
    ? { value: setting.value, updatedAt: setting.updatedAt }
    : null;
}
