"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TrackableEntity, TrackableRepository } from "../core/trackable";
import { completionRepository } from "../data/completion-repository";
import { useExpandableItems } from "./useExpandableItems";
import { useLocalDay } from "./useLocalDay";
import { useLongPressSort } from "./useLongPressSort";

export function useTrackableCollection<T extends TrackableEntity>({
  repository,
  getReorderAnnouncement,
  onStorageError,
}: {
  repository: TrackableRepository<T>;
  getReorderAnnouncement: (item: T, position: number) => string;
  onStorageError: () => void;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [completeIds, setCompleteIds] = useState<Set<string>>(() => new Set());
  const [storageReady, setStorageReady] = useState(false);
  const itemsRef = useRef(items);
  const { dateKey, today } = useLocalDay();
  const { expandedIds, toggleExpanded, forgetExpanded } = useExpandableItems();

  const replaceItems = useCallback((next: T[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const sorting = useLongPressSort({
    items,
    onChange: replaceItems,
    onPersist: repository.saveOrder,
    getAnnouncement: getReorderAnnouncement,
    onError: onStorageError,
  });

  useEffect(() => {
    let active = true;
    Promise.all([repository.load(), completionRepository.loadIds(repository.moduleId, dateKey)])
      .then(([storedItems, storedCompletions]) => {
        if (!active) return;
        replaceItems(storedItems);
        setCompleteIds(storedCompletions);
        setStorageReady(true);
      })
      .catch(() => {
        if (!active) return;
        setStorageReady(true);
        onStorageError();
      });
    return () => { active = false; };
  }, [dateKey, onStorageError, replaceItems, repository]);

  const toggleComplete = useCallback((id: string) => {
    const complete = !completeIds.has(id);
    setCompleteIds((current) => {
      const next = new Set(current);
      if (complete) next.add(id);
      else next.delete(id);
      return next;
    });
    completionRepository.set(repository.moduleId, id, dateKey, complete).catch(onStorageError);
  }, [completeIds, dateKey, onStorageError, repository.moduleId]);

  const forgetItemState = useCallback((id: string) => {
    forgetExpanded(id);
    setCompleteIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, [forgetExpanded]);

  return {
    items,
    itemsRef,
    replaceItems,
    completeIds,
    expandedIds,
    toggleExpanded,
    toggleComplete,
    forgetItemState,
    storageReady,
    today,
    dateKey,
    sorting,
  };
}
