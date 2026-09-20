import type { DevotionalItem, DevotionalModuleId } from "../../core/types";

export type BagCategory = "dhikr" | "prayers" | "memorization" | "surahs" | "poetry";

export const bagCategories: BagCategory[] = ["dhikr", "prayers", "memorization", "surahs", "poetry"];

export function bagCategoryModule(category: BagCategory): DevotionalModuleId {
  return category === "surahs" ? "memorization" : category;
}

export function matchesBagCategory(item: Pick<DevotionalItem, "name" | "source">, category: BagCategory): boolean {
  const isSurah = /sûresi|suresi/i.test(item.name ?? "") || /sûresi|suresi/i.test(item.source ?? "");
  return category === "surahs" ? isSurah : category === "memorization" ? !isSurah : true;
}
