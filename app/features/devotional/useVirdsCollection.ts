"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { t } from "../../core/i18n";
import type { DevotionalItem, DevotionalModuleId } from "../../core/types";
import { completionRepository } from "../../data/completion-repository";
import { devotionalRepositories } from "../../data/repositories";
import { useExpandableItems } from "../../hooks/useExpandableItems";
import { useLongPressSort } from "../../hooks/useLongPressSort";
import { useLocalDay } from "../../hooks/useLocalDay";
import { getDevotionalDisplay } from "./devotional-utils";

export interface VirdEntry {
  id: string;
  sortOrder: number;
  moduleId: DevotionalModuleId;
  item: DevotionalItem;
}

const moduleIds: DevotionalModuleId[] = ["dhikr", "prayers", "memorization", "poetry"];

export function useVirdsCollection() {
  const { showToast } = useAppRuntime();
  const dateKey = useLocalDay();
  const [entries, setEntries] = useState<VirdEntry[]>([]);
  const entriesRef = useRef(entries);
  const persistedEntriesRef = useRef(entries);
  const [completeKeys, setCompleteKeys] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);
  const expansion = useExpandableItems();

  const replaceEntries = useCallback((next: VirdEntry[]) => {
    entriesRef.current = next;
    setEntries(next);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      ...moduleIds.map((moduleId) => devotionalRepositories[moduleId].load()),
      ...moduleIds.map((moduleId) => completionRepository.loadIds(moduleId, dateKey)),
    ]).then((results) => {
      if (!active) return;
      const loadedEntries = moduleIds.flatMap((moduleId, index) => (
        (results[index] as DevotionalItem[])
          .filter((item) => item.inVirds)
          .map((item) => ({ id: `${moduleId}:${item.id}`, sortOrder: item.virdSortOrder ?? item.sortOrder, moduleId, item }))
      ));
      loadedEntries.sort((a, b) => a.sortOrder - b.sortOrder);
      persistedEntriesRef.current = loadedEntries;
      replaceEntries(loadedEntries);
      const nextComplete = new Set<string>();
      moduleIds.forEach((moduleId, index) => {
        (results[moduleIds.length + index] as Set<string>).forEach((id) => nextComplete.add(`${moduleId}:${id}`));
      });
      setCompleteKeys(nextComplete);
      setReady(true);
    }).catch(() => {
      if (active) {
        setReady(true);
        showToast(t("toast.storageError"));
      }
    });
    return () => { active = false; };
  }, [dateKey, replaceEntries, showToast]);

  const persistOrder = useCallback(async (next: VirdEntry[]) => {
    const previous = persistedEntriesRef.current;
    const reordered = next.map((entry, index) => ({
      ...entry,
      sortOrder: index,
      item: { ...entry.item, virdSortOrder: index, updatedAt: new Date().toISOString() },
    }));
    replaceEntries(reordered);
    try {
      await Promise.all(reordered.map((entry) => devotionalRepositories[entry.moduleId].save(entry.item)));
      persistedEntriesRef.current = reordered;
    } catch (error) {
      replaceEntries(previous);
      throw error;
    }
  }, [replaceEntries]);

  const sorting = useLongPressSort({
    items: entries,
    onChange: replaceEntries,
    onPersist: persistOrder,
    getAnnouncement: (entry, position) => t("card.reorderedGeneric", { title: getDevotionalDisplay(entry.item).text, position }),
    onError: () => showToast(t("toast.storageError")),
  });

  const update = useCallback(async (entry: VirdEntry, patch: Partial<DevotionalItem>) => {
    const updated = { ...entry.item, ...patch, updatedAt: new Date().toISOString() };
    const previous = entriesRef.current;
    replaceEntries(previous.map((candidate) => candidate.moduleId === entry.moduleId && candidate.item.id === entry.item.id ? { ...candidate, item: updated } : candidate));
    try {
      await devotionalRepositories[entry.moduleId].save(updated);
      return true;
    } catch {
      replaceEntries(previous);
      showToast(t("toast.storageError"));
      return false;
    }
  }, [replaceEntries, showToast]);

  const removeFromVirds = useCallback(async (entry: VirdEntry) => {
    if (await update(entry, { inVirds: false })) {
      replaceEntries(entriesRef.current.filter((candidate) => !(candidate.moduleId === entry.moduleId && candidate.item.id === entry.item.id)));
    }
  }, [replaceEntries, update]);

  const removeFromBag = useCallback(async (entry: VirdEntry) => {
    const repository = devotionalRepositories[entry.moduleId];
    const stored = await repository.load();
    const remaining = stored.filter((item) => item.id !== entry.item.id);
    try {
      await repository.remove(entry.item.id, remaining);
      replaceEntries(entriesRef.current.filter((candidate) => !(candidate.moduleId === entry.moduleId && candidate.item.id === entry.item.id)));
    } catch {
      showToast(t("toast.storageError"));
    }
  }, [replaceEntries, showToast]);

  const toggleComplete = useCallback((entry: VirdEntry) => {
    const key = `${entry.moduleId}:${entry.item.id}`;
    const complete = !completeKeys.has(key);
    setCompleteKeys((current) => {
      const next = new Set(current);
      if (complete) next.add(key); else next.delete(key);
      return next;
    });
    completionRepository.set(entry.moduleId, entry.item.id, dateKey, complete).catch(() => showToast(t("toast.storageError")));
  }, [completeKeys, dateKey, showToast]);

  return { ready, entries, completeKeys, expansion, sorting, update, removeFromVirds, removeFromBag, toggleComplete };
}
