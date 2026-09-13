import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/zikirler") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Zikirlerim application", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Zikirlerim<\/title>/i);
  assert.match(html, /BUGÜNÜN RİTMİ/);
  assert.match(html, /Zikirlerin yükleniyor/);
  assert.match(html, /Bölüm menüsünü aç/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("new dhikr has its own full-page route", async () => {
  const response = await render("/zikirler/yeni");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Yeni zikir/);
  assert.match(html, /Günlük hedef/);
  assert.match(html, /Örn\. sayfa/);
});

test("root route forwards to the active module", async () => {
  const response = await render("/");
  assert.ok([302, 303, 307, 308].includes(response.status));
  assert.match(response.headers.get("location") ?? "", /\/zikirler$/);
});

test("PWA manifest and architecture declarations stay aligned", async () => {
  const [manifestText, registryText, typesText] = await Promise.all([
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../app/core/module-registry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/core/types.ts", import.meta.url), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.name, "Zikirlerim");
  assert.equal(manifest.start_url, "/zikirler");
  assert.equal(manifest.display, "standalone");
  assert.match(registryText, /id: "dhikr"[\s\S]*enabled: true/);
  assert.match(registryText, /id: "games"[\s\S]*enabled: false/);
  assert.match(typesText, /"prayers"[\s\S]*"books"[\s\S]*"memorization"[\s\S]*"dhikr"[\s\S]*"games"/);
});

test("target units and long-press sorting remain modular", async () => {
  const [typesText, toggleText, hookText, cssText] = await Promise.all([
    readFile(new URL("../app/core/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TargetUnitToggle.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useLongPressSort.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(typesText, /"count"\s*\|\s*"custom"/);
  assert.match(toggleText, /aria-pressed/);
  assert.match(hookText, /HOLD_DELAY_MS\s*=\s*240/);
  assert.match(hookText, /window\.addEventListener\("pointermove"/);
  assert.match(hookText, /document\.elementsFromPoint/);
  assert.match(hookText, /requestAnimationFrame\(autoScroll\)/);
  assert.match(cssText, /text-overflow:\s*ellipsis/);
  assert.doesNotMatch(cssText.match(/\.menu-scrim\s*\{[^}]+\}/)?.[0] ?? "", /backdrop-filter/);
});

test("new modules can reuse navigation, storage, layout, and collection behavior", async () => {
  const [registryText, shellText, homeText, repositoryText, completionText, collectionText, layoutText, primitivesText, pwaText] = await Promise.all([
    readFile(new URL("../app/core/module-registry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/AppShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/features/home/HomeScreen.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/trackable-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/completion-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useTrackableCollection.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TrackableModuleLayout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TrackerPrimitives.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/usePwaUpdate.ts", import.meta.url), "utf8"),
  ]);
  assert.match(registryText, /createRoute/);
  assert.match(shellText, /router\.push\(getModule\(id\)\.route\)/);
  assert.match(homeText, /<Link href=\{module\.route\}/);
  assert.match(repositoryText, /createTrackableRepository/);
  assert.match(completionText, /loadIds\(itemType: ModuleId/);
  assert.match(collectionText, /completionRepository\.loadIds\(repository\.moduleId/);
  assert.match(layoutText, /className="module-screen"/);
  assert.match(layoutText, /className="trackable-list"/);
  assert.doesNotMatch(primitivesText, /dhikr-card/);
  assert.match(pwaText, /enabledModules\.flatMap/);
});

test("recommended collection is deduplicated and long entries use names", async () => {
  const recommendedText = await readFile(new URL("../app/features/dhikr/recommended-dhikrs.ts", import.meta.url), "utf8");
  assert.match(recommendedText, /recommendedDhikrs/);
  assert.match(recommendedText, /recommended-esmaul-husna[\s\S]*listDisplay: "name"/);
  assert.match(recommendedText, /recommended-distress-dhikr[\s\S]*listDisplay: "name"/);
  assert.match(recommendedText, /recommended-la-ilaha-expanded[\s\S]*listDisplay: "name"/);
  assert.match(recommendedText, /recommended-after-prayer-tahlil[\s\S]*targetCount: 1/);
  assert.match(recommendedText, /لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ/);
  assert.match(recommendedText, /getMissingRecommendedDhikrs/);
  assert.match(recommendedText, /normalizeIdentity/);
});

test("IndexedDB transactions cannot finish before their completion listener is attached", async () => {
  const [trackableText, completionText, dhikrRepositoryText, indexedDbText] = await Promise.all([
    readFile(new URL("../app/data/trackable-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/completion-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/features/dhikr/dhikr-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/indexed-db.ts", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(trackableText, /await requestResult[\s\S]{0,300}await transactionDone\(transaction\)/);
  assert.doesNotMatch(completionText, /await requestResult[\s\S]{0,300}await transactionDone\(transaction\)/);
  assert.match(dhikrRepositoryText, /const done = transactionDone\(transaction\)/);
  assert.match(indexedDbText, /request\.onblocked/);
  assert.match(indexedDbText, /database\.onversionchange/);
});

test("PWA updates replace stale application shells instead of preserving a stuck client", async () => {
  const [serviceWorkerText, updateHookText] = await Promise.all([
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/usePwaUpdate.ts", import.meta.url), "utf8"),
  ]);
  assert.match(serviceWorkerText, /zikirlerim-shell-v3/);
  assert.match(serviceWorkerText, /then\(\(\) => self\.skipWaiting\(\)\)/);
  assert.match(updateHookText, /updateViaCache: "none"/);
  assert.match(updateHookText, /visibilitychange/);
});
