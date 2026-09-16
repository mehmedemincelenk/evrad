"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DevotionalModuleId } from "../../core/types";
import { completionRepository } from "../../data/completion-repository";
import { useLocalDay } from "../../hooks/useLocalDay";

const homeModuleIds: DevotionalModuleId[] = ["dhikr", "prayers", "memorization", "poetry"];
type CompletionMap = Record<DevotionalModuleId, Set<string>>;

export function useDailyCompletions() {
  const dateKey = useLocalDay();
  const [completeIds, setCompleteIds] = useState<CompletionMap>(emptyCompletionMap);
  const [ready, setReady] = useState(false);
  const completeIdsRef = useRef(completeIds);

  useEffect(() => {
    let active = true;
    Promise.all(homeModuleIds.map((moduleId) => completionRepository.loadIds(moduleId, dateKey)))
      .then((sets) => {
        if (!active) return;
        const next = Object.fromEntries(homeModuleIds.map((moduleId, index) => [moduleId, sets[index]])) as CompletionMap;
        completeIdsRef.current = next;
        setCompleteIds(next);
        setReady(true);
      })
      .catch(() => setReady(true));
    return () => { active = false; };
  }, [dateKey]);

  const toggleComplete = useCallback((moduleId: DevotionalModuleId, itemId: string) => {
    const complete = !completeIdsRef.current[moduleId].has(itemId);
    const moduleIds = new Set(completeIdsRef.current[moduleId]);
    if (complete) moduleIds.add(itemId);
    else moduleIds.delete(itemId);
    const next = { ...completeIdsRef.current, [moduleId]: moduleIds };
    completeIdsRef.current = next;
    setCompleteIds(next);
    completionRepository.set(moduleId, itemId, dateKey, complete).catch(() => undefined);
  }, [dateKey]);

  return { ready, completeIds, toggleComplete };
}

function emptyCompletionMap(): CompletionMap {
  return { dhikr: new Set(), prayers: new Set(), memorization: new Set(), poetry: new Set() };
}
