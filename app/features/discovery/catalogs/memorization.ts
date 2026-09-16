import type { DevotionalTemplate } from "../discovery-types";
import { shortSurahCatalog } from "./short-surahs";

// V1 keşfinde yalnız İnşirâh ve yaygın namaz sûreleri yer alır.
// Daha önce kaldırılmış Esmâ ve hadis koleksiyonları kendiliğinden geri eklenmez.
const v1SurahIds = new Set([
  "surah-94",
  "surah-105",
  "surah-106",
  "surah-107",
  "surah-108",
  "surah-109",
  "surah-110",
  "surah-111",
  "surah-al-ikhlas",
  "surah-al-falaq",
  "surah-an-nas",
]);

export const memorizationCatalog: DevotionalTemplate[] = shortSurahCatalog.filter((item) => v1SurahIds.has(item.id));
