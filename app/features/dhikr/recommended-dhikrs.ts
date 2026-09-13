import type { Dhikr } from "../../core/types";

type RecommendedDhikr = Omit<Dhikr, "sortOrder" | "createdAt" | "updatedAt">;

const sourceNote = "Kaynak: İslam ve İhsan — En Faziletli Zikirler.";

const esmaulHusna = `اللَّهُ، الرَّحْمَنُ، الرَّحِيمُ، الْمَلِكُ، الْقُدُّوسُ، السَّلَامُ، الْمُؤْمِنُ، الْمُهَيْمِنُ، الْعَزِيزُ، الْجَبَّارُ، الْمُتَكَبِّرُ
الْخَالِقُ، الْبَارِئُ، الْمُصَوِّرُ، الْغَفَّارُ، الْقَهَّارُ، الْوَهَّابُ، الرَّزَّاقُ، الْفَتَّاحُ، الْعَلِيمُ، الْقَابِضُ
الْبَاسِطُ، الْخَافِضُ، الرَّافِعُ، الْمُعِزُّ، الْمُذِلُّ، السَّمِيعُ، الْبَصِيرُ، الْحَكَمُ، الْعَدْلُ، اللَّطِيفُ
الْخَبِيرُ، الْحَلِيمُ، الْعَظِيمُ، الْغَفُورُ، الشَّكُورُ، الْعَلِيُّ، الْكَبِيرُ، الْحَفِيظُ، الْمُقِيتُ، الْحَسِيبُ
الْجَلِيلُ، الْكَرِيمُ، الرَّقِيبُ، الْمُجِيبُ، الْوَاسِعُ، الْحَكِيمُ، الْوَدُودُ، الْمَجِيدُ، الْبَاعِثُ، الشَّهِيدُ
الْحَقُّ، الْوَكِيلُ، الْقَوِيُّ، الْمَتِينُ، الْوَلِيُّ، الْحَمِيدُ، الْمُحْصِي، الْمُبْدِئُ، الْمُعِيدُ، الْمُحْيِي
الْمُمِيتُ، الْحَيُّ، الْقَيُّومُ، الْوَاجِدُ، الْمَاجِدُ، الْوَاحِدُ، الصَّمَدُ، الْقَادِرُ، الْمُقْتَدِرُ، الْمُقَدِّمُ
الْمُؤَخِّرُ، الْأَوَّلُ، الْآخِرُ، الظَّاهِرُ، الْبَاطِنُ، الْوَالِي، الْمُتَعَالِي، الْبَرُّ، التَّوَّابُ، الْمُنْتَقِمُ
الْعَفُوُّ، الرَّؤُوفُ، مَالِكُ الْمُلْكِ، ذُو الْجَلَالِ وَالْإِكْرَامِ، الْمُقْسِطُ، الْجَامِعُ، الْغَنِيُّ، الْمُغْنِي، الْمَانِعُ
الضَّارُّ، النَّافِعُ، النُّورُ، الْهَادِي، الْبَدِيعُ، الْبَاقِي، الْوَارِثُ، الرَّشِيدُ، الصَّبُورُ`;

export const recommendedDhikrs: RecommendedDhikr[] = [
  {
    id: "recommended-subhanallahi-wa-bihamdihi",
    name: "Sübhânallâhi ve bihamdihi",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    translation: "Allah’ı hamdiyle tesbih ederim.",
    details: `Günde yüz defa söylenmesinin bağışlanmaya vesile olduğu aktarılır (Buhârî, Deavât, 65). ${sourceNote}`,
    targetCount: 100,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
  },
  {
    id: "recommended-subhanallahi-azim",
    name: "Sübhânallâhi ve bihamdihi, sübhânallâhi’l-azîm",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    translation: "Allah’ı hamdiyle tesbih ederim; yüce Allah’ı tesbih ederim.",
    details: `Dile hafif, Rahmân’a sevgili ve mizanda ağır iki ifade olarak aktarılır (Buhârî, Deavât, 65). ${sourceNote}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 1,
  },
  {
    id: "recommended-la-hawla",
    name: "Lâ havle ve lâ kuvvete illâ billâh",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    translation: "Güç ve kuvvet ancak Allah’ın yardımıyladır.",
    details: `Cennet hazinelerinden bir hazine olarak anıldığı aktarılır (Buhârî, Deavât, 50). ${sourceNote}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
  },
  {
    id: "recommended-la-ilaha-illallah",
    name: "Lâ ilâhe illallah",
    arabic: "لَا إِلٰهَ إِلَّا اللَّهُ",
    translation: "Allah’tan başka ilâh yoktur.",
    details: `Tevhid sözü olarak imanı yenilemek için çokça söylenmesi tavsiye edilir. ${sourceNote}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
  },
  {
    id: "recommended-four-phrases",
    name: "Dört büyük zikir",
    arabic: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
    translation: "Allah eksik sıfatlardan uzaktır; hamd Allah’adır; Allah’tan başka ilâh yoktur ve Allah en büyüktür.",
    details: `Tesbih, hamd, tevhid ve tekbiri bir araya getirir. ${sourceNote}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 1,
  },
  {
    id: "seed-subhanallah",
    name: "Sübhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    translation: "Allah noksanlıklardan uzaktır.",
    details: `Namazların ardından otuz üç defa okunması tavsiye edilen tesbihlerden biridir. ${sourceNote}`,
    targetCount: 33,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
  },
  {
    id: "seed-alhamdulillah",
    name: "Elhamdülillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    translation: "Hamd ve şükür Allah’adır.",
    details: `Namazların ardından otuz üç defa okunması tavsiye edilen hamd ifadelerindendir. ${sourceNote}`,
    targetCount: 33,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
  },
  {
    id: "seed-allahuakbar",
    name: "Allahu Ekber",
    arabic: "اللَّهُ أَكْبَرُ",
    translation: "Allah en büyüktür.",
    details: `Namazların ardından otuz üç defa okunması tavsiye edilen tekbirlerdendir. ${sourceNote}`,
    targetCount: 33,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
  },
  {
    id: "recommended-esmaul-husna",
    name: "Esmâü’l-Hüsnâ",
    arabic: esmaulHusna,
    translation: "Allah’ın en güzel isimleri.",
    details: `Allah’ın doksan dokuz ismini öğrenip gözetmenin fazileti aktarılır (Buhârî, Deavât, 68). ${sourceNote}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 0,
  },
  {
    id: "seed-hasbunallah",
    name: "Hasbünallâhü ve ni’me’l-vekîl",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    translation: "Allah bize yeter; O ne güzel vekildir.",
    details: `Korku ve sıkıntı zamanlarında güven ve teslimiyeti hatırlatan bir sığınak olarak anlatılır. ${sourceNote}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "arabic",
    expandedArabicSize: 1,
  },
  {
    id: "recommended-distress-dhikr",
    name: "Şiddet ve musibet zikri",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، لَا إِلَهَ إِلَّا اللَّهُ الْعَلِيُّ الْعَظِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ السَّبْعِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    translation: "Halîm ve Kerîm Allah’tan başka ilâh yoktur. Yüce ve Azîm Allah’tan başka ilâh yoktur. Yedi göğün ve şerefli Arş’ın Rabbi Allah’tan başka ilâh yoktur.",
    details: `Sıkıntı ve musibet anlarında ferahlık dileğiyle okunan uzun bir zikir olarak aktarılır. ${sourceNote}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 0,
  },
];

function normalizeIdentity(value: string | null): string {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "")
    .toLocaleLowerCase("tr");
}

export function getMissingRecommendedDhikrs(existing: Dhikr[]): RecommendedDhikr[] {
  const ids = new Set(existing.map((item) => item.id));
  const arabic = new Set(existing.map((item) => normalizeIdentity(item.arabic)).filter(Boolean));
  const names = new Set(existing.map((item) => normalizeIdentity(item.name)).filter(Boolean));
  return recommendedDhikrs.filter((item) => (
    !ids.has(item.id)
    && (!item.arabic || !arabic.has(normalizeIdentity(item.arabic)))
    && (!item.name || !names.has(normalizeIdentity(item.name)))
  ));
}
