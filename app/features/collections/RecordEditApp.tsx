"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../AppShell";
import { StorageLoading } from "../../components/StorageLoading";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { devotionalContentFromDraft } from "../../core/devotional";
import { getSectionRoute } from "../../core/module-registry";
import { getDefaultRecordCategory } from "../../core/record-categories";
import { t } from "../../core/i18n";
import type { DevotionalDraft, DevotionalModuleId } from "../../core/types";
import { collectionRepository } from "../../data/collection-repository";
import { useRecordLibrary } from "../../hooks/useRecordLibrary";
import { DevotionalEditor } from "../devotional/DevotionalEditor";

export function RecordEditApp({ moduleId, itemId }: { moduleId: DevotionalModuleId; itemId: string }) {
  return <AppShell section="favorites"><RecordEditScreen moduleId={moduleId} itemId={itemId} /></AppShell>;
}

function RecordEditScreen({ moduleId, itemId }: { moduleId: DevotionalModuleId; itemId: string }) {
  const router = useRouter();
  const { showToast } = useAppRuntime();
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useRecordLibrary(onError);
  const entry = library.entries.find((entry) => entry.moduleId === moduleId && entry.itemId === itemId);
  const close = () => router.replace(getSectionRoute("favorites"));
  const save = async (draft: DevotionalDraft) => {
    const saved = await library.mutate(async () => { await collectionRepository.patch({ moduleId, itemId }, devotionalContentFromDraft(draft)); });
    if (!saved) throw new Error("Record could not be saved");
    close();
  };
  if (!library.ready) return <StorageLoading label={t("loading.generic", { module: t("bag.record") })} />;
  if (!entry || library.failed) return <section className="module-screen"><p role="alert">{t(library.failed ? "toast.storageError" : "editor.notFoundGeneric", { item: t("bag.record") })}</p><button className="secondary-button" onClick={close}>{t("action.cancel")}</button></section>;
  return <DevotionalEditor item={entry.item} itemLabel={t("bag.record")} defaultCategory={getDefaultRecordCategory(entry.item, moduleId)} onClose={close} onSave={save} />;
}
