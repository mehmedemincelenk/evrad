import type { DevotionalTemplate } from "../discovery-types";

const surah = (id: string, name: string, original: string, translation: string, details: string, source: string): DevotionalTemplate => ({
  id,
  name,
  arabic: original,
  translation,
  details,
  source,
  targetCount: 1,
  targetUnit: "count",
  targetUnitLabel: null,
  listDisplay: "name",
  expandedArabicSize: 1,
  contexts: ["morning", "protection"],
});

export const memorizationCatalog: DevotionalTemplate[] = [
  surah(
    "surah-al-fatiha",
    "Fâtiha Sûresi",
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    "Rahmân ve Rahîm olan Allah’ın adıyla. Hamd, âlemlerin Rabbi Allah’a mahsustur. O, Rahmân ve Rahîm’dir; hesap gününün sahibidir. Yalnız sana kulluk eder ve yalnız senden yardım dileriz. Bizi doğru yola ilet; nimet verdiklerinin yoluna, gazaba uğrayanların ve sapmışların yoluna değil.",
    "Kur’an’ın açılış sûresidir ve yedi âyettir.",
    "Fâtiha sûresi, 1/1-7",
  ),
  surah(
    "surah-al-ikhlas",
    "İhlâs Sûresi",
    "قُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    "De ki: O Allah birdir. Allah Samed’dir. Doğurmamış ve doğmamıştır. Hiçbir şey O’na denk değildir.",
    "Tevhidi özlü biçimde bildiren dört âyetlik sûredir.",
    "İhlâs sûresi, 112/1-4",
  ),
  surah(
    "surah-al-falaq",
    "Felak Sûresi",
    "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\nمِنْ شَرِّ مَا خَلَقَ\nوَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ\nوَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ\nوَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    "De ki: Yarattığı şeylerin kötülüğünden, karanlığı çöktüğünde gecenin kötülüğünden, düğümlere üfleyenlerin kötülüğünden ve kıskandığında kıskancın kötülüğünden sabah aydınlığının Rabbine sığınırım.",
    "Allah’a sığınmayı öğreten beş âyetlik sûredir.",
    "Felak sûresi, 113/1-5",
  ),
  surah(
    "surah-an-nas",
    "Nâs Sûresi",
    "قُلْ أَعُوذُ بِرَبِّ النَّاسِ\nمَلِكِ النَّاسِ\nإِلَٰهِ النَّاسِ\nمِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ\nالَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ\nمِنَ الْجِنَّةِ وَالنَّاسِ",
    "De ki: Cinlerden ve insanlardan olup insanların kalplerine vesvese veren sinsi vesvesecinin kötülüğünden insanların Rabbine, hükümdarına ve ilâhına sığınırım.",
    "Kalbe gelen vesveseden Allah’a sığınmayı öğreten altı âyetlik sûredir.",
    "Nâs sûresi, 114/1-6",
  ),
];
