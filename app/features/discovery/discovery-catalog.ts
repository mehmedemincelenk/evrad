import type { DevotionalModuleId } from "../../core/types";
import { bookCatalog } from "./catalogs/books";
import { dhikrCatalog } from "./catalogs/dhikr";
import { memorizationCatalog } from "./catalogs/memorization";
import { prayerCatalog } from "./catalogs/prayers";

import type { DevotionalTemplate } from "./discovery-types";

const devotionalCatalogs: Record<DevotionalModuleId, DevotionalTemplate[]> = {
  dhikr: dhikrCatalog,
  prayers: prayerCatalog,
  memorization: memorizationCatalog,
};

export function getDevotionalCatalog(moduleId: DevotionalModuleId): DevotionalTemplate[] {
  return devotionalCatalogs[moduleId];
}

export { bookCatalog };
