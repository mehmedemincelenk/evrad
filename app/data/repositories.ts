import type { BookItem, DevotionalItem, DevotionalModuleId, TrackableRepository } from "../core/types";
import { createTrackableRepository } from "./trackable-repository";

export const devotionalRepositories: Record<DevotionalModuleId, TrackableRepository<DevotionalItem>> = {
  dhikr: createDevotionalRepository("dhikr"),
  prayers: createDevotionalRepository("prayers"),
  memorization: createDevotionalRepository("memorization"),
  poetry: createDevotionalRepository("poetry"),
};

export const bookRepository = createTrackableRepository<BookItem>("books");

function createDevotionalRepository(moduleId: DevotionalModuleId): TrackableRepository<DevotionalItem> {
  const repository = createTrackableRepository<DevotionalItem>(moduleId);
  return {
    ...repository,
    load: async () => (await repository.load()).map((item) => ({ ...item, contexts: item.contexts ?? [], source: item.source ?? null })),
  };
}
