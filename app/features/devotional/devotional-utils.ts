import { createEntityId } from "../../core/id";
import type { DevotionalDraft, DevotionalItem, DevotionalModuleId } from "../../core/types";

export function getDevotionalDisplay(item: DevotionalItem): { text: string; arabic: boolean } {
  if (item.listDisplay === "name" && item.name) return { text: item.name, arabic: false };
  if (item.arabic) return { text: item.arabic, arabic: true };
  return { text: item.name ?? "", arabic: false };
}

export function devotionalFromDraft(
  moduleId: DevotionalModuleId,
  draft: DevotionalDraft,
  existing: DevotionalItem | null,
  sortOrder: number,
): DevotionalItem {
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? createEntityId(moduleId),
    name: draft.name || null,
    arabic: draft.arabic || null,
    translation: draft.translation || null,
    details: draft.details || null,
    targetCount: draft.targetCount ? Number(draft.targetCount) : null,
    targetUnit: draft.targetUnit,
    targetUnitLabel: draft.targetUnit === "custom" ? draft.targetUnitLabel : null,
    listDisplay: draft.listDisplay,
    expandedArabicSize: existing?.expandedArabicSize ?? 1,
    sortOrder: existing?.sortOrder ?? sortOrder,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
