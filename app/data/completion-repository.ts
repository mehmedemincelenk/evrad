import type { DailyCompletion, TrackableModuleId } from "../core/types";
import { recordKey } from "../core/collections";
import { COMPLETION_STORE, requestResult, runTransaction } from "./indexed-db";

async function set(
  itemType: TrackableModuleId,
  itemId: string,
  localDate: string,
  completed: boolean,
): Promise<void> {
  return runTransaction(COMPLETION_STORE, "readwrite", (transaction) => {
    const store = transaction.objectStore(COMPLETION_STORE);
    const key = `${itemType}:${itemId}:${localDate}`;
    if (!completed) return void store.delete(key);
    store.put({ key, itemType, itemId, localDate, completedAt: new Date().toISOString() } satisfies DailyCompletion);
  });
}

export const completionRepository = {
  async loadKeys(localDate: string): Promise<Set<string>> {
    const records = await runTransaction(COMPLETION_STORE, "readonly", (transaction) => requestResult(
      transaction.objectStore(COMPLETION_STORE).index("localDate").getAll(localDate) as IDBRequest<DailyCompletion[]>,
    ));
    return new Set(records.map((record) => recordKey(record.itemType, record.itemId)));
  },
  set,
};
