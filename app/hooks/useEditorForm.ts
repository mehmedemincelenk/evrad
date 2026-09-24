"use client";

import { useState, type FormEvent } from "react";
import { trimDraft } from "../core/devotional-draft";
import { t, type TranslationKey } from "../core/i18n";
import { useAsyncAction } from "./useAsyncAction";

export function useEditorForm<T extends object>(initial: T, validate: (draft: T) => TranslationKey | null, onSave: (draft: T) => Promise<void>) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const { pending: saving, run } = useAsyncAction();
  const update = (patch: Partial<T>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
  };
  const submit = (event: FormEvent, close: () => void) => {
    event.preventDefault();
    const clean = trimDraft(draft);
    const invalid = validate(clean);
    if (invalid) return setError(t(invalid));
    void run(async () => { await onSave(clean); close(); })
      .catch(() => setError(t("toast.storageError")));
  };
  return { draft, update, error, saving, submit };
}
