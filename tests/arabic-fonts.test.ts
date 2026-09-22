import assert from "node:assert/strict";
import test from "node:test";
import {
  ARABIC_FONTS,
  ARABIC_FONT_SAMPLE,
  DEFAULT_ARABIC_FONT_ID,
  buildArabicFontFamilyCss,
  formatArabicDiacritics,
  getArabicFont,
  getGoogleFontsUrl,
  getArabicPreviewFontsUrl,
  stripArabicDiacritics,
} from "../app/core/arabic-fonts";

test("arabic fonts set contains all 18 fonts including highly legible PC fonts", () => {
  assert.equal(DEFAULT_ARABIC_FONT_ID, "noto-naskh-arabic");
  assert.equal(ARABIC_FONTS.length, 18);

  const expectedNames = [
    "Noto Naskh Arabic",
    "Amiri",
    "Scheherazade New",
    "Lateef",
    "Cairo",
    "Tajawal",
    "Reem Kufi",
    "Noto Kufi Arabic",
    "IBM Plex Sans Arabic",
    "Mada",
    "Readex Pro",
    "Almarai",
    "Vazirmatn",
    "Rubik Arabic",
    "Alexandria",
    "Harmattan",
    "El Messiri",
    "Changa",
  ];

  for (const name of expectedNames) {
    const found = ARABIC_FONTS.find((font) => font.name === name);
    assert.ok(found, `Expected font ${name} not found in ARABIC_FONTS`);
  }

  // Default font must be local (no remote googleFontFamily required)
  const defaultFont = getArabicFont(DEFAULT_ARABIC_FONT_ID);
  assert.equal(defaultFont.googleFontFamily, undefined);
  assert.equal(defaultFont.fontFamily, "Noto Naskh Arabic");
});

test("stripArabicDiacritics removes all tashkeel (fatha, damma, kasra, shadda, sukun, tanween)", () => {
  const original = "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ";
  const stripped = stripArabicDiacritics(original);
  assert.equal(stripped, "بسم الله الرحمن الرحيم");

  const surahFatiha = "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ";
  assert.equal(stripArabicDiacritics(surahFatiha), "الحمد لله رب العالمين");

  const subhanallah = "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ";
  assert.equal(stripArabicDiacritics(subhanallah), "سبحان الله وبحمده");
});

test("formatArabicDiacritics respects showDiacritics toggle boolean", () => {
  const text = "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ";
  assert.equal(formatArabicDiacritics(text, true), text);
  assert.equal(formatArabicDiacritics(text, false), "بسم الله الرحمن الرحيم");
});

test("getArabicFont falls back to default font when given unknown id", () => {
  const fallback = getArabicFont("non-existent-font");
  assert.equal(fallback.id, DEFAULT_ARABIC_FONT_ID);
});

test("buildArabicFontFamilyCss formats CSS font-family correctly", () => {
  const defaultCss = buildArabicFontFamilyCss("Noto Naskh Arabic");
  assert.equal(defaultCss, '"Noto Naskh Arabic", Arial, sans-serif');

  const readexCss = buildArabicFontFamilyCss("Readex Pro");
  assert.equal(readexCss, '"Readex Pro", "Noto Naskh Arabic", Arial, sans-serif');
});

test("getGoogleFontsUrl generates valid CSS API v2 URL", () => {
  const url = getGoogleFontsUrl("Readex+Pro:wght@400;600");
  assert.equal(url, "https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;600&display=swap");
});

test("ARABIC_FONT_SAMPLE contains exact Alhamdulillah text", () => {
  assert.equal(ARABIC_FONT_SAMPLE, "الْحَمْدُ لِلَّهِ");
});

test("getArabicPreviewFontsUrl generates combined preview URL with text subset including new PC fonts", () => {
  const previewUrl = getArabicPreviewFontsUrl();
  assert.ok(previewUrl.startsWith("https://fonts.googleapis.com/css2?"));
  assert.ok(previewUrl.includes("family=Amiri"));
  assert.ok(previewUrl.includes("family=Readex+Pro"));
  assert.ok(previewUrl.includes("family=Almarai"));
  assert.ok(previewUrl.includes("family=Vazirmatn"));
  assert.ok(previewUrl.includes(`text=${encodeURIComponent(ARABIC_FONT_SAMPLE)}`));
});
