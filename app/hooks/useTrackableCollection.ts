"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TrackableEntity, TrackableRepository } from "../core/types";
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
  const [itemsReady, setItemsReady] = useState(false);
  const [completionsReady, setCompletionsReady] = useState(false);
  const itemsRef = useRef(items);
  const completeIdsRef = useRef(completeIds);
  const { dateKey, today } = useLocalDay();
  const { expandedIds, toggleExpanded, forgetExpanded } = useExpandableItems();

  const replaceItems = useCallback((next: T[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const replaceCompleteIds = useCallback((next: Set<string>) => {
    completeIdsRef.current = next;
    setCompleteIds(next);
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
    repository.load()
      .then((storedItems) => {
        if (!active) return;
        replaceItems(storedItems);
        setItemsReady(true);
      })
      .catch(() => {
        if (!active) return;
        setItemsReady(true);
        onStorageError();
      });
    return () => { active = false; };
  }, [onStorageError, replaceItems, repository]);

  useEffect(() => {
    let active = true;
    completionRepository.loadIds(repository.moduleId, dateKey)
      .then((storedCompletions) => {
        if (!active) return;
        replaceCompleteIds(storedCompletions);
        setCompletionsReady(true);
      })
      .catch(() => {
        if (!active) return;
        replaceCompleteIds(new Set());
        setCompletionsReady(true);
        onStorageError();
      });
    return () => { active = false; };
  }, [dateKey, onStorageError, replaceCompleteIds, repository.moduleId]);

  const toggleComplete = useCallback((id: string) => {
    const complete = !completeIdsRef.current.has(id);
    const next = new Set(completeIdsRef.current);
    if (complete) next.add(id);
    else next.delete(id);
    replaceCompleteIds(next);
    completionRepository.set(repository.moduleId, id, dateKey, complete).catch(onStorageError);
  }, [dateKey, onStorageError, replaceCompleteIds, repository.moduleId]);

  const forgetItemState = useCallback((id: string) => {
    forgetExpanded(id);
    const next = new Set(completeIdsRef.current);
    next.delete(id);
    replaceCompleteIds(next);
  }, [forgetExpanded, replaceCompleteIds]);

  return {
    items,
    itemsRef,
    replaceItems,
    completeIds,
    expandedIds,
    toggleExpanded,
    toggleComplete,
    forgetItemState,
    storageReady: itemsReady && completionsReady,
    today,
    dateKey,
    sorting,
  };
}
