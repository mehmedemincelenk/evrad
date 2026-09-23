import type { DevotionalModuleId } from "../../core/types";
import { dhikrTemplates } from "./discovery-dhikr";
import { prayerTemplates } from "./discovery-prayers";
import { surahTemplates } from "./discovery-surahs";
import { memorizationTemplates } from "./discovery-memorization";
import type { DevotionalTemplate } from "./discovery-types";

export const discoveryCatalog: { moduleId: DevotionalModuleId; item: DevotionalTemplate }[] = [
  ...dhikrTemplates,
  ...prayerTemplates,
  ...surahTemplates,
  ...memorizationTemplates,
];
