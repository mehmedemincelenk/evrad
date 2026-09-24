import { ARABIC_DIACRITICS_STORAGE_KEY } from "./arabic-fonts";
import { DAY_RESET_TIME_STORAGE_KEY } from "./date";

const boolean = (value: string | null) => value !== "false";
const number = (fallback: number, min: number, max: number) => (value: string | null) => {
  const parsed = Number(value);
  return value !== null && Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
};

export const preferences = {
  showDiacritics: { key: ARABIC_DIACRITICS_STORAGE_KEY, fallback: true, parse: boolean },
  showTranslations: { key: "evrad_show_translations", fallback: true, parse: boolean },
  hapticEnabled: { key: "evrad_haptic_feedback", fallback: true, parse: boolean },
  dayResetTime: { key: DAY_RESET_TIME_STORAGE_KEY, fallback: "00:00", parse: (value: string | null) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value ?? "") ? value! : "00:00" },
  fontSizeScale: { key: "evrad_font_size_scale", fallback: 100, parse: number(100, 75, 140) },
  lineHeight: { key: "evrad_line_height_scale", fallback: 1.75, parse: number(1.75, 1.2, 2.5) },
};

export function readPreference(key: string): string | null {
  try { return typeof localStorage === "undefined" ? null : localStorage.getItem(key); }
  catch { return null; }
}

export function writePreference(key: string, value: string): boolean {
  try { localStorage.setItem(key, value); return true; }
  catch { return false; }
}
