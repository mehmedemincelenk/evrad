import type { BagCategory } from "./record-categories";
import type { DevotionalDraft, DevotionalItem } from "./types";

export function containsArabic(text: string): boolean {
  return /[\u0600-\u06ff]/u.test(text);
}

export function devotionalDraft(item: DevotionalItem | null, category?: BagCategory): DevotionalDraft {
  return {
    name: item?.name ?? "", arabic: item?.arabic ?? "", translation: item?.translation ?? "",
    details: item?.details ?? "", source: item?.source ?? "", targetCount: item?.targetCount?.toString() ?? "",
    targetUnit: item?.targetUnit ?? "count", targetUnitLabel: item?.targetUnitLabel ?? "",
    listDisplay: item?.listDisplay ?? "arabic", contexts: item?.contexts ?? [],
    bagCategories: item?.bagCategories ?? (category ? [category] : []),
  };
}

export function draftFromText(text: string, category: BagCategory = "dhikr"): DevotionalDraft {
  const trimmed = text.trim();
  const arabic = containsArabic(trimmed);
  return { ...devotionalDraft(null, category), name: arabic ? "" : trimmed,
    arabic: arabic ? trimmed : "", listDisplay: arabic ? "arabic" : "name", contexts: ["general"] };
}

export function trimDraft<T extends object>(draft: T): T {
  return Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])) as T;
}
