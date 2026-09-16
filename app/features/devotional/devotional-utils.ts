import { createEntityMeta } from "../../core/entity";
import { targetFromDraft } from "../../core/target";
import type { DevotionalDraft, DevotionalItem, DevotionalModuleId } from "../../core/types";

export function getDevotionalDisplay(item: Pick<DevotionalItem, "name" | "arabic" | "listDisplay">): { text: string; arabic: boolean } {
  if (item.listDisplay === "name" && item.name) return { text: item.name, arabic: false };
  if (item.arabic) return { text: item.arabic, arabic: /[\u0600-\u06ff]/u.test(item.arabic) };
  return { text: item.name ?? "", arabic: false };
}

export function devotionalFromDraft(
  moduleId: DevotionalModuleId,
  draft: DevotionalDraft,
  existing: DevotionalItem | null,
  sortOrder: number,
): DevotionalItem {
  return {
    ...createEntityMeta(moduleId, sortOrder, existing),
    name: draft.name || null,
    arabic: draft.arabic || null,
    translation: draft.translation || null,
    details: draft.details || null,
    source: draft.source || null,
    ...targetFromDraft(draft),
    listDisplay: draft.listDisplay,
    expandedArabicSize: existing?.expandedArabicSize ?? 1,
    contexts: draft.contexts,
  };
}
