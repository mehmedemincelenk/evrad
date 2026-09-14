import type { EntityTemplate, TrackableEntity } from "./types";

function createEntityId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEntityMeta(
  prefix: string,
  sortOrder: number,
  existing: TrackableEntity | null = null,
): TrackableEntity {
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? createEntityId(prefix),
    sortOrder: existing?.sortOrder ?? sortOrder,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function storeTemplate<T extends TrackableEntity>(template: EntityTemplate<T>, sortOrder: number): T {
  const now = new Date().toISOString();
  return { ...template, sortOrder, createdAt: now, updatedAt: now } as T;
}
