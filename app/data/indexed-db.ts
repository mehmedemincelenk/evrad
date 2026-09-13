import type { TrackableModuleId } from "../core/types";

const DB_NAME = "zikirlerim";
const DB_VERSION = 4;

export const ENTITY_STORES: Record<TrackableModuleId, string> = {
  dhikr: "dhikrs",
  prayers: "prayers",
  books: "books",
  memorization: "memorization",
};
export const COMPLETION_STORE = "completions";
export const PREFERENCES_STORE = "preferences";

let databasePromise: Promise<IDBDatabase> | null = null;

export function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

export function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
  });
}

export function getEntityStore(moduleId: TrackableModuleId): string {
  const storeName = ENTITY_STORES[moduleId];
  if (!storeName) throw new Error(`${moduleId} does not use trackable storage`);
  return storeName;
}

export function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise;
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB unavailable"));

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      Object.values(ENTITY_STORES).forEach((storeName) => {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: "id" });
        }
      });
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
