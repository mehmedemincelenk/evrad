import type { DevotionalTemplate } from "./dhikr";
import { prayerCatalog } from "./prayers";

export const memorizationCatalog: DevotionalTemplate[] = prayerCatalog.map((item) => ({
  ...item,
  id: item.id.replace("discover-prayer", "discover-memory"),
  name: `${item.name} ezberi`,
  targetCount: 1,
}));
