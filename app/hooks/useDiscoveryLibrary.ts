"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { storeTemplate } from "../core/entity";
import type { EntityTemplate, TrackableEntity, TrackableRepository } from "../core/types";

function belongsToVirds(item: TrackableEntity): boolean {
  return "inVirds" in item && item.inVirds === true;
}

export function useDiscoveryLibrary<T extends TrackableEntity>(
  repository: TrackableRepository<T>,
  onError: () => void,
) {
  const itemsRef = useRef<T[]>([]);
  const [itemIds, setItemIds] = useState<Set<string>>(() => new Set());
  const [virdIds, setVirdIds] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    repository.load().then((items) => {
      if (!active) return;
      itemsRef.current = items;
      setItemIds(new Set(items.map((item) => item.id)));
      setVirdIds(new Set(items.filter(belongsToVirds).map((item) => item.id)));
      setReady(true);
    }).catch(() => {
      if (!active) return;
      setReady(true);
      onError();
    });
    return () => { active = false; };
  }, [onError, repository]);

  const add = useCallback(async (template: EntityTemplate<T>): Promise<"added" | "exists" | "failed"> => {
    if (itemsRef.current.some((item) => item.id === template.id)) return "exists";
    const item = storeTemplate(template, itemsRef.current.length);
    itemsRef.current = [...itemsRef.current, item];
    setItemIds((current) => new Set(current).add(item.id));
    try {
      await repository.save(item);
      return "added";
    } catch {
      itemsRef.current = itemsRef.current.filter((current) => current.id !== item.id);
      setItemIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
      setVirdIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
      onError();
      return "failed";
    }
  }, [onError, repository]);

  const remove = useCallback(async (id: string): Promise<"removed" | "missing" | "failed"> => {
    const previousItems = itemsRef.current;
    if (!previousItems.some((item) => item.id === id)) return "missing";

    const remainingItems = previousItems.filter((item) => item.id !== id);
    itemsRef.current = remainingItems;
    setItemIds(new Set(remainingItems.map((item) => item.id)));
    setVirdIds(new Set(remainingItems.filter(belongsToVirds).map((item) => item.id)));
    try {
      await repository.remove(id, remainingItems);
      return "removed";
    } catch {
      itemsRef.current = previousItems;
      setItemIds(new Set(previousItems.map((item) => item.id)));
      setVirdIds(new Set(previousItems.filter(belongsToVirds).map((item) => item.id)));
      onError();
      return "failed";
    }
  }, [onError, repository]);

  const toggle = useCallback((template: EntityTemplate<T>) => (
    itemsRef.current.some((item) => item.id === template.id)
      ? remove(template.id)
      : add(template)
  ), [add, remove]);

  const setVird = useCallback(async (id: string, inVirds: boolean): Promise<"updated" | "missing" | "failed"> => {
    const previousItems = itemsRef.current;
    const current = previousItems.find((item) => item.id === id);
    if (!current) return "missing";
    const updated = { ...current, inVirds, updatedAt: new Date().toISOString() } as T;
    itemsRef.current = previousItems.map((item) => item.id === id ? updated : item);
    setVirdIds((ids) => {
      const next = new Set(ids);
      if (inVirds) next.add(id);
      else next.delete(id);
      return next;
    });
    try {
      await repository.save(updated);
      return "updated";
    } catch {
      itemsRef.current = previousItems;
      setVirdIds(new Set(previousItems.filter(belongsToVirds).map((item) => item.id)));
      onError();
      return "failed";
    }
  }, [onError, repository]);

  const addToVirds = useCallback(async (template: EntityTemplate<T>) => {
    const result = await add(template);
    if (result === "failed") return result;
    return setVird(template.id, true);
  }, [add, setVird]);

  return { ready, itemIds, virdIds, add, addToVirds, remove, setVird, toggle };
}
