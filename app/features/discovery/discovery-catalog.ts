import type { DevotionalModuleId } from "../../core/types";
import type { DevotionalTemplate } from "./discovery-types";

const sourceNote = "Kaynak: İslam ve İhsan — En Faziletli Zikirler.";

export const discoveryCatalog: { moduleId: DevotionalModuleId; item: DevotionalTemplate }[] = [{
  moduleId: "dhikr",
  item: {
    id: "recommended-la-ilaha-illallah",
    name: "Lâ ilâhe illallah",
    arabic: "لَا إِلٰهَ إِلَّا اللَّهُ",
    translation: "Allah’tan başka ilâh yoktur.",
    details: `Tevhid sözü olan bu zikrin ölüm anında ferahlık, kıyamette nur olacağı aktarılır. İmanı yenilemek için çokça söylenmesi tavsiye edilir (İbn Hanbel, II, 359; Hâkim, IV, 285/7657). İhlâsla söylendiğinde Allah’ın rahmetine vesile olacağına dair rivayet de aktarılır (Tirmizî, Deavât, 86). Son sözü bu olan mümin için cennet müjdesine yer verilir (Ebû Dâvûd, Cenâiz, 15-16).\n\n${sourceNote}`,
    source: "İslam ve İhsan — En Faziletli Zikirler",
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
    contexts: ["relief"],
  },
}];
