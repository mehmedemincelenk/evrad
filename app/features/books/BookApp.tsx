"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../AppShell";
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
import type { BookDraft, BookItem } from "../../core/types";
import { useEntityEditorRoute } from "../../hooks/useEntityEditorRoute";
import { useTrackableCollection } from "../../hooks/useTrackableCollection";
import { BookCard } from "./BookCard";
import { BookEditor } from "./BookEditor";
import { bookRepository } from "./book-repository";

export function BookApp({ editorMode = null }: { editorMode?: EntityEditorMode }) {
  return <AppShell activeModule="books" activeSpace="library"><BookScreen editorMode={editorMode} /></AppShell>;
}

function BookScreen({ editorMode }: { editorMode: EntityEditorMode }) {
  const router = useRouter();
  const { showToast } = useAppRuntime();
  const [deleteTarget, setDeleteTarget] = useState<BookItem | null>(null);
  const itemLabel = t("module.books.singular");
  const showStorageError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const reorderCopy = useCallback((item: BookItem, position: number) => t("card.reorderedGeneric", { title: item.title, position }), []);
  const collection = useTrackableCollection({ repository: bookRepository, getReorderAnnouncement: reorderCopy, onStorageError: showStorageError });
  const handleMissing = useCallback(() => {
    showToast(t("editor.notFoundGeneric", { item: itemLabel }));
    router.replace("/kitaplar");
  }, [itemLabel, router, showToast]);
  const editor = useEntityEditorRoute({ mode: editorMode, items: collection.items, storageReady: collection.storageReady, onMissing: handleMissing });
  const sorting = collection.sorting;

  const saveDraft = (draft: BookDraft) => {
    const existing = editor === "new" ? null : editor;
    const now = new Date().toISOString();
    const item: BookItem = {
      id: existing?.id ?? createEntityId("book"),
      title: draft.title,
      author: draft.author || null,
      details: draft.details || null,
      targetCount: draft.targetCount ? Number(draft.targetCount) : null,
      targetUnit: draft.targetUnit,
      targetUnitLabel: draft.targetUnit === "custom" ? draft.targetUnitLabel : null,
      sortOrder: existing?.sortOrder ?? collection.itemsRef.current.length,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const next = normalizeOrder(existing
      ? collection.itemsRef.current.map((current) => current.id === item.id ? item : current)
      : [...collection.itemsRef.current, item]);
    collection.replaceItems(next);
    bookRepository.save(item).catch(showStorageError);
    router.replace("/kitaplar");
    showToast(t("toast.savedGeneric", { item: itemLabel }));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const next = normalizeOrder(collection.itemsRef.current.filter((item) => item.id !== deleteTarget.id));
    collection.replaceItems(next);
    collection.forgetItemState(deleteTarget.id);
    bookRepository.delete(deleteTarget.id).then(() => bookRepository.saveOrder(next)).catch(showStorageError);
    setDeleteTarget(null);
    showToast(t("toast.deletedGeneric", { item: itemLabel }));
  };

  return (
    <>
      <TrackableModuleLayout
        header={<ModuleScreenHeader eyebrow={t("module.books.eyebrow")} title={t("module.books.title")} tagline={t("module.books.tagline")} today={collection.today} />}
        loading={!collection.storageReady}
        hasItems={collection.items.length > 0}
        loadingState={<StorageLoading label={t("loading.generic", { module: t("module.books.title") })} />}
        emptyState={<TrackableEmptyState title={t("empty.libraryTitle")} body={t("empty.libraryBody", { item: itemLabel })} actionLabel={t("empty.addFirst", { item: itemLabel })} onAction={() => router.push("/kitaplar/yeni")} />}
        status={<SortStatus active={Boolean(sorting.draggingId)} announcement={sorting.announcement} activeLabel={t("card.sorting")} />}
        footer={<p className="quiet-note">{t("app.lightNote")}</p>}
      >
        {collection.items.map((item, index) => <BookCard key={item.id} item={item} complete={collection.completeIds.has(item.id)} expanded={collection.expandedIds.has(item.id)} dragging={sorting.draggingId === item.id} dragOffsetY={sorting.draggingId === item.id ? sorting.dragOffsetY : 0} position={index + 1} onToggleExpanded={() => collection.toggleExpanded(item.id)} onToggleComplete={() => collection.toggleComplete(item.id)} onEdit={() => router.push(`/kitaplar/${encodeURIComponent(item.id)}/duzenle`)} onDelete={() => setDeleteTarget(item)} sortHandleProps={sorting.handleProps} />)}
      </TrackableModuleLayout>
      {editor ? <BookEditor key={editor === "new" ? "new" : editor.id} item={editor === "new" ? null : editor} onClose={() => router.replace("/kitaplar")} onSave={saveDraft} /> : null}
      {deleteTarget ? <DeleteConfirmation title={deleteTarget.title} itemLabel={itemLabel} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} /> : null}
    </>
  );
}
