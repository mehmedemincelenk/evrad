import type { TranslationKey } from "./i18n";

export type TrackableModuleId = "prayers" | "books" | "memorization" | "dhikr" | "poetry";
export type DevotionalModuleId = Exclude<TrackableModuleId, "books">;
export type IconName = "prayer" | "book" | "memory" | "surah" | "dhikr" | "poetry" | "bag" | "game";
export type TargetUnit = "count" | "custom";
export type ArabicFontLevel = 0 | 1 | 2 | 3 | 4;
export type DevotionalContext =
  | "beforePrayer"
  | "afterPrayer"
  | "morning"
  | "gratitude"
  | "forgiveness"
  | "protection"
  | "relief";

interface ModuleCopy {
  menu: TranslationKey;
  title: TranslationKey;
  eyebrow: TranslationKey;
  tagline: TranslationKey;
  discoverTitle: TranslationKey;
}

interface TrackableModuleCopy extends ModuleCopy {
  singular: TranslationKey;
}

interface ModuleBase {
  route: string;
  discoverRoute: string;
  icon: IconName;
}

export interface ModuleCreation {
  route: string;
  label: TranslationKey;
}

export type TrackableModuleDefinition = ModuleBase & {
  id: TrackableModuleId;
  storeName: string;
  kind: "devotional" | "books";
  copy: TrackableModuleCopy;
  create: ModuleCreation;
};

export interface TrackableEntity {
  id: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type EntityTemplate<T extends TrackableEntity> = Omit<T, keyof TrackableEntity> & Pick<T, "id">;

export interface TrackableRepository<T extends TrackableEntity> {
  moduleId: TrackableModuleId;
  load: () => Promise<T[]>;
  save: (item: T) => Promise<void>;
  saveOrder: (items: T[]) => Promise<void>;
  remove: (id: string, remainingItems: T[]) => Promise<void>;
}

export interface TargetDraft {
  targetCount: string;
  targetUnit: TargetUnit;
  targetUnitLabel: string;
}

export interface DevotionalItem extends TrackableEntity {
  name: string | null;
  arabic: string | null;
  translation: string | null;
  details: string | null;
  source: string | null;
  targetCount: number | null;
  targetUnit: TargetUnit;
  targetUnitLabel: string | null;
  listDisplay: "arabic" | "name";
  expandedArabicSize: ArabicFontLevel;
  contexts: DevotionalContext[];
  bagCategories?: Array<"dhikr" | "prayers" | "memorization" | "surahs" | "poetry">;
  /** Virdlerim ve Beğenilenler birbirinden bağımsız koleksiyonlardır. */
  inVirds?: boolean;
  /** Eski kayıtlarda yoksa beğenilmiş kabul edilir. */
  liked?: boolean;
  virdSortOrder?: number;
}

export interface DevotionalDraft extends TargetDraft {
  name: string;
  arabic: string;
  translation: string;
  details: string;
  source: string;
  listDisplay: "arabic" | "name";
  contexts: DevotionalContext[];
  bagCategories?: Array<"dhikr" | "prayers" | "memorization" | "surahs" | "poetry">;
}

export interface BookItem extends TrackableEntity {
  title: string;
  author: string | null;
  details: string | null;
  targetCount: number | null;
  targetUnit: TargetUnit;
  targetUnitLabel: string | null;
}

export interface BookDraft extends TargetDraft {
  title: string;
  author: string;
  details: string;
}

export interface DailyCompletion {
  key: string;
  itemType: TrackableModuleId;
  itemId: string;
  localDate: string;
  completedAt: string;
}
