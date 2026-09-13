import type { DailyCompletion, ModuleId } from "../core/types";
import { COMPLETION_STORE, openDatabase, requestResult, transactionDone } from "./indexed-db";

async function loadIds(itemType: ModuleId, localDate: string): Promise<Set<string>> {
  const database = await openDatabase();
  const transaction = database.transaction(COMPLETION_STORE, "readonly");
  const done = transactionDone(transaction);
  const request = transaction.objectStore(COMPLETION_STORE).index("localDate").getAll(localDate);
  const records = await requestResult(request as IDBRequest<DailyCompletion[]>);
  await done;
  return new Set(records.filter((record) => record.itemType === itemType).map((record) => record.itemId));
}

async function set(
  itemType: ModuleId,
  itemId: string,
  localDate: string,
  completed: boolean,
): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(COMPLETION_STORE, "readwrite");
  const done = transactionDone(transaction);
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
  await done;
}

export const completionRepository = {
  loadIds,
  set,
};
