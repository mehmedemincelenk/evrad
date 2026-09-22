import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { before, test } from "node:test";
import { collectionRepository } from "../app/data/collection-repository";
import { completionRepository } from "../app/data/completion-repository";
import { readBackupPayload } from "../app/data/backup-repository";
import { ENTITY_STORES, openDatabase, requestResult, runTransaction } from "../app/data/indexed-db";
import { collectionEntry, selectCollection } from "../app/core/collections";
import { getLocalDateKey } from "../app/core/date";
import { matchesRecordFilters, toggleSelection } from "../app/core/record-filters";
import { getDefaultRecordCategory, getRecordIcon } from "../app/core/record-categories";
import { discoveryCatalog } from "../app/features/discovery/discovery-catalog";
import type { DevotionalItem } from "../app/core/types";

const legacy: DevotionalItem = {
  ...discoveryCatalog[0].item, id: "same-id", name: "Personal text",
  sortOrder: 17, createdAt: "2020-01-01", updatedAt: "2020-01-02",
};
const ref = { moduleId: "dhikr", itemId: legacy.id } as const;
const prayerRef = { moduleId: "prayers", itemId: legacy.id } as const;

before(async () => {
  const request = indexedDB.open("zikirlerim", 3);
  request.onupgradeneeded = () => {
    for (const name of Object.values(ENTITY_STORES)) request.result.createObjectStore(name, { keyPath: "id" });
    const completions = request.result.createObjectStore("completions", { keyPath: "key" });
    completions.createIndex("localDate", "localDate");
    completions.createIndex("itemId", "itemId");
    request.transaction!.objectStore("dhikrs").put(legacy);
    request.transaction!.objectStore("prayers").put({ ...legacy, liked: false });
    completions.put({ key: "dhikr:same-id:2020-01-01", itemType: "dhikr", itemId: legacy.id, localDate: "2020-01-01", completedAt: "2020-01-01" });
  };
  (await requestResult(request)).close();
});

test("upgrade preserves pre-v5 records, order, history and explicit membership", async () => {
  assert.equal((await openDatabase()).version, 8);
  const backup = await readBackupPayload();
  const dhikr = backup.entities.dhikr[0];
  assert.equal(dhikr.name, legacy.name);
  assert.equal(dhikr.createdAt, legacy.createdAt);
  assert.equal(dhikr.sortOrder, 17);
  assert.equal(dhikr.virdSortOrder, 17);
  assert.equal(dhikr.inVirds, true);
  assert.equal(dhikr.liked, true);
  assert.equal(backup.entities.prayers[0].liked, false);
  assert.equal(backup.completions.length, 1);
});

test("same ID in separate legacy stores stays distinct", async () => {
  const entries = await collectionRepository.load();
  assert.equal(new Set(entries.map((entry) => entry.id)).size, 2);
  assert.equal(selectCollection(entries, "virds").length, 1);
});

test("heart and plus are independent and never replace customized content", async () => {
  const template = { ...discoveryCatalog[0].item, id: "new-template" };
  const target = { moduleId: "dhikr", itemId: template.id } as const;
  const added = await collectionRepository.setMembership(target, "virds", true, template);
  assert.equal(added.inVirds, true);
  assert.equal(added.liked, false);
  await collectionRepository.patch(target, { name: "My title" });
  const liked = await collectionRepository.setMembership(target, "favorites", true, template);
  assert.equal(liked.name, "My title");
  assert.equal(liked.inVirds, true);
  await completionRepository.set("dhikr", template.id, "2026-09-22", true);
  const unliked = await collectionRepository.setMembership(target, "favorites", false);
  assert.equal(unliked.inVirds, true);
  assert.equal((await completionRepository.loadKeys("2026-09-22")).has("dhikr:new-template"), true);
});

test("cross-store order changes preserve content and the other collection order", async () => {
  await collectionRepository.saveOrder([prayerRef, ref], "virds");
  const entries = await collectionRepository.load();
  const dhikr = entries.find((entry) => entry.id === "dhikr:same-id")!.item;
  assert.equal(dhikr.virdSortOrder, 1);
  assert.equal(dhikr.sortOrder, 17);
  assert.equal(dhikr.name, legacy.name);
  const snapshot = await readBackupPayload();
  await assert.rejects(collectionRepository.saveOrder([ref, { moduleId: "poetry", itemId: "missing" }], "favorites"));
  assert.deepEqual(await readBackupPayload(), snapshot);
});

test("operation exceptions abort already queued writes", async () => {
  const snapshot = await readBackupPayload();
  await assert.rejects(runTransaction("dhikrs", "readwrite", (transaction) => {
    transaction.objectStore("dhikrs").put({ ...legacy, name: "Must not persist" });
    throw new Error("Injected write failure");
  }));
  assert.deepEqual(await readBackupPayload(), snapshot);
});

test("duplicate creates fail without overwriting existing data", async () => {
  const snapshot = await readBackupPayload();
  await assert.rejects(collectionRepository.create({ ...legacy, name: "Duplicate" }));
  assert.deepEqual(await readBackupPayload(), snapshot);
});

test("collection order is deterministic and completion dates use local calendar", () => {
  const a = collectionEntry("dhikr", { ...legacy, inVirds: true }, "virds");
  const b = collectionEntry("prayers", { ...legacy, inVirds: true }, "virds");
  assert.deepEqual(selectCollection([b, a], "virds").map((entry) => entry.id), ["dhikr:same-id", "prayers:same-id"]);
  assert.equal(getLocalDateKey(new Date(2026, 8, 22, 0, 1)), "2026-09-22");
});

test("record filters combine selected types with selected contexts without mutating input", () => {
  const item = { ...legacy, bagCategories: ["poetry" as const], contexts: ["morning" as const] };
  assert.equal(matchesRecordFilters(item, "dhikr", { categories: [], contexts: [] }), true);
  assert.equal(matchesRecordFilters(item, "dhikr", { categories: ["prayers", "poetry"], contexts: ["morning", "relief"] }), true);
  assert.equal(matchesRecordFilters(item, "dhikr", { categories: ["poetry"], contexts: ["relief"] }), false);
  assert.equal(matchesRecordFilters(item, "dhikr", { categories: ["dhikr"], contexts: [] }), false);
  const selected = Object.freeze(["poetry"]);
  assert.deepEqual(toggleSelection(selected, "poetry"), []);
  assert.deepEqual(toggleSelection(selected, "prayers"), ["poetry", "prayers"]);
  assert.deepEqual(selected, ["poetry"]);
});

test("legacy surah category is identical in cards and both editor entry points", () => {
  const item = { ...legacy, name: "Nâs Sûresi", source: null };
  assert.equal(getDefaultRecordCategory(item, "memorization"), "surahs");
  assert.equal(getRecordIcon(item, "memorization"), "surah");
  assert.equal(getDefaultRecordCategory({ ...item, bagCategories: ["poetry"] }, "memorization"), "poetry");
  assert.equal(getDefaultRecordCategory({ ...item, name: "My text" }, "memorization"), "memorization");
});
