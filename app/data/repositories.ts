import type { BookItem, DevotionalItem, DevotionalModuleId, TrackableRepository } from "../core/types";
import { createTrackableRepository } from "./trackable-repository";

export const devotionalRepositories: Record<DevotionalModuleId, TrackableRepository<DevotionalItem>> = {
  dhikr: createTrackableRepository("dhikr"),
  prayers: createTrackableRepository("prayers"),
  memorization: createTrackableRepository("memorization"),
};

export const bookRepository = createTrackableRepository<BookItem>("books");
