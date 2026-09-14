import type { DevotionalModuleId, ModuleId } from "../../core/types";
import { bookCatalog } from "./catalogs/books";
import { dhikrCatalog, type DevotionalTemplate } from "./catalogs/dhikr";
import { memorizationCatalog } from "./catalogs/memorization";
import { prayerCatalog } from "./catalogs/prayers";

const devotionalCatalogs: Record<DevotionalModuleId, DevotionalTemplate[]> = {
  dhikr: dhikrCatalog,
  prayers: prayerCatalog,
  memorization: memorizationCatalog,
};

export function getDevotionalCatalog(moduleId: DevotionalModuleId): DevotionalTemplate[] {
  return devotionalCatalogs[moduleId];
}

export function getCatalogSize(moduleId: ModuleId): number {
  if (moduleId === "books") return bookCatalog.length;
  if (moduleId === "games") return 0;
  return devotionalCatalogs[moduleId].length;
}

export { bookCatalog };
