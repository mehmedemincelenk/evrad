"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { collectionEntry, type CollectionEntry } from "../core/collections";
import { collectionRepository } from "../data/collection-repository";

// Commit writes before publishing state. Serialize local actions so two rapid
// taps cannot overwrite each other's membership or editor changes.
export function useRecordLibrary(onError: () => void) {
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const entriesRef = useRef(entries);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const mounted = useRef(false);

  const replaceEntries = useCallback((next: CollectionEntry[]) => {
    entriesRef.current = next;
    if (mounted.current) setEntries(next);
  }, []);

  const reload = useCallback(async () => {
    const next = await collectionRepository.load();
    if (!mounted.current) return;
    replaceEntries(next);
    setFailed(false);
    setReady(true);
  }, [replaceEntries]);

  useEffect(() => {
    mounted.current = true;
    reload().catch(() => {
      if (!mounted.current) return;
      setFailed(true);
      setReady(true);
      onError();
    });
    return () => { mounted.current = false; };
  }, [onError, reload]);

  const mutate = useCallback((operation: () => Promise<void>) => {
    const result = queue.current.then(async () => {
      try {
        await operation();
        return true;
      } catch {
        if (mounted.current) onError();
        return false;
      }
    });
    queue.current = result;
    return result;
  }, [onError]);

  const publish = useCallback((entry: CollectionEntry) => {
    const next = collectionEntry(entry.moduleId, entry.item, "favorites");
    const current = entriesRef.current;
    replaceEntries(current.some((item) => item.id === next.id)
      ? current.map((item) => item.id === next.id ? next : item)
      : [...current, next]);
  }, [replaceEntries]);

  return { entries, entriesRef, ready, failed, reload, mutate, publish, replaceEntries };
}
