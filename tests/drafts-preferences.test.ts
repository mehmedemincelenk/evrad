import assert from "node:assert/strict";
import test from "node:test";
import { devotionalDraft, draftFromText, trimDraft } from "../app/core/devotional-draft";
import { devotionalFromDraft } from "../app/core/devotional";
import { preferences, readPreference, writePreference } from "../app/core/preferences";
import { getDayResetTime } from "../app/core/date";
import { triggerHaptic } from "../app/core/haptics";

test("quick and detailed creation share complete defaults and preserve original text", () => {
  for (const text of ["  Kişisel kayıt  ", "  الْحَمْدُ لِلَّهِ  "]) {
    const draft = draftFromText(text, "prayers");
    const item = devotionalFromDraft("dhikr", draft, null, 5);
    assert.ok(item.id);
    assert.equal(typeof item.createdAt, "string");
    assert.equal(item.expandedArabicSize, 1);
    assert.deepEqual(item.bagCategories, ["prayers"]);
    assert.deepEqual(item.contexts, ["general"]);
    assert.equal(item.name ?? item.arabic, text.trim());
    assert.deepEqual(devotionalDraft(item), draft);
  }
  assert.deepEqual(devotionalDraft(null).contexts, []);
  assert.equal(draftFromText("   ").name, "");
});

test("editing a shared draft preserves identity, membership and independent orders", () => {
  const existing = { ...devotionalFromDraft("dhikr", draftFromText("Eski"), null, 7),
    liked: false, inVirds: true, virdSortOrder: 13, expandedArabicSize: 3 as const };
  const draft = devotionalDraft(existing);
  draft.name = "Yeni";
  const updated = devotionalFromDraft("dhikr", draft, existing, 999);
  assert.equal(updated.id, existing.id);
  assert.equal(updated.createdAt, existing.createdAt);
  assert.equal(updated.sortOrder, 7);
  assert.equal(updated.virdSortOrder, 13);
  assert.equal(updated.liked, false);
  assert.equal(updated.inVirds, true);
  assert.equal(updated.expandedArabicSize, 3);
  assert.equal(existing.name, "Eski");
});

test("form normalization is immutable and preserves arrays and Arabic diacritics", () => {
  const draft = Object.freeze({ ...draftFromText("الحمد لله"), arabic: "  الْحَمْدُ لِلَّهِ  ", targetCount: " 33 ", details: " A\nB " });
  const normalized = trimDraft(draft);
  assert.equal(normalized.arabic, "الْحَمْدُ لِلَّهِ");
  assert.equal(normalized.targetCount, "33");
  assert.equal(normalized.details, "A\nB");
  assert.equal(normalized.contexts, draft.contexts);
  assert.equal(draft.targetCount, " 33 ");
});

test("stored preferences tolerate invalid numbers and reject invalid reset times", () => {
  for (const value of [null, "NaN", "Infinity", "0", "200"]) assert.equal(preferences.fontSizeScale.parse(value), 100);
  assert.equal(preferences.fontSizeScale.parse("75"), 75);
  assert.equal(preferences.fontSizeScale.parse("140"), 140);
  assert.equal(preferences.lineHeight.parse("2.5"), 2.5);
  assert.equal(preferences.lineHeight.parse("2.6"), 1.75);
  for (const value of [null, "24:00", "12:60", "bad", "4:00"]) assert.equal(preferences.dayResetTime.parse(value), "00:00");
  assert.equal(preferences.dayResetTime.parse("04:30"), "04:30");
  assert.equal(preferences.showDiacritics.parse("false"), false);
  assert.equal(preferences.showDiacritics.parse(null), true);
});

test("restricted storage does not crash reading or claim a successful write", (context) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("Storage blocked"); } });
  context.after(() => {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else Reflect.deleteProperty(globalThis, "localStorage");
  });
  assert.equal(readPreference("any"), null);
  assert.equal(writePreference("any", "true"), false);
  assert.equal(getDayResetTime(), "00:00");
});

test("haptic preference is respected even when vibration exists or throws", (context) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  const calls: number[] = [];
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: {
    vibrate(duration: number) { calls.push(duration); throw new Error("Unsupported"); },
  } });
  context.after(() => {
    if (previous) Object.defineProperty(globalThis, "navigator", previous);
    else Reflect.deleteProperty(globalThis, "navigator");
  });
  triggerHaptic(false, 5);
  triggerHaptic(true, 12);
  assert.deepEqual(calls, [12]);
});
