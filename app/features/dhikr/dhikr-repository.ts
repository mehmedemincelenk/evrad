import type { Dhikr, Preferences } from "../../core/types";
import { ENTITY_STORES, openDatabase, PREFERENCES_STORE, requestResult, transactionDone } from "../../data/indexed-db";
import { createTrackableRepository } from "../../data/trackable-repository";
import { seedDhikrs } from "../../data/seeds/dhikr";

const defaultPreferences: Preferences = {
  id: "preferences",
  locale: "tr",
  themeMode: "dark",
  paletteId: "default",
};

async function loadDhikrs(): Promise<Dhikr[]> {
  const database = await openDatabase();
  const transaction = database.transaction([ENTITY_STORES.dhikr, PREFERENCES_STORE], "readwrite");
  const dhikrStore = transaction.objectStore(ENTITY_STORES.dhikr);
  const preferencesStore = transaction.objectStore(PREFERENCES_STORE);
  const [existing, preferences] = await Promise.all([
    requestResult(dhikrStore.getAll() as IDBRequest<Dhikr[]>),
    requestResult(preferencesStore.get("preferences") as IDBRequest<Preferences | undefined>),
  ]);

  if (existing.length === 0 && !preferences) {
    seedDhikrs.forEach((dhikr) => dhikrStore.put(dhikr));
    preferencesStore.put(defaultPreferences);
    await transactionDone(transaction);
    return seedDhikrs.map((dhikr) => ({ ...dhikr }));
  }

  const normalized = existing.map((dhikr) => {
    const legacyUnit = dhikr.targetUnit as string | undefined;
    const legacyLabels: Record<string, string> = { page: "sayfa", minute: "dakika", hour: "saat" };
    return {
      ...dhikr,
      targetUnit: legacyUnit && legacyUnit !== "count" ? "custom" as const : "count" as const,
      targetUnitLabel: legacyUnit && legacyUnit !== "count"
        ? dhikr.targetUnitLabel ?? legacyLabels[legacyUnit] ?? null
        : null,
    };
  });
  existing.forEach((dhikr, index) => {
    if (dhikr.targetUnit !== normalized[index].targetUnit || dhikr.targetUnitLabel !== normalized[index].targetUnitLabel) {
      dhikrStore.put(normalized[index]);
    }
  });
  await transactionDone(transaction);
  return normalized.sort((a, b) => a.sortOrder - b.sortOrder);
}

export const dhikrRepository = createTrackableRepository<Dhikr>("dhikr", { load: loadDhikrs });
