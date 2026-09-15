"use client";

import { useCallback, useState } from "react";
import { saveBackup } from "./backup-file";

export function useBackupExport(onError: () => void) {
  const [saving, setSaving] = useState(false);

  const exportBackup = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await saveBackup();
    } catch {
      onError();
    } finally {
      setSaving(false);
    }
  }, [onError, saving]);

  return { saving, exportBackup };
}
