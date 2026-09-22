import type { BookItem, DailyCompletion, DevotionalItem } from "./types";

export interface BackupPayload {
  entities: {
    dhikr: DevotionalItem[];
    prayers: DevotionalItem[];
    memorization: DevotionalItem[];
    books: BookItem[];
    poetry: DevotionalItem[];
  };
  completions: DailyCompletion[];
}

export interface BackupEnvelope {
  format: "zikirlerim-backup";
  schemaVersion: 1;
  exportedAt: string;
  checksum: string;
  payload: BackupPayload;
}

export type BackupSaveResult = "shared" | "downloaded" | "cancelled";
