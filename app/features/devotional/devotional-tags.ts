import { t } from "../../core/i18n";
import type { DevotionalItem, DevotionalModuleId } from "../../core/types";

export function getDevotionalTags(moduleId: DevotionalModuleId, item: Pick<DevotionalItem, "name" | "source" | "contexts">): string[] {
  const type = moduleId === "dhikr"
    ? t("bag.dhikr")
    : moduleId === "prayers"
      ? t("bag.prayers")
      : moduleId === "poetry"
        ? t("bag.poetry")
        : /sûresi|suresi/i.test(item.name ?? "") || /sûresi|suresi/i.test(item.source ?? "")
          ? t("bag.surahs")
          : t("bag.memorization");
  return [type, ...item.contexts.map((context) => t(`context.${context}`))];
}
