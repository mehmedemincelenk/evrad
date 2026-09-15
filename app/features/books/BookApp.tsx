"use client";

import { AppShell } from "../../AppShell";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";
import { LibraryModuleLayout } from "../../components/LibraryModuleLayout";
import type { EntityEditorMode } from "../../core/editor";
import type { BookItem } from "../../core/types";
import { bookRepository } from "../../data/repositories";
import { useLibraryModule } from "../../hooks/useLibraryModule";
import { BookCard } from "./BookCard";
import { BookEditor } from "./BookEditor";
import { bookFromDraft } from "./book-utils";

export function BookApp({ editorMode = null }: { editorMode?: EntityEditorMode }) {
  return (
    <AppShell activeModule="books" activeSpace="library">
      <BookScreen editorMode={editorMode} />
    </AppShell>
  );
}

function BookScreen({ editorMode }: { editorMode: EntityEditorMode }) {
  const state = useLibraryModule({
    moduleId: "books",
    editorMode,
    repository: bookRepository,
    getTitle: getBookTitle,
    fromDraft: bookFromDraft,
  });
  const { collection } = state;
  const { sorting } = collection;

  return (
    <>
      <LibraryModuleLayout
        module={state.module}
        itemLabel={state.itemLabel}
        storageReady={collection.storageReady}
        hasItems={collection.items.length > 0}
        sorting={sorting}
      >
        {collection.items.map((item, index) => (
          <BookCard
            key={item.id}
            item={item}
            complete={collection.completeIds.has(item.id)}
            expanded={collection.expandedIds.has(item.id)}
            dragging={sorting.draggingId === item.id}
            dragOffsetY={sorting.draggingId === item.id ? sorting.dragOffsetY : 0}
            position={index + 1}
            onToggleExpanded={() => collection.toggleExpanded(item.id)}
            onToggleComplete={() => collection.toggleComplete(item.id)}
            onEdit={() => state.editItem(item.id)}
            onDelete={() => state.setDeleteTarget(item)}
            sortHandleProps={sorting.handleProps}
          />
        ))}
      </LibraryModuleLayout>
      {state.editor ? <BookEditor key={state.editor === "new" ? "new" : state.editor.id} item={state.editor === "new" ? null : state.editor} onClose={state.closeEditor} onSave={state.saveDraft} /> : null}
      {state.deleteTarget ? <DeleteConfirmation title={state.deleteTarget.title} itemLabel={state.itemLabel} onCancel={() => state.setDeleteTarget(null)} onConfirm={state.confirmDelete} /> : null}
    </>
  );
}

function getBookTitle(item: BookItem): string {
  return item.title;
}
