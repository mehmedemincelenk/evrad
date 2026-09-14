"use client";

import { useEffect, useRef, useState } from "react";
import type { TrackableEntity, TrackableRepository } from "../core/trackable";

type LibraryTemplate<T> = Omit<T, keyof TrackableEntity> & { id: string };

export function useDiscoveryLibrary<T extends TrackableEntity>(
  repository: TrackableRepository<T>,
  onError: () => void,
) {
  const itemsRef = useRef<T[]>([]);
  const [itemIds, setItemIds] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    repository.load().then((items) => {
      if (!active) return;
      itemsRef.current = items;
      setItemIds(new Set(items.map((item) => item.id)));
      setReady(true);
    }).catch(() => {
      if (!active) return;
      setReady(true);
      onError();
    });
    return () => { active = false; };
  }, [onError, repository]);

  const add = async (template: LibraryTemplate<T>): Promise<"added" | "exists" | "failed"> => {
    if (itemIds.has(template.id)) return "exists";
    const now = new Date().toISOString();
    const item = {
      ...template,
      sortOrder: itemsRef.current.length,
      createdAt: now,
      updatedAt: now,
    } as T;
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
      onError();
      return "failed";
    }
  };

  return { ready, itemIds, add };
}
