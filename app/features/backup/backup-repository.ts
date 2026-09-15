import type { BookItem, DailyCompletion, DevotionalItem, TrackableModuleId } from "../../core/types";
import { COMPLETION_STORE, ENTITY_STORES, requestResult, runTransaction } from "../../data/indexed-db";
import type { BackupPayload } from "./backup-types";

const moduleIds: TrackableModuleId[] = ["dhikr", "prayers", "memorization", "books", "poetry"];

export function readBackupPayload(): Promise<BackupPayload> {
  const storeNames = [...Object.values(ENTITY_STORES), COMPLETION_STORE];
  return runTransaction(storeNames, "readonly", async (transaction) => {
    const records = await Promise.all(moduleIds.map((moduleId) => (
      requestResult(transaction.objectStore(ENTITY_STORES[moduleId]).getAll())
    )));
    const completions = await requestResult(
      transaction.objectStore(COMPLETION_STORE).getAll() as IDBRequest<DailyCompletion[]>,
    );

    return {
      entities: {
        dhikr: records[0] as DevotionalItem[],
        prayers: records[1] as DevotionalItem[],
        memorization: records[2] as DevotionalItem[],
        books: records[3] as BookItem[],
        poetry: records[4] as DevotionalItem[],
      },
      completions,
    };
  });
}
