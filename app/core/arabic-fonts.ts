export interface ArabicFontDefinition {
  id: string;
  name: string;
  fontFamily: string;
  googleFontFamily?: string;
  styleCategory: string;
}

export const DEFAULT_ARABIC_FONT_ID = "noto-naskh-arabic";
export const ARABIC_FONT_STORAGE_KEY = "evrad_arabic_font";
export const ARABIC_FONT_SAMPLE = "الْحَمْدُ لِلَّهِ";

export const ARABIC_FONTS: readonly ArabicFontDefinition[] = [
  {
    id: "noto-naskh-arabic",
    name: "Noto Naskh Arabic",
    fontFamily: "Noto Naskh Arabic",
    styleCategory: "Klasik Nesih (Varsayılan)",
  },
  {
    id: "amiri",
    name: "Amiri",
    fontFamily: "Amiri",
    googleFontFamily: "Amiri:wght@400;700",
    styleCategory: "Klasik Matbaa",
  },
  {
    id: "scheherazade-new",
    name: "Scheherazade New",
    fontFamily: "Scheherazade New",
    googleFontFamily: "Scheherazade+New:wght@400;700",
    styleCategory: "Mushaf Nesih",
  },
  {
    id: "lateef",
    name: "Lateef",
    fontFamily: "Lateef",
    googleFontFamily: "Lateef:wght@400;700",
    styleCategory: "Yumuşak Hat",
  },
  {
    id: "cairo",
    name: "Cairo",
    fontFamily: "Cairo",
    googleFontFamily: "Cairo:wght@400;700",
    styleCategory: "Modern Başlık",
  },
  {
    id: "tajawal",
    name: "Tajawal",
    fontFamily: "Tajawal",
    googleFontFamily: "Tajawal:wght@400;700",
    styleCategory: "Sade Geometrik",
  },
  {
    id: "reem-kufi",
    name: "Reem Kufi",
    fontFamily: "Reem Kufi",
    googleFontFamily: "Reem+Kufi:wght@400;700",
    styleCategory: "Klasik Kûfî",
  },
  {
    id: "noto-kufi-arabic",
    name: "Noto Kufi Arabic",
    fontFamily: "Noto Kufi Arabic",
    googleFontFamily: "Noto+Kufi+Arabic:wght@400;700",
    styleCategory: "Modern Kûfî",
  },
  {
    id: "ibm-plex-sans-arabic",
    name: "IBM Plex Sans Arabic",
    fontFamily: "IBM Plex Sans Arabic",
    googleFontFamily: "IBM+Plex+Sans+Arabic:wght@400;700",
    styleCategory: "Teknik Düz Hat",
  },
  {
    id: "mada",
    name: "Mada",
    fontFamily: "Mada",
    googleFontFamily: "Mada:wght@400;700",
    styleCategory: "Yuvarlak Modern",
  },
  {
    id: "readex-pro",
    name: "Readex Pro",
    fontFamily: "Readex Pro",
    googleFontFamily: "Readex+Pro:wght@400;600",
    styleCategory: "Ekran Okuma (Maksimum Netlik)",
  },
  {
    id: "almarai",
    name: "Almarai",
    fontFamily: "Almarai",
    googleFontFamily: "Almarai:wght@400;700",
    styleCategory: "PC & Medya (Çok Okunaklı)",
  },
  {
    id: "vazirmatn",
    name: "Vazirmatn",
    fontFamily: "Vazirmatn",
    googleFontFamily: "Vazirmatn:wght@400;700",
    styleCategory: "Modern Web & PC Arayüzü",
  },
  {
    id: "rubik-arabic",
    name: "Rubik Arabic",
    fontFamily: "Rubik",
    googleFontFamily: "Rubik:wght@400;600",
    styleCategory: "Yuvarlatılmış Ferah Hat",
  },
  {
    id: "alexandria",
    name: "Alexandria",
    fontFamily: "Alexandria",
    googleFontFamily: "Alexandria:wght@400;600",
    styleCategory: "Geometrik Modern",
  },
  {
    id: "harmattan",
    name: "Harmattan",
    fontFamily: "Harmattan",
    googleFontFamily: "Harmattan:wght@400;700",
    styleCategory: "Sakin Sade Nesih",
  },
  {
    id: "el-messiri",
    name: "El Messiri",
    fontFamily: "El Messiri",
    googleFontFamily: "El+Messiri:wght@400;600",
    styleCategory: "Dengeli Modern Hat",
  },
  {
    id: "changa",
    name: "Changa",
    fontFamily: "Changa",
    googleFontFamily: "Changa:wght@400;600",
    styleCategory: "Geniş Dijital Başlık",
  },
] as const;

export const ARABIC_DIACRITICS_STORAGE_KEY = "evrad_show_diacritics";
export const ARABIC_DIACRITICS_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

export function stripArabicDiacritics(text: string): string {
  if (!text) return text;
  return text.replace(ARABIC_DIACRITICS_REGEX, "");
}

export function formatArabicDiacritics(text: string, showDiacritics = true): string {
  if (showDiacritics) return text;
  return stripArabicDiacritics(text);
}

export function getArabicFont(id: string | null | undefined): ArabicFontDefinition {
  return ARABIC_FONTS.find((font) => font.id === id) ?? ARABIC_FONTS[0];
}

export function buildArabicFontFamilyCss(fontFamily: string): string {
  if (fontFamily === "Noto Naskh Arabic") {
    return '"Noto Naskh Arabic", Arial, sans-serif';
  }
  return `"${fontFamily}", "Noto Naskh Arabic", Arial, sans-serif`;
}

export function getGoogleFontsUrl(googleFontFamily: string): string {
  return `https://fonts.googleapis.com/css2?family=${googleFontFamily}&display=swap`;
}

export function getArabicPreviewFontsUrl(): string {
  const families = ARABIC_FONTS
    .filter((font) => Boolean(font.googleFontFamily))
    .map((font) => `family=${encodeURIComponent(font.fontFamily).replaceAll("%20", "+")}`)
    .join("&");
  const textParam = encodeURIComponent(ARABIC_FONT_SAMPLE);
  return `https://fonts.googleapis.com/css2?${families}&text=${textParam}&display=swap`;
}



