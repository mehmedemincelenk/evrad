"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import type { EntityEditorMode } from "../../core/editor";
import { t } from "../../core/i18n";
import { normalizeOrder } from "../../core/sort";
import type { DevotionalDraft, DevotionalItem, DevotionalModuleId } from "../../core/types";
import { useEntityEditorRoute } from "../../hooks/useEntityEditorRoute";
import { useTrackableCollection } from "../../hooks/useTrackableCollection";
import { getDevotionalConfig } from "./devotional-config";
import { devotionalFromDraft, getDevotionalDisplay } from "./devotional-utils";

export function useDevotionalModule(moduleId: DevotionalModuleId, editorMode: EntityEditorMode) {
  const router = useRouter();
  const { showToast } = useAppRuntime();
  const config = getDevotionalConfig(moduleId);
  const [deleteTarget, setDeleteTarget] = useState<DevotionalItem | null>(null);
  const itemLabel = t(config.singularKey);
  const showStorageError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const getReorderAnnouncement = useCallback(
    (item: DevotionalItem, position: number) => t("card.reorderedGeneric", { title: getDevotionalDisplay(item).text, position }),
    [],
  );
  const collection = useTrackableCollection({
    repository: config.repository,
    getReorderAnnouncement,
    onStorageError: showStorageError,
  });
  const handleMissingEditor = useCallback(() => {
    showToast(t("editor.notFoundGeneric", { item: itemLabel }));
    router.replace(config.route);
  }, [config.route, itemLabel, router, showToast]);
  const editor = useEntityEditorRoute({
    mode: editorMode,
    items: collection.items,
    storageReady: collection.storageReady,
    onMissing: handleMissingEditor,
  });

  const changeFont = (item: DevotionalItem, direction: -1 | 1) => {
    const expandedArabicSize = Math.max(0, Math.min(4, item.expandedArabicSize + direction)) as 0 | 1 | 2 | 3 | 4;
    if (expandedArabicSize === item.expandedArabicSize) return;
    const updated = { ...item, expandedArabicSize, updatedAt: new Date().toISOString() };
    collection.replaceItems(collection.itemsRef.current.map((current) => current.id === updated.id ? updated : current));
    config.repository.save(updated).catch(showStorageError);
  };

  const saveDraft = (draft: DevotionalDraft) => {
    const existing = editor === "new" ? null : editor;
    const item = devotionalFromDraft(moduleId, draft, existing, collection.itemsRef.current.length);
    const next = existing
      ? collection.itemsRef.current.map((current) => current.id === item.id ? item : current)
      : [...collection.itemsRef.current, item];
    collection.replaceItems(normalizeOrder(next));
    config.repository.save(item).catch(showStorageError);
    router.replace(config.route);
    showToast(t("toast.savedGeneric", { item: itemLabel }));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const next = normalizeOrder(collection.itemsRef.current.filter((item) => item.id !== deleteTarget.id));
    collection.replaceItems(next);
    collection.forgetItemState(deleteTarget.id);
    config.repository.delete(deleteTarget.id).then(() => config.repository.saveOrder(next)).catch(showStorageError);
    setDeleteTarget(null);
    showToast(t("toast.deletedGeneric", { item: itemLabel }));
  };

  return {
    config,
    itemLabel,
    collection,
    editor,
    deleteTarget,
    setDeleteTarget,
    changeFont,
    saveDraft,
    confirmDelete,
    closeEditor: () => router.replace(config.route),
    addFirst: () => router.push(config.createRoute),
    editItem: (id: string) => router.push(`${config.route}/${encodeURIComponent(id)}/duzenle`),
  };
}
