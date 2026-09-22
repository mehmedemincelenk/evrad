"use client";

import { useCallback, useState } from "react";
import { useAppRuntime } from "../core/AppRuntimeContext";
import { belongsToCollection, collectionEntry, selectCollection, type CollectionEntry, type CollectionId } from "../core/collections";
import { t } from "../core/i18n";
import type { DevotionalItem } from "../core/types";
import { collectionRepository } from "../data/collection-repository";
import { useRecordLibrary } from "./useRecordLibrary";
import { useCompletionState } from "./useCompletionState";
import { useExpandableItems } from "./useExpandableItems";
import { useLongPressSort } from "./useLongPressSort";

export function useCollection(collection: CollectionId) {
  const { showToast } = useAppRuntime();
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useRecordLibrary(onError);
  const completions = useCompletionState(onError);
  const expansion = useExpandableItems();
  const [orderPreview, setOrderPreview] = useState<CollectionEntry[] | null>(null);
  const entries = orderPreview ?? selectCollection(library.entries, collection);

  const update = (entry: CollectionEntry, changes: Partial<DevotionalItem>) => library.mutate(async () => {
    const item = await collectionRepository.patch(entry, changes);
    library.publish(collectionEntry(entry.moduleId, item, collection));
  });

  const toggleMembership = (entry: CollectionEntry, target: CollectionId) => library.mutate(async () => {
    const current = library.entriesRef.current.find((item) => item.id === entry.id);
    if (!current) throw new Error("Record no longer exists");
    const item = await collectionRepository.setMembership(entry, target, !belongsToCollection(current.item, target));
    library.publish(collectionEntry(entry.moduleId, item, collection));
  });

  const persistOrder = async (next: CollectionEntry[]) => {
    const success = await library.mutate(async () => {
      await collectionRepository.saveOrder(next, collection);
      await library.reload();
    });
    setOrderPreview(null);
    if (!success) throw new Error("Order could not be saved");
  };
  const sorting = useLongPressSort({
    items: entries,
    onChange: setOrderPreview,
    onPersist: persistOrder,
    getAnnouncement: (entry, position) => t("card.reorderedGeneric", { title: entry.item.name ?? entry.item.arabic ?? "", position }),
    onError: () => undefined, // mutate already reports the failure and restores the committed order.
  });

  return {
    ready: library.ready && completions.ready, failed: library.failed || completions.failed, entries,
    completeKeys: completions.keys, expansion, sorting, update, toggleMembership,
    toggleComplete: (entry: CollectionEntry) => void completions.toggle(entry.moduleId, entry.itemId),
  };
}
