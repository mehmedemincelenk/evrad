import type { DevotionalItem } from "../../core/types";

export interface DailySelection {
  dhikr: DevotionalItem[];
  prayer: DevotionalItem | null;
  surah: DevotionalItem | null;
  poem: DevotionalItem | null;
}

export interface DailyLibraries {
  dhikr: DevotionalItem[];
  prayers: DevotionalItem[];
  memorization: DevotionalItem[];
  poetry: DevotionalItem[];
}

export interface StoredDailySelection {
  date: string;
  ids: {
    dhikr: string[];
    prayer: string | null;
    surah: string | null;
    poem: string | null;
  };
  signature: string;
}

export function createDailySelection(libraries: DailyLibraries, previousSignature = ""): DailySelection {
  let selection = pickSelection(libraries);
  for (let attempt = 0; attempt < 8 && selectionSignature(selection) === previousSignature; attempt += 1) {
    selection = pickSelection(libraries);
  }
  return selection;
}

export function serializeSelection(date: string, selection: DailySelection): StoredDailySelection {
  return {
    date,
    ids: {
      dhikr: selection.dhikr.map((item) => item.id),
      prayer: selection.prayer?.id ?? null,
      surah: selection.surah?.id ?? null,
      poem: selection.poem?.id ?? null,
    },
    signature: selectionSignature(selection),
  };
}

export function restoreSelection(stored: StoredDailySelection, libraries: DailyLibraries): DailySelection | null {
  const byId = (items: DevotionalItem[], id: string | null) => id ? items.find((item) => item.id === id) ?? null : null;
  const dhikr = stored.ids.dhikr.map((id) => byId(libraries.dhikr, id)).filter((item): item is DevotionalItem => Boolean(item));
  if (dhikr.length !== Math.min(5, libraries.dhikr.length)) return null;
  const selection = {
    dhikr,
    prayer: byId(libraries.prayers, stored.ids.prayer),
    surah: byId(libraries.memorization, stored.ids.surah),
    poem: byId(libraries.poetry, stored.ids.poem),
  };
  const expectedSingleCount = [libraries.prayers, libraries.memorization, libraries.poetry].filter((items) => items.length > 0).length;
  const actualSingleCount = [selection.prayer, selection.surah, selection.poem].filter(Boolean).length;
  return expectedSingleCount === actualSingleCount ? selection : null;
}

export function selectionSignature(selection: DailySelection): string {
  return [
    ...selection.dhikr.map((item) => item.id).sort(),
    selection.prayer?.id,
    selection.surah?.id,
    selection.poem?.id,
  ].filter(Boolean).join("|");
}

function pickSelection(libraries: DailyLibraries): DailySelection {
  return {
    dhikr: shuffled(libraries.dhikr).slice(0, 5),
    prayer: randomItem(libraries.prayers),
    surah: randomItem(libraries.memorization),
    poem: randomItem(libraries.poetry),
  };
}

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function randomItem<T>(items: readonly T[]): T | null {
  return items.length ? items[Math.floor(Math.random() * items.length)] : null;
}
