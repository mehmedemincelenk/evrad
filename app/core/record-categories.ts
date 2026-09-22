import type { DevotionalItem, DevotionalModuleId } from "./types";
import { getModule } from "./module-registry";

export type BagCategory = "dhikr" | "prayers" | "memorization" | "surahs" | "poetry";

export const bagCategories: BagCategory[] = ["dhikr", "prayers", "memorization", "surahs", "poetry"];

export function matchesBagCategory(item: Pick<DevotionalItem, "name" | "source" | "bagCategories">, category: BagCategory, moduleId: DevotionalModuleId): boolean {
  if (item.bagCategories?.length) return item.bagCategories.includes(category);
  if (category !== moduleId && !(category === "surahs" && moduleId === "memorization")) return false;
  const isSurah = /sûresi|suresi/i.test(item.name ?? "") || /sûresi|suresi/i.test(item.source ?? "");
  return category === "surahs" ? isSurah : category === "memorization" ? !isSurah : true;
}

export function getRecordIcon(item: Pick<DevotionalItem, "name" | "source" | "bagCategories">, moduleId: DevotionalModuleId) {
  const category = item.bagCategories?.[0];
  if (category === "surahs" || (!category && matchesBagCategory(item, "surahs", moduleId))) return "surah";
  return getModule(category ?? moduleId).icon;
}

export function getDefaultRecordCategory(item: Pick<DevotionalItem, "name" | "source" | "bagCategories">, moduleId: DevotionalModuleId) {
  return item.bagCategories?.[0] ?? bagCategories.find((category) => matchesBagCategory(item, category, moduleId));
}
