import type { TranslationKey } from "./i18n";

export type ModuleId =
  | "prayers"
  | "books"
  | "memorization"
  | "dhikr"
  | "games";

export type IconName = "prayer" | "book" | "memory" | "dhikr" | "game";

export type TargetUnit = "count" | "page" | "minute" | "hour";

export interface ModuleDefinition {
  id: ModuleId;
  route: string;
  icon: IconName;
  enabled: boolean;
  supportsCreate: boolean;
  translationKey: TranslationKey;
}

export interface Dhikr {
  id: string;
  name: string | null;
  arabic: string | null;
  translation: string | null;
  details: string | null;
  targetCount: number | null;
  targetUnit: TargetUnit;
  listDisplay: "arabic" | "name";
  expandedArabicSize: 0 | 1 | 2 | 3 | 4;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DhikrDraft {
  name: string;
  arabic: string;
  translation: string;
  details: string;
  targetCount: string;
  targetUnit: TargetUnit;
  listDisplay: "arabic" | "name";
}

export interface DailyCompletion {
  key: string;
  itemType: ModuleId;
  itemId: string;
  localDate: string;
  completedAt: string;
}

export interface Preferences {
  id: "preferences";
  locale: "tr";
  themeMode: "dark";
  paletteId: "default";
}
