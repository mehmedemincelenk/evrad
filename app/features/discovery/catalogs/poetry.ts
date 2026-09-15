import type { DevotionalTemplate } from "../discovery-types";

const poem = (
  id: string,
  name: string,
  original: string,
  source: string,
  contexts: DevotionalTemplate["contexts"] = [],
): DevotionalTemplate => ({
  id,
  name,
  arabic: original,
  translation: null,
  details: null,
  source,
  targetCount: null,
  targetUnit: "count",
  targetUnitLabel: null,
  listDisplay: "name",
  expandedArabicSize: 1,
  contexts,
});

export const poetryCatalog: DevotionalTemplate[] = [
  poem("poem-yunus-bana-seni-gerek", "Bana Seni Gerek Seni", `Aşkın aldı benden beni
Bana seni gerek seni
Ben yanarım dün ü günü
Bana seni gerek seni`, "Yunus Emre", ["relief"]),
  poem("poem-yunus-ilim-kendin-bilmektir", "İlim Kendin Bilmektir", `İlim ilim bilmektir
İlim kendin bilmektir
Sen kendini bilmezsin
Ya nice okumaktır`, "Yunus Emre", ["gratitude"]),
  poem("poem-haci-bayram-nagehan", "Nâgehân Ol Şâra Vardım", `Nâgehân ol şâra vardım
Ol şârı yapılır gördüm
Ben dahi bile yapıldım
Taş u toprak arasında`, "Hacı Bayram-ı Velî", ["gratitude"]),
  poem("poem-niyazi-derman-arardim", "Dermân Arardım Derdime", `Dermân arardım derdime
Derdim bana dermân imiş
Bürhân arardım aslıma
Aslım bana bürhân imiş`, "Niyâzî-i Mısrî", ["relief"]),
  poem("poem-hudayi-kudumun-rahmeti", "Kudûmün Rahmet ü Zevk u Safâdır", `Kudûmün rahmet ü zevk u safâdır yâ Resûlallah
Zuhûrun derd-i uşşâka devâdır yâ Resûlallah`, "Aziz Mahmud Hüdâyî", ["gratitude"]),
  poem("poem-esrefoglu-ey-allahim", "Ey Allah’ım", `Ey Allah'ım beni senden ayırma
Beni senin didârından ayırma
Seni sevmek benim dinim imanım
İlâhî din ü imandan ayırma`, "Eşrefoğlu Rûmî", ["protection"]),
  poem("poem-seyh-galib-hosca-bak", "Hoşça Bak Zâtına", `Hoşça bak zâtına kim zübde-i âlemsin sen
Merdüm-i dîde-i ekvân olan âdemsin sen`, "Şeyh Gâlib", ["gratitude"]),
  poem("poem-mevlana-gel", "Gel", `Gel, gel, ne olursan ol yine gel
İster kâfir, ister Mecûsî, ister puta tapan ol yine gel
Bizim dergâhımız ümitsizlik dergâhı değildir
Yüz kere tövbeni bozmuş olsan da yine gel`, "Mevlânâ’ya atfedilen rubâî", ["forgiveness", "relief"]),
];
