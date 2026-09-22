import type { DevotionalItem, DevotionalModuleId, TrackableModuleId } from "./types";

export type CollectionId = "virds" | "favorites";
export interface RecordRef { moduleId: DevotionalModuleId; itemId: string }
export interface CollectionEntry extends RecordRef {
  id: string;
  sortOrder: number;
  item: DevotionalItem;
}

export function recordKey(moduleId: TrackableModuleId, itemId: string) {
  return `${moduleId}:${itemId}`;
}

export function belongsToCollection(item: DevotionalItem, collection: CollectionId) {
  return collection === "virds" ? item.inVirds === true : item.liked !== false;
}

export function membershipPatch(collection: CollectionId, included: boolean): Partial<DevotionalItem> {
  return collection === "virds" ? { inVirds: included } : { liked: included };
}

export function collectionEntry(moduleId: DevotionalModuleId, item: DevotionalItem, collection: CollectionId): CollectionEntry {
  return {
    id: recordKey(moduleId, item.id), moduleId, itemId: item.id, item,
    sortOrder: collection === "virds" ? item.virdSortOrder ?? item.sortOrder : item.sortOrder,
  };
}

export function selectCollection(entries: CollectionEntry[], collection: CollectionId) {
  return entries.filter((entry) => belongsToCollection(entry.item, collection))
    .map((entry) => collectionEntry(entry.moduleId, entry.item, collection))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
}

export function orderPatch(collection: CollectionId, sortOrder: number): Partial<DevotionalItem> {
  return collection === "virds" ? { virdSortOrder: sortOrder } : { sortOrder };
}
