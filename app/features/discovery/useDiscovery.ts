"use client";

import { useCallback } from "react";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { belongsToCollection, collectionEntry, recordKey, type CollectionId } from "../../core/collections";
import { t } from "../../core/i18n";
import type { DevotionalModuleId } from "../../core/types";
import { collectionRepository } from "../../data/collection-repository";
import { useRecordLibrary } from "../../hooks/useRecordLibrary";
import type { DevotionalTemplate } from "./discovery-types";

export function useDiscovery() {
  const { showToast } = useAppRuntime();
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useRecordLibrary(onError);

  const includes = (moduleId: DevotionalModuleId, itemId: string, collection: CollectionId) => {
    const entry = library.entries.find((entry) => entry.id === recordKey(moduleId, itemId));
    return entry ? belongsToCollection(entry.item, collection) : false;
  };

  const toggle = (moduleId: DevotionalModuleId, template: DevotionalTemplate, collection: CollectionId) => library.mutate(async () => {
    const current = library.entriesRef.current.find((entry) => entry.id === recordKey(moduleId, template.id));
    const included = current ? belongsToCollection(current.item, collection) : false;
    const item = await collectionRepository.setMembership({ moduleId, itemId: template.id }, collection, !included, template);
    library.publish(collectionEntry(moduleId, item, collection));
  });

  return { ready: library.ready, failed: library.failed, includes, toggle };
}
