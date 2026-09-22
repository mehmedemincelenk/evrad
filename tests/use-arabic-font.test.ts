import assert from "node:assert/strict";
import test from "node:test";
import {
  ARABIC_FONTS,
  ARABIC_FONT_STORAGE_KEY,
  DEFAULT_ARABIC_FONT_ID,
  buildArabicFontFamilyCss,
  getArabicFont,
} from "../app/core/arabic-fonts";
import {
  isFontAvailable,
  applyArabicFontToDocument,
} from "../app/hooks/useArabicFont";

test("arabic fonts all have valid definitions and style categories", () => {
  assert.equal(ARABIC_FONTS.length, 10);
  for (const font of ARABIC_FONTS) {
    assert.ok(font.id.length > 0);
    assert.ok(font.name.length > 0);
    assert.ok(font.fontFamily.length > 0);
    assert.ok(font.styleCategory.length > 0);
    if (font.id !== DEFAULT_ARABIC_FONT_ID) {
      assert.ok(font.googleFontFamily && font.googleFontFamily.length > 0);
    }
  }
});

test("CSS fallback chain always ends with system font stack", () => {
  const amiriCss = buildArabicFontFamilyCss("Amiri");
  assert.equal(amiriCss, '"Amiri", "Noto Naskh Arabic", Arial, sans-serif');

  const cairoCss = buildArabicFontFamilyCss("Cairo");
  assert.equal(cairoCss, '"Cairo", "Noto Naskh Arabic", Arial, sans-serif');
});

test("isFontAvailable returns true for local default font unconditionally", () => {
  const defaultFont = getArabicFont(DEFAULT_ARABIC_FONT_ID);
  assert.equal(isFontAvailable(defaultFont), true);
});

test("isFontAvailable detects cached fonts in DOM and respects offline availability", () => {
  // Mock browser globals
  const elements = new Map<string, unknown>();
  const customProperties = new Map<string, string>();
  const storage = new Map<string, string>();

  const fakeDocument = {
    getElementById(id: string) {
      return elements.get(id) ?? null;
    },
    createElement(tag: string) {
      return { tag, id: "", rel: "", href: "", onload: null, onerror: null };
    },
    head: {
      appendChild(node: { id: string }) {
        elements.set(node.id, node);
      },
    },
    documentElement: {
      style: {
        setProperty(name: string, value: string) {
          customProperties.set(name, value);
        },
      },
    },
    fonts: {
      check(fontString: string) {
        return fontString.includes("Cairo");
      },
    },
  };

  (globalThis as unknown as { document: unknown }).document = fakeDocument;

  const amiriFont = getArabicFont("amiri");
  const cairoFont = getArabicFont("cairo");

  // Amiri is not yet loaded
  assert.equal(isFontAvailable(amiriFont), false);

  // Cairo is checked via document.fonts
  assert.equal(isFontAvailable(cairoFont), true);

  // Once link is added to DOM, amiri is considered available (cached)
  elements.set(`gfont-${amiriFont.id}`, { id: `gfont-${amiriFont.id}` });
  assert.equal(isFontAvailable(amiriFont), true);

  // Applying font sets CSS variable correctly
  applyArabicFontToDocument(amiriFont);
  assert.equal(customProperties.get("--font-arabic"), '"Amiri", "Noto Naskh Arabic", Arial, sans-serif');

  // Storing preference
  storage.set(ARABIC_FONT_STORAGE_KEY, amiriFont.id);
  assert.equal(storage.get(ARABIC_FONT_STORAGE_KEY), "amiri");

  // Cleanup globals
  delete (globalThis as unknown as { document?: unknown }).document;
});

test("offline font switching blocks un-downloaded fonts and allows cached fonts", () => {
  const messages: string[] = [];
  const showToast = (msg: string) => messages.push(msg);

  const originalNavigator = globalThis.navigator;
  const onLine = false;
  const fakeNavigator = {
    get onLine() {
      return onLine;
    },
  };
  Object.defineProperty(globalThis, "navigator", {
    value: fakeNavigator,
    configurable: true,
    writable: true,
  });

  const lateefFont = getArabicFont("lateef");
  const defaultFont = getArabicFont(DEFAULT_ARABIC_FONT_ID);

  // 1. Un-downloaded font while offline should trigger offline warning message
  const available = isFontAvailable(lateefFont);
  assert.equal(available, false);

  if (!available && !globalThis.navigator.onLine) {
    showToast("Yeni yazı tipleri yalnızca internet bağlantısı varken indirilebilir.");
  }
  assert.equal(messages.length, 1);
  assert.equal(messages[0], "Yeni yazı tipleri yalnızca internet bağlantısı varken indirilebilir.");

  // 2. Default font (or cached font) works even while offline
  const defaultAvailable = isFontAvailable(defaultFont);
  assert.equal(defaultAvailable, true);

  // Cleanup globals
  Object.defineProperty(globalThis, "navigator", {
    value: originalNavigator,
    configurable: true,
    writable: true,
  });
});
