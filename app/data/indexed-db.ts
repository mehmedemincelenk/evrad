import type { TrackableModuleId } from "../core/types";

const DB_NAME = "zikirlerim";
const DB_VERSION = 7;

export const ENTITY_STORES: Record<TrackableModuleId, string> = {
  dhikr: "dhikrs",
  prayers: "prayers",
  books: "books",
  memorization: "memorization",
  poetry: "poetry",
};
export const COMPLETION_STORE = "completions";

let databasePromise: Promise<IDBDatabase> | null = null;
const BLOCKED_TIMEOUT_MS = 2500;

export function requestResult<T>(request: IDBRequest<T>): Promise<T> {
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

export async function runTransaction<T>(
  stores: string | string[],
  mode: IDBTransactionMode,
  operation: (transaction: IDBTransaction) => T | Promise<T>,
): Promise<T> {
  const database = await openDatabase();
  const transaction = database.transaction(stores, mode);
  const done = transactionDone(transaction);
  const [result] = await Promise.all([Promise.resolve().then(() => operation(transaction)), done]);
  return result;
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
    let settled = false;
    let blockedTimeout: number | undefined;
    request.onupgradeneeded = (event) => {
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
      if (event.oldVersion > 0 && event.oldVersion < 5 && request.transaction) {
        request.transaction.objectStore(ENTITY_STORES.dhikr).clear();
        const cursorRequest = request.transaction.objectStore(COMPLETION_STORE).openCursor();
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result;
          if (!cursor) return;
          if (cursor.value.itemType === "dhikr") cursor.delete();
          cursor.continue();
        };
      }
      if (event.oldVersion > 0 && event.oldVersion < 7 && request.transaction) {
        const dhikrStore = request.transaction.objectStore(ENTITY_STORES.dhikr);
        const cursorRequest = dhikrStore.openCursor();
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result;
          if (!cursor) return;
          cursor.update({ ...cursor.value, inVirds: true, virdSortOrder: cursor.value.sortOrder });
          cursor.continue();
        };
      }
    };
    request.onblocked = () => {
      blockedTimeout = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        databasePromise = null;
        reject(new Error("IndexedDB upgrade blocked by another open app window"));
      }, BLOCKED_TIMEOUT_MS);
    };
    request.onsuccess = () => {
      if (blockedTimeout !== undefined) window.clearTimeout(blockedTimeout);
      const database = request.result;
      if (settled) {
        database.close();
        return;
      }
      settled = true;
      database.onversionchange = () => {
        database.close();
        databasePromise = null;
      };
      database.onclose = () => { databasePromise = null; };
      resolve(database);
    };
    request.onerror = () => {
      if (blockedTimeout !== undefined) window.clearTimeout(blockedTimeout);
      settled = true;
      databasePromise = null;
      reject(request.error ?? new Error("IndexedDB unavailable"));
    };
  });

  return databasePromise;
}
