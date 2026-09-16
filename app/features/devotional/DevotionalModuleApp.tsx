"use client";

import { AppShell } from "../../AppShell";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";
import { LibraryModuleLayout } from "../../components/LibraryModuleLayout";
import type { EntityEditorMode } from "../../core/editor";
import { t } from "../../core/i18n";
import type { DevotionalModuleId } from "../../core/types";
import { DevotionalCard } from "./DevotionalCard";
import { DevotionalContextChips } from "./DevotionalContextChips";
import { DevotionalEditor } from "./DevotionalEditor";
import { getDevotionalDisplay } from "./devotional-utils";
import { useDevotionalContextFilter } from "./useDevotionalContextFilter";
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
  const { collection, module } = state;
  const sorting = collection.sorting;
  const contextFilter = useDevotionalContextFilter(collection.items);
  const selectedContexts = contextFilter.activeContext ? [contextFilter.activeContext] : [];
  return (
    <>
      <LibraryModuleLayout
        module={module}
        itemLabel={state.itemLabel}
        storageReady={collection.storageReady}
        hasItems={collection.items.length > 0}
        sorting={sorting}
        toolbar={collection.items.length > 0 && moduleId !== "memorization" ? (
          <div className="context-filter">
            <DevotionalContextChips selected={selectedContexts} onToggle={contextFilter.toggleContext} label={t("filter.contexts")} />
          </div>
        ) : null}
      >
        {contextFilter.filteredItems.length === 0 ? <p className="filter-empty">{t("filter.empty")}</p> : contextFilter.filteredItems.map((item) => (
          <DevotionalCard
            key={item.id}
            moduleId={moduleId}
            item={item}
            complete={collection.completeIds.has(item.id)}
            expanded={collection.expandedIds.has(item.id)}
            dragging={sorting.draggingId === item.id}
            dragOffsetY={sorting.draggingId === item.id ? sorting.dragOffsetY : 0}
            position={collection.items.findIndex((candidate) => candidate.id === item.id) + 1}
            onToggleExpanded={() => collection.toggleExpanded(item.id)}
            onToggleComplete={() => collection.toggleComplete(item.id)}
            onChangeFont={(direction) => state.changeFont(item, direction)}
            onEdit={() => state.editItem(item.id)}
            onDelete={() => state.setDeleteTarget(item)}
            sortHandleProps={sorting.handleProps}
          />
        ))}
      </LibraryModuleLayout>
      {state.editor ? <DevotionalEditor key={state.editor === "new" ? "new" : state.editor.id} item={state.editor === "new" ? null : state.editor} itemLabel={state.itemLabel} onClose={state.closeEditor} onSave={state.saveDraft} /> : null}
      {state.deleteTarget ? <DeleteConfirmation title={getDevotionalDisplay(state.deleteTarget).text} itemLabel={state.itemLabel} onCancel={() => state.setDeleteTarget(null)} onConfirm={state.confirmDelete} /> : null}
    </>
  );
}
