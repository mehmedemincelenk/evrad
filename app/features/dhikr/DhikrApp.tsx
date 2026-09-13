"use client";

import {
  useCallback,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../AppShell";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { SortStatus } from "../../components/SortStatus";
import { StorageLoading } from "../../components/StorageLoading";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { TrackableModuleLayout } from "../../components/TrackableModuleLayout";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import type { EntityEditorMode } from "../../core/editor";
import { createEntityId } from "../../core/id";
import { t } from "../../core/i18n";
import { normalizeOrder } from "../../core/sort";
import type { Dhikr, DhikrDraft } from "../../core/types";
import { useTrackableCollection } from "../../hooks/useTrackableCollection";
import { useEntityEditorRoute } from "../../hooks/useEntityEditorRoute";
import { DhikrCard, getDisplayTitle } from "./DhikrCard";
import { DhikrEditor } from "./DhikrEditor";
import { dhikrRepository } from "./dhikr-repository";
import { getMissingRecommendedDhikrs } from "./recommended-dhikrs";

export type DhikrEditorMode = EntityEditorMode;

export function DhikrApp({ editorMode = null }: { editorMode?: DhikrEditorMode }) {
  return (
    <AppShell activeModule="dhikr">
      <DhikrScreen editorMode={editorMode} />
    </AppShell>
  );
}

function DhikrScreen({ editorMode }: { editorMode: DhikrEditorMode }) {
  const router = useRouter();
  const { showToast } = useAppRuntime();
  const [deleteTarget, setDeleteTarget] = useState<Dhikr | null>(null);
  const [recommendedConfirmOpen, setRecommendedConfirmOpen] = useState(false);

  const showStorageError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const collection = useTrackableCollection({
    repository: dhikrRepository,
    getReorderAnnouncement: (item, position) => t("card.reordered", { title: getDisplayTitle(item).text, position }),
    onStorageError: showStorageError,
  });
  const {
    items: dhikrs,
    itemsRef,
    replaceItems,
    completeIds,
    expandedIds,
    toggleExpanded,
    toggleComplete,
    forgetItemState,
    storageReady,
    today,
    sorting: {
      draggingId,
      dragOffsetY,
      announcement: reorderAnnouncement,
      handleProps: sortHandleProps,
    },
  } = collection;
  const handleMissingEditor = useCallback(() => {
    showToast(t("editor.notFound"));
    router.replace("/zikirler");
  }, [router, showToast]);
  const editor = useEntityEditorRoute({ mode: editorMode, items: dhikrs, storageReady, onMissing: handleMissingEditor });

  const changeFont = (dhikr: Dhikr, direction: -1 | 1) => {
    const expandedArabicSize = Math.max(0, Math.min(4, dhikr.expandedArabicSize + direction)) as 0 | 1 | 2 | 3 | 4;
    if (expandedArabicSize === dhikr.expandedArabicSize) return;
    const updated = { ...dhikr, expandedArabicSize, updatedAt: new Date().toISOString() };
    replaceItems(itemsRef.current.map((item) => item.id === updated.id ? updated : item));
    dhikrRepository.save(updated).catch(showStorageError);
  };

  const saveDraft = (draft: DhikrDraft) => {
    const now = new Date().toISOString();
    const existing = editor === "new" ? null : editor;
    const dhikr: Dhikr = {
      id: existing?.id ?? createEntityId("dhikr"),
      name: draft.name || null,
      arabic: draft.arabic || null,
      translation: draft.translation || null,
      details: draft.details || null,
      targetCount: draft.targetCount ? Number(draft.targetCount) : null,
      targetUnit: draft.targetUnit,
      targetUnitLabel: draft.targetUnit === "custom" ? draft.targetUnitLabel : null,
      listDisplay: draft.listDisplay,
      expandedArabicSize: existing?.expandedArabicSize ?? 1,
      sortOrder: existing?.sortOrder ?? itemsRef.current.length,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    const next = existing
      ? itemsRef.current.map((item) => item.id === dhikr.id ? dhikr : item)
      : [...itemsRef.current, dhikr];
    replaceItems(normalizeOrder(next));
    dhikrRepository.save(dhikr).catch(showStorageError);
    router.replace("/zikirler");
    showToast(t("toast.saved"));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    replaceItems(normalizeOrder(itemsRef.current.filter((item) => item.id !== id)));
    forgetItemState(id);
    dhikrRepository.delete(id).then(() => dhikrRepository.saveOrder(itemsRef.current)).catch(showStorageError);
    setDeleteTarget(null);
    showToast(t("toast.deleted"));
  };

  const addRecommended = () => {
    const missing = getMissingRecommendedDhikrs(itemsRef.current);
    setRecommendedConfirmOpen(false);
    if (!missing.length) {
      showToast(t("recommended.alreadyAdded"));
      return;
    }
    const now = new Date().toISOString();
    const additions = missing.map((item, index): Dhikr => ({
      ...item,
      sortOrder: itemsRef.current.length + index,
      createdAt: now,
      updatedAt: now,
    }));
    const next = normalizeOrder([...itemsRef.current, ...additions]);
    replaceItems(next);
    dhikrRepository.saveOrder(next).catch(showStorageError);
    showToast(t("recommended.added", { count: additions.length }));
  };

  return (
    <>
      <TrackableModuleLayout
        header={<ModuleScreenHeader eyebrow={t("app.eyebrow")} title={t("app.name")} tagline={t("app.tagline")} today={today} />}
        loading={!storageReady}
        hasItems={dhikrs.length > 0}
        loadingState={<StorageLoading />}
        emptyState={<TrackableEmptyState title={t("empty.title")} body={t("empty.body")} actionLabel={t("action.addFirst")} onAction={() => router.push("/zikirler/yeni")} />}
        status={<SortStatus active={Boolean(draggingId)} announcement={reorderAnnouncement} activeLabel={t("card.sorting")} />}
        footer={(
          <>
            <p className="quiet-note">{t("app.lightNote")}</p>
            {storageReady ? (
              <button className="recommended-trigger" type="button" onClick={() => setRecommendedConfirmOpen(true)}>
                <span aria-hidden="true">✦</span>
                {t("recommended.trigger")}
              </button>
            ) : null}
          </>
        )}
      >
        {dhikrs.map((dhikr, index) => (
          <DhikrCard
            key={dhikr.id}
            dhikr={dhikr}
            complete={completeIds.has(dhikr.id)}
            expanded={expandedIds.has(dhikr.id)}
            dragging={draggingId === dhikr.id}
            dragOffsetY={draggingId === dhikr.id ? dragOffsetY : 0}
            position={index + 1}
            onToggleExpanded={() => toggleExpanded(dhikr.id)}
            onToggleComplete={() => toggleComplete(dhikr.id)}
            onChangeFont={(direction) => changeFont(dhikr, direction)}
            onEdit={() => router.push(`/zikirler/${encodeURIComponent(dhikr.id)}/duzenle`)}
            onDelete={() => setDeleteTarget(dhikr)}
            sortHandleProps={sortHandleProps}
          />
        ))}
      </TrackableModuleLayout>

      {editor ? (
        <DhikrEditor
          key={editor === "new" ? "new" : editor.id}
          dhikr={editor === "new" ? null : editor}
          onClose={() => router.replace("/zikirler")}
          onSave={saveDraft}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmation
          title={getDisplayTitle(deleteTarget).text}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      {recommendedConfirmOpen ? (
        <ConfirmationModal
          title={t("recommended.confirmTitle")}
          body={<p>{t("recommended.confirmBody")}</p>}
          cancelLabel={t("action.cancel")}
          confirmLabel={t("recommended.confirm")}
          onCancel={() => setRecommendedConfirmOpen(false)}
          onConfirm={addRecommended}
        />
      ) : null}
    </>
  );
}
