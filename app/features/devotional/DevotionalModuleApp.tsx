"use client";

import { AppShell } from "../../AppShell";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { SortStatus } from "../../components/SortStatus";
import { StorageLoading } from "../../components/StorageLoading";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { TrackableModuleLayout } from "../../components/TrackableModuleLayout";
import type { EntityEditorMode } from "../../core/editor";
import { t } from "../../core/i18n";
import type { DevotionalModuleId } from "../../core/types";
import { DevotionalCard } from "./DevotionalCard";
import { DevotionalEditor } from "./DevotionalEditor";
import { getDevotionalDisplay } from "./devotional-utils";
import { useDevotionalModule } from "./useDevotionalModule";

export function DevotionalModuleApp({
  moduleId,
  editorMode = null,
}: {
  moduleId: DevotionalModuleId;
  editorMode?: EntityEditorMode;
}) {
  return (
    <AppShell activeModule={moduleId} activeSpace="library">
      <DevotionalScreen moduleId={moduleId} editorMode={editorMode} />
    </AppShell>
  );
}

function DevotionalScreen({ moduleId, editorMode }: { moduleId: DevotionalModuleId; editorMode: EntityEditorMode }) {
  const state = useDevotionalModule(moduleId, editorMode);
  const { collection, config } = state;
  const sorting = collection.sorting;
  const title = t(config.titleKey);
  return (
    <>
      <TrackableModuleLayout
        header={<ModuleScreenHeader eyebrow={t(config.eyebrowKey)} title={title} tagline={t(config.taglineKey)} today={collection.today} />}
        loading={!collection.storageReady}
        hasItems={collection.items.length > 0}
        loadingState={<StorageLoading label={t("loading.generic", { module: title })} />}
        emptyState={<TrackableEmptyState title={t("empty.libraryTitle")} body={t("empty.libraryBody", { item: state.itemLabel })} actionLabel={t("empty.addFirst", { item: state.itemLabel })} onAction={state.addFirst} />}
        status={<SortStatus active={Boolean(sorting.draggingId)} announcement={sorting.announcement} activeLabel={t("card.sorting")} />}
        footer={<p className="quiet-note">{t("app.lightNote")}</p>}
      >
        {collection.items.map((item, index) => (
          <DevotionalCard
            key={item.id}
            item={item}
            complete={collection.completeIds.has(item.id)}
            expanded={collection.expandedIds.has(item.id)}
            dragging={sorting.draggingId === item.id}
            dragOffsetY={sorting.draggingId === item.id ? sorting.dragOffsetY : 0}
            position={index + 1}
            onToggleExpanded={() => collection.toggleExpanded(item.id)}
            onToggleComplete={() => collection.toggleComplete(item.id)}
            onChangeFont={(direction) => state.changeFont(item, direction)}
            onEdit={() => state.editItem(item.id)}
            onDelete={() => state.setDeleteTarget(item)}
            sortHandleProps={sorting.handleProps}
          />
        ))}
      </TrackableModuleLayout>
      {state.editor ? <DevotionalEditor key={state.editor === "new" ? "new" : state.editor.id} item={state.editor === "new" ? null : state.editor} itemLabel={state.itemLabel} onClose={state.closeEditor} onSave={state.saveDraft} /> : null}
      {state.deleteTarget ? <DeleteConfirmation title={getDevotionalDisplay(state.deleteTarget).text} itemLabel={state.itemLabel} onCancel={() => state.setDeleteTarget(null)} onConfirm={state.confirmDelete} /> : null}
    </>
  );
}
