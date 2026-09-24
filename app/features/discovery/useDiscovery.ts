"use client";

import { useMemo } from "react";
import { belongsToCollection, recordKey, type CollectionId } from "../../core/collections";
import type { DevotionalModuleId } from "../../core/types";
import { useRecordLibrary } from "../../hooks/useRecordLibrary";
import type { DevotionalTemplate } from "./discovery-types";

export function useDiscovery() {
  const library = useRecordLibrary();
  const byId = useMemo(() => new Map(library.entries.map((entry) => [entry.id, entry.item])), [library.entries]);
  const includes = (moduleId: DevotionalModuleId, itemId: string, collection: CollectionId) => {
    const item = byId.get(recordKey(moduleId, itemId));
    return item ? belongsToCollection(item, collection) : false;
  };
  const toggle = (moduleId: DevotionalModuleId, template: DevotionalTemplate, collection: CollectionId) =>
    library.toggleMembership({ moduleId, itemId: template.id }, collection, template);
  return { ready: library.ready, failed: library.failed, includes, toggle };
}
