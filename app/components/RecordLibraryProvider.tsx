"use client";

import { useCallback, type ReactNode } from "react";
import { useAppRuntime } from "../core/AppRuntimeContext";
import { t } from "../core/i18n";
import { CompletionContext, useCompletionStore } from "../hooks/useCompletionState";
import { RecordLibraryContext, useRecordLibraryState } from "../hooks/useRecordLibrary";

export function RecordLibraryProvider({ children }: { children: ReactNode }) {
  const { showToast, dayResetTime } = useAppRuntime();
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useRecordLibraryState(onError);
  const completions = useCompletionStore(onError, dayResetTime);
  return <RecordLibraryContext.Provider value={library}>
    <CompletionContext.Provider value={completions}>{children}</CompletionContext.Provider>
  </RecordLibraryContext.Provider>;
}
