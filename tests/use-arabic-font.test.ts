import assert from "node:assert/strict";
import test from "node:test";
import {
  ARABIC_FONTS,
  DEFAULT_ARABIC_FONT_ID,
  buildArabicFontFamilyCss,
  getArabicFont,
} from "../app/core/arabic-fonts";
import {
  isFontAvailable,
  loadGoogleFont,
  applyArabicFontToDocument,
} from "../app/data/arabic-font-loader";

test("arabic fonts all have valid definitions and style categories", () => {
  assert.equal(new Set(ARABIC_FONTS.map((font) => font.id)).size, ARABIC_FONTS.length);
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

test("font loads share one request, reject missing faces and allow retry after failure", async () => {
  const elements = new Map<string, FakeLink>();
  class FakeLink extends EventTarget {
    id = "";
    rel = "";
    href = "";
    remove() { elements.delete(this.id); }
  }
  const documentBefore = Object.getOwnPropertyDescriptor(globalThis, "document");
  let loadFaces = async (): Promise<unknown[]> => [{}];
  Object.defineProperty(globalThis, "document", { configurable: true, value: {
    getElementById: (id: string) => elements.get(id),
    createElement: () => new FakeLink(),
    head: { appendChild: (link: FakeLink) => elements.set(link.id, link) },
    fonts: { [Symbol.iterator]: () => [][Symbol.iterator](), load: () => loadFaces(), check: () => true },
  } });
  try {
    const cairo = getArabicFont("cairo");
    const first = loadGoogleFont(cairo);
    assert.equal(loadGoogleFont(cairo), first);
    assert.equal(elements.size, 1);
    elements.get("gfont-cairo")!.dispatchEvent(new Event("load"));
    await first;

    const amiri = getArabicFont("amiri");
    loadFaces = async () => [];
    const missing = loadGoogleFont(amiri);
    elements.get("gfont-amiri")!.dispatchEvent(new Event("load"));
    await assert.rejects(missing, /Font load failed/);
    assert.equal(elements.has("gfont-amiri"), false);

    loadFaces = () => new Promise(() => undefined);
    const stalled = loadGoogleFont(amiri, 10);
    elements.get("gfont-amiri")!.dispatchEvent(new Event("load"));
    await assert.rejects(stalled, /Font load timeout/);

    loadFaces = async () => [{}];
    const retried = loadGoogleFont(amiri);
    elements.get("gfont-amiri")!.dispatchEvent(new Event("load"));
    await retried;
  } finally {
    if (documentBefore) Object.defineProperty(globalThis, "document", documentBefore);
    else delete (globalThis as { document?: unknown }).document;
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
  const faces: { family: string; status: string }[] = [];

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
      check() { return true; }, // Browsers also return true for nonexistent families.
      [Symbol.iterator]() { return faces[Symbol.iterator](); },
    },
  };

  (globalThis as unknown as { document: unknown }).document = fakeDocument;

  const amiriFont = getArabicFont("amiri");
  const cairoFont = getArabicFont("cairo");

  // Amiri is not yet loaded
  assert.equal(isFontAvailable(amiriFont), false);

  faces.push({ family: '"Cairo"', status: "loaded" });
  assert.equal(isFontAvailable(cairoFont), true);

  // An existing stylesheet does not prove its fonts have loaded.
  elements.set(`gfont-${amiriFont.id}`, { id: `gfont-${amiriFont.id}` });
  assert.equal(isFontAvailable(amiriFont), false);
  faces.push({ family: "Amiri", status: "loading" });
  assert.equal(isFontAvailable(amiriFont), false);
  faces[1].status = "loaded";
  assert.equal(isFontAvailable(amiriFont), true);

  // Applying font sets CSS variable correctly
  applyArabicFontToDocument(amiriFont);
  assert.equal(customProperties.get("--font-arabic"), '"Amiri", "Noto Naskh Arabic", Arial, sans-serif');

  // Cleanup globals
  delete (globalThis as unknown as { document?: unknown }).document;
});
