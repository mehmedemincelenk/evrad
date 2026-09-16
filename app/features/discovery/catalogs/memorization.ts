import type { DevotionalTemplate } from "../discovery-types";
import { asmaAlHusnaCatalog } from "./asma-al-husna";
import { memorizationTemplate } from "./memorization-template";
import { shortHadithCatalog } from "./short-hadiths";
import { shortSurahCatalog } from "./short-surahs";

const fatiha = memorizationTemplate(
  "surah-al-fatiha",
  "Fâtiha Sûresi",
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
  "Rahmân ve Rahîm olan Allah’ın adıyla. Hamd, âlemlerin Rabbi Allah’a mahsustur. O, Rahmân ve Rahîm’dir; hesap gününün sahibidir. Yalnız sana kulluk eder ve yalnız senden yardım dileriz. Bizi doğru yola ilet; nimet verdiklerinin yoluna, gazaba uğrayanların ve sapmışların yoluna değil.",
  "Kur’an-ı Kerîm’in açılış sûresidir ve yedi âyettir.",
  "Fâtiha sûresi, 1/1-7 · Meal: Diyanet İşleri",
);

export const memorizationCatalog: DevotionalTemplate[] = [
  fatiha,
  ...shortSurahCatalog,
  ...asmaAlHusnaCatalog,
  ...shortHadithCatalog,
];
