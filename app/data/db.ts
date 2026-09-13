import type { DailyCompletion, Dhikr, ModuleId, Preferences } from "../core/types";

const DB_NAME = "zikirlerim";
const DB_VERSION = 3;
const DHIKR_STORE = "dhikrs";
const COMPLETION_STORE = "completions";
const PREFERENCES_STORE = "preferences";

const defaultPreferences: Preferences = {
  id: "preferences",
  locale: "tr",
  themeMode: "dark",
  paletteId: "default",
};

export const seedDhikrs: Dhikr[] = [
  {
    id: "seed-subhanallah",
    name: "Sübhanallah",
    arabic: "سُبْحَانَ اللّٰهِ",
    translation: "Allah bütün noksan sıfatlardan uzaktır.",
    details: "Tesbih; kalbi gündelik telaştan uzaklaştırıp Allah’ın kusursuzluğunu hatırlamaya çağıran kısa ve derin bir zikirdir.",
    targetCount: 33,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "seed-alhamdulillah",
    name: "Elhamdülillah",
    arabic: "الْحَمْدُ لِلّٰهِ",
    translation: "Hamd Allah’a mahsustur.",
    details: "Şükür ve hamdi bir araya getiren bu ifade, görünen ve görünmeyen nimetleri fark etmeye vesile olur.",
    targetCount: 33,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:01.000Z",
    updatedAt: "2026-01-01T00:00:01.000Z",
  },
  {
    id: "seed-allahuakbar",
    name: "Allahu Ekber",
    arabic: "اللّٰهُ أَكْبَرُ",
    translation: "Allah en büyüktür.",
    details: null,
    targetCount: 33,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
    sortOrder: 2,
    createdAt: "2026-01-01T00:00:02.000Z",
    updatedAt: "2026-01-01T00:00:02.000Z",
  },
  {
    id: "seed-hasbunallah",
    name: "Hasbünallah",
    arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ",
    translation: "Allah bize yeter; O ne güzel vekildir.",
    details: "Kaygı ve belirsizlik anlarında güveni tazelemeyi, sonucu Allah’a teslim ederken gereken gayreti sürdürmeyi hatırlatır.",
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 1,
    sortOrder: 3,
    createdAt: "2026-01-01T00:00:03.000Z",
    updatedAt: "2026-01-01T00:00:03.000Z",
  },
];

let databasePromise: Promise<IDBDatabase> | null = null;

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
  });
}

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise;
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB unavailable"));

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(DHIKR_STORE)) {
        database.createObjectStore(DHIKR_STORE, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(COMPLETION_STORE)) {
        const store = database.createObjectStore(COMPLETION_STORE, { keyPath: "key" });
        store.createIndex("localDate", "localDate", { unique: false });
        store.createIndex("itemId", "itemId", { unique: false });
      }
      if (!database.objectStoreNames.contains(PREFERENCES_STORE)) {
        database.createObjectStore(PREFERENCES_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB unavailable"));
  });

  return databasePromise;
}

export async function loadDhikrs(): Promise<Dhikr[]> {
  const database = await openDatabase();
  const transaction = database.transaction([DHIKR_STORE, PREFERENCES_STORE], "readwrite");
  const dhikrStore = transaction.objectStore(DHIKR_STORE);
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

export async function saveDhikr(dhikr: Dhikr): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(DHIKR_STORE, "readwrite");
  transaction.objectStore(DHIKR_STORE).put(dhikr);
  await transactionDone(transaction);
}

export async function saveDhikrOrder(dhikrs: Dhikr[]): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(DHIKR_STORE, "readwrite");
  const store = transaction.objectStore(DHIKR_STORE);
  dhikrs.forEach((dhikr, sortOrder) => store.put({ ...dhikr, sortOrder }));
  await transactionDone(transaction);
}

export async function deleteDhikr(id: string): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction([DHIKR_STORE, COMPLETION_STORE], "readwrite");
  transaction.objectStore(DHIKR_STORE).delete(id);

  const completionStore = transaction.objectStore(COMPLETION_STORE);
  const cursorRequest = completionStore.index("itemId").openCursor(IDBKeyRange.only(id));
  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result;
    if (!cursor) return;
    cursor.delete();
    cursor.continue();
  };
  await transactionDone(transaction);
}

export async function loadCompletionIds(localDate: string): Promise<Set<string>> {
  const database = await openDatabase();
  const transaction = database.transaction(COMPLETION_STORE, "readonly");
  const request = transaction.objectStore(COMPLETION_STORE).index("localDate").getAll(localDate);
  const records = await requestResult(request as IDBRequest<DailyCompletion[]>);
  await transactionDone(transaction);
  return new Set(records.filter((record) => record.itemType === "dhikr").map((record) => record.itemId));
}

export async function setCompletion(
  itemType: ModuleId,
  itemId: string,
  localDate: string,
  completed: boolean,
): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(COMPLETION_STORE, "readwrite");
  const store = transaction.objectStore(COMPLETION_STORE);
  const key = `${itemType}:${itemId}:${localDate}`;

  if (completed) {
    const record: DailyCompletion = {
      key,
      itemType,
      itemId,
      localDate,
      completedAt: new Date().toISOString(),
    };
    store.put(record);
  } else {
    store.delete(key);
  }

  await transactionDone(transaction);
}
