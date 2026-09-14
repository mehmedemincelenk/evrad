import type { TranslationKey } from "./i18n";
import type { TrackableEntity } from "./trackable";

export type ModuleId =
  | "prayers"
  | "books"
  | "memorization"
  | "dhikr"
  | "games";

export type TrackableModuleId = Exclude<ModuleId, "games">;
export type DevotionalModuleId = Extract<ModuleId, "dhikr" | "prayers" | "memorization">;
export type ContentSpace = "library" | "discover";

export type IconName = "prayer" | "book" | "memory" | "dhikr" | "game";

export type TargetUnit = "count" | "custom";

export interface ModuleDefinition {
  id: ModuleId;
  route: string;
  discoverRoute: string;
  icon: IconName;
  enabled: boolean;
  supportsCreate: boolean;
  createRoute: string | null;
  createTranslationKey: TranslationKey | null;
  translationKey: TranslationKey;
}

export interface DevotionalItem extends TrackableEntity {
  name: string | null;
  arabic: string | null;
  translation: string | null;
  details: string | null;
  targetCount: number | null;
  targetUnit: TargetUnit;
  targetUnitLabel: string | null;
  listDisplay: "arabic" | "name";
  expandedArabicSize: 0 | 1 | 2 | 3 | 4;
}

export interface DevotionalDraft {
  name: string;
  arabic: string;
  translation: string;
  details: string;
  targetCount: string;
  targetUnit: TargetUnit;
  targetUnitLabel: string;
  listDisplay: "arabic" | "name";
}

export type Dhikr = DevotionalItem;
export type DhikrDraft = DevotionalDraft;

export interface BookItem extends TrackableEntity {
  title: string;
  author: string | null;
  details: string | null;
  targetCount: number | null;
  targetUnit: TargetUnit;
  targetUnitLabel: string | null;
}

export interface BookDraft {
  title: string;
  author: string;
  details: string;
  targetCount: string;
  targetUnit: TargetUnit;
  targetUnitLabel: string;
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
