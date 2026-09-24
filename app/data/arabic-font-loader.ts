import { ARABIC_FONT_SAMPLE, ARABIC_FONT_STORAGE_KEY, DEFAULT_ARABIC_FONT_ID, getArabicFont, buildArabicFontFamilyCss,
  getGoogleFontsUrl, type ArabicFontDefinition } from "../core/arabic-fonts";
import { readPreference } from "../core/preferences";

export function isFontAvailable(font: ArabicFontDefinition): boolean {
  if (font.id === DEFAULT_ARABIC_FONT_ID) return true;
  if (typeof document === "undefined") return false;
  // check() alone returns true even for nonexistent families; a <link> may
  // still be downloading. Require a real face plus the Arabic glyph subset.
  const faces = Array.from(document.fonts ?? []);
  return faces.some((face) => face.family.replace(/['"]/g, "") === font.fontFamily && face.status === "loaded")
    && document.fonts.check(`16px "${font.fontFamily}"`, ARABIC_FONT_SAMPLE);
}

const fontLoads = new Map<string, Promise<void>>();

export function loadGoogleFont(font: ArabicFontDefinition, timeoutMs = 9000): Promise<void> {
  if (typeof document === "undefined" || !font.googleFontFamily || isFontAvailable(font)) return Promise.resolve();
  const pending = fontLoads.get(font.id);
  if (pending) return pending;
  const linkId = `gfont-${font.id}`;
  const existing = document.getElementById(linkId) as HTMLLinkElement | null;
  const link = existing ?? document.createElement("link");
  const loading = new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      link.removeEventListener("load", loaded);
      link.removeEventListener("error", failed);
      if (error) { link.remove(); reject(error); } else resolve();
    };
    const failed = () => finish(new Error("Font load failed"));
    const loaded = () => {
      if (!document.fonts) return finish();
      document.fonts.load(`16px "${font.fontFamily}"`, ARABIC_FONT_SAMPLE)
        .then((faces) => faces.length ? finish() : failed()).catch(failed);
    };
    // The timeout covers both stylesheet and font data, including offline stalls.
    const timer = setTimeout(() => finish(new Error("Font load timeout")), timeoutMs);
    link.addEventListener("load", loaded);
    link.addEventListener("error", failed);
    if (existing?.sheet) loaded();
    else if (!existing) {
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = getGoogleFontsUrl(font.googleFontFamily!);
      document.head.appendChild(link);
    }
  });
  fontLoads.set(font.id, loading);
  void loading.catch(() => fontLoads.delete(font.id));
  return loading;
}

export function applyArabicFontToDocument(font: ArabicFontDefinition): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--font-arabic", buildArabicFontFamilyCss(font.fontFamily));
}

export function applyStoredArabicFont(): void {
  if (typeof window === "undefined") return;
  const storedId = readPreference(ARABIC_FONT_STORAGE_KEY);
  if (!storedId || storedId === DEFAULT_ARABIC_FONT_ID) return;
  const font = getArabicFont(storedId);
  if (!font.googleFontFamily) return;

  loadGoogleFont(font).then(() => {
    applyArabicFontToDocument(font);
  }).catch(() => {
    // Sessizce varsayılan font korunur
  });
}

