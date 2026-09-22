import { trackableModuleIds } from "../core/module-registry";
import type { DailyCompletion } from "../core/types";
import type { BackupPayload } from "../core/backup";
import { COMPLETION_STORE, ENTITY_STORES, requestResult, runTransaction } from "./indexed-db";

export function readBackupPayload(): Promise<BackupPayload> {
  return runTransaction([...Object.values(ENTITY_STORES), COMPLETION_STORE], "readonly", async (transaction) => {
    const [entries, completions] = await Promise.all([
      Promise.all(trackableModuleIds.map(async (id) => [
        id, await requestResult(transaction.objectStore(ENTITY_STORES[id]).getAll()),
      ])),
      requestResult(transaction.objectStore(COMPLETION_STORE).getAll() as IDBRequest<DailyCompletion[]>),
    ]);
    return { entities: Object.fromEntries(entries) as BackupPayload["entities"], completions };
  });
}
