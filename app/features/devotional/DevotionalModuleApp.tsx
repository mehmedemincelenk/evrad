"use client";

import { AppShell } from "../../AppShell";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";
import { LibraryModuleLayout } from "../../components/LibraryModuleLayout";
import type { EntityEditorMode } from "../../core/editor";
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
  const { collection, module } = state;
  const sorting = collection.sorting;
  return (
    <>
      <LibraryModuleLayout
        module={module}
        itemLabel={state.itemLabel}
        storageReady={collection.storageReady}
        today={collection.today}
        hasItems={collection.items.length > 0}
        sorting={sorting}
        onAdd={state.addFirst}
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
      </LibraryModuleLayout>
      {state.editor ? <DevotionalEditor key={state.editor === "new" ? "new" : state.editor.id} item={state.editor === "new" ? null : state.editor} itemLabel={state.itemLabel} onClose={state.closeEditor} onSave={state.saveDraft} /> : null}
      {state.deleteTarget ? <DeleteConfirmation title={getDevotionalDisplay(state.deleteTarget).text} itemLabel={state.itemLabel} onCancel={() => state.setDeleteTarget(null)} onConfirm={state.confirmDelete} /> : null}
    </>
  );
}
