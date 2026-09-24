"use client";

import { useAppRuntime } from "../../core/AppRuntimeContext";
import { t } from "../../core/i18n";
import type { DevotionalDraft } from "../../core/types";
import { useRecordLibrary } from "../../hooks/useRecordLibrary";

export function useCreateRecord() {
  const { create } = useRecordLibrary();
  const { showToast } = useAppRuntime();
  return async (draft: DevotionalDraft) => {
    if (!await create(draft)) throw new Error("Record could not be saved");
    showToast(t("quickAdd.savedToast"));
  };
}
