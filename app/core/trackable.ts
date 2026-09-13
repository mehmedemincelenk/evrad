import type { TrackableModuleId } from "./types";

export interface TrackableEntity {
  id: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrackableRepository<T extends TrackableEntity> {
  moduleId: TrackableModuleId;
  load: () => Promise<T[]>;
  save: (item: T) => Promise<void>;
  saveOrder: (items: T[]) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
