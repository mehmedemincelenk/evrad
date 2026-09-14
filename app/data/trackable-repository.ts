import { normalizeOrder } from "../core/sort";
import type { TrackableEntity, TrackableModuleId, TrackableRepository } from "../core/types";
import { COMPLETION_STORE, getEntityStore, requestResult, runTransaction } from "./indexed-db";

export async function loadTrackableItems<T extends TrackableEntity>(moduleId: TrackableModuleId): Promise<T[]> {
  const storeName = getEntityStore(moduleId);
  const records = await runTransaction(storeName, "readonly", (transaction) => (
    requestResult(transaction.objectStore(storeName).getAll() as IDBRequest<T[]>)
  ));
  return records.sort((a, b) => a.sortOrder - b.sortOrder);
}

async function saveTrackableItem<T extends TrackableEntity>(moduleId: TrackableModuleId, item: T): Promise<void> {
  const storeName = getEntityStore(moduleId);
  return runTransaction(storeName, "readwrite", (transaction) => void transaction.objectStore(storeName).put(item));
}

async function saveTrackableOrder<T extends TrackableEntity>(moduleId: TrackableModuleId, items: T[]): Promise<void> {
  const storeName = getEntityStore(moduleId);
  return runTransaction(storeName, "readwrite", (transaction) => {
    const store = transaction.objectStore(storeName);
    normalizeOrder(items).forEach((item) => store.put(item));
  });
}

async function removeTrackableItem<T extends TrackableEntity>(moduleId: TrackableModuleId, id: string, remainingItems: T[]): Promise<void> {
  const storeName = getEntityStore(moduleId);
  return runTransaction([storeName, COMPLETION_STORE], "readwrite", (transaction) => {
    const entityStore = transaction.objectStore(storeName);
    entityStore.delete(id);
    normalizeOrder(remainingItems).forEach((item) => entityStore.put(item));

    const cursorRequest = transaction.objectStore(COMPLETION_STORE).index("itemId").openCursor(IDBKeyRange.only(id));
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) return;
      if (cursor.value.itemType === moduleId) cursor.delete();
      cursor.continue();
    };
  });
}

export function createTrackableRepository<T extends TrackableEntity>(
  moduleId: TrackableModuleId,
): TrackableRepository<T> {
  return {
    moduleId,
    load: () => loadTrackableItems<T>(moduleId),
    save: (item) => saveTrackableItem(moduleId, item),
    saveOrder: (items) => saveTrackableOrder(moduleId, items),
    remove: (id, remainingItems) => removeTrackableItem(moduleId, id, remainingItems),
  };
}
