import { createEntityMeta } from "./entity";
import { targetFromDraft } from "./target";
import type { DevotionalDraft, DevotionalItem, DevotionalModuleId } from "./types";

export function devotionalContentFromDraft(draft: DevotionalDraft) {
  return {
    name: draft.name || null, arabic: draft.arabic || null,
    translation: draft.translation || null, details: draft.details || null,
    source: draft.source || null, ...targetFromDraft(draft),
    listDisplay: draft.listDisplay, contexts: draft.contexts, bagCategories: draft.bagCategories,
  };
}

export function getDevotionalDisplay(item: Pick<DevotionalItem, "name" | "arabic" | "listDisplay">): { text: string; arabic: boolean } {
  if (item.listDisplay === "name" && item.name) return { text: item.name, arabic: false };
  if (item.name && item.arabic && item.arabic.length > 50) {
    return { text: item.name, arabic: false };
  }
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
    ...devotionalContentFromDraft(draft),
    expandedArabicSize: existing?.expandedArabicSize ?? 1,
    contexts: draft.contexts,
    bagCategories: draft.bagCategories ?? existing?.bagCategories,
    inVirds: existing?.inVirds ?? false,
    liked: existing?.liked ?? true,
    virdSortOrder: existing?.virdSortOrder,
  };
}
