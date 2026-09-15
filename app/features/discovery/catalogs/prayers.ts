import type { DevotionalTemplate } from "../discovery-types";

const quranSource = "Kaynak: Kur’an-ı Kerim, Diyanet İşleri Başkanlığı meali.";

export const prayerCatalog: DevotionalTemplate[] = [
  {
    id: "discover-prayer-rabbana-atina",
    name: "Rabbenâ Âtinâ",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.",
    details: `Dünya ve ahiret iyiliğini birlikte isteyen kuşatıcı bir Kur’an duasıdır. Bakara sûresinin 201. âyetinde yer alır.\n\n${quranSource}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 1,
    contexts: [],
  },
  {
    id: "discover-prayer-rabbana-ghfirli",
    name: "Rabbenâğfir lî",
    arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    translation: "Rabbimiz! Hesap görülecek günde beni, ana-babamı ve inananları bağışla.",
    details: `Kişinin kendisiyle birlikte anne-babası ve bütün müminler için bağışlanma istediği Kur’an duasıdır. İbrâhîm sûresinin 41. âyetinde yer alır.\n\n${quranSource}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 1,
    contexts: [],
  },
  {
    id: "discover-prayer-yunus",
    name: "Yûnus Peygamber’in duası",
    arabic: "لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    translation: "Senden başka hiçbir ilâh yoktur. Seni eksikliklerden uzak tutarım. Ben gerçekten kendine zulmedenlerden oldum.",
    details: `Yûnus Peygamber’in karanlıklar içinde yaptığı bu dua tevhid, tesbih ve samimi kabulü bir araya getirir. Enbiyâ sûresinin 87. âyetinde aktarılır; devamındaki âyette duasının kabul edildiği bildirilir.\n\n${quranSource}`,
    targetCount: null,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 1,
    contexts: [],
  },
];
