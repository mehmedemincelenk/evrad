import type { TrackableModuleId } from "../core/types";
import type { TrackableEntity, TrackableRepository } from "../core/trackable";
import {
  COMPLETION_STORE,
  getEntityStore,
  openDatabase,
  requestResult,
  transactionDone,
} from "./indexed-db";

export async function loadTrackableItems<T extends TrackableEntity>(moduleId: TrackableModuleId): Promise<T[]> {
  const storeName = getEntityStore(moduleId);
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readonly");
  const records = await requestResult(transaction.objectStore(storeName).getAll() as IDBRequest<T[]>);
  await transactionDone(transaction);
  return records.sort((a, b) => a.sortOrder - b.sortOrder);
}

async function saveTrackableItem<T extends TrackableEntity>(moduleId: TrackableModuleId, item: T): Promise<void> {
  const storeName = getEntityStore(moduleId);
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readwrite");
  transaction.objectStore(storeName).put(item);
  await transactionDone(transaction);
}

async function saveTrackableOrder<T extends TrackableEntity>(moduleId: TrackableModuleId, items: T[]): Promise<void> {
  const storeName = getEntityStore(moduleId);
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  items.forEach((item, sortOrder) => store.put({ ...item, sortOrder }));
  await transactionDone(transaction);
}

async function deleteTrackableItem(moduleId: TrackableModuleId, id: string): Promise<void> {
  const storeName = getEntityStore(moduleId);
  const database = await openDatabase();
  const transaction = database.transaction([storeName, COMPLETION_STORE], "readwrite");
  transaction.objectStore(storeName).delete(id);

  const cursorRequest = transaction.objectStore(COMPLETION_STORE).index("itemId").openCursor(IDBKeyRange.only(id));
  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result;
    if (!cursor) return;
    if (cursor.value.itemType === moduleId) cursor.delete();
    cursor.continue();
  };
  await transactionDone(transaction);
}

interface RepositoryOptions<T> {
  load?: () => Promise<T[]>;
}

export function createTrackableRepository<T extends TrackableEntity>(
  moduleId: TrackableModuleId,
  options: RepositoryOptions<T> = {},
): TrackableRepository<T> {
  return {
    moduleId,
    load: options.load ?? (() => loadTrackableItems<T>(moduleId)),
    save: (item) => saveTrackableItem(moduleId, item),
    saveOrder: (items) => saveTrackableOrder(moduleId, items),
    delete: (id) => deleteTrackableItem(moduleId, id),
  };
}
