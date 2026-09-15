import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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
  assert.match(html, /GÜNÜN VİRDİ/);
  assert.match(html, /Zikirlerim yükleniyor/);
  assert.match(html, /Bölüm menüsünü aç/);
  assert.match(html, /name="apple-mobile-web-app-capable" content="yes"/);
  assert.match(html, /name="mobile-web-app-capable" content="yes"/);
  assert.equal((html.match(/name="mobile-web-app-capable"/g) ?? []).length, 1);
  assert.match(html, /name="apple-mobile-web-app-status-bar-style" content="black"/);
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

test("root route renders the library and discovery home", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Kütüphane/);
  assert.match(html, /Keşfet/);
  assert.match(html, /Dualar/);
  assert.match(html, /Oyunlar/);
  assert.match(html, /href="\/zikirler"/);
});

test("prayer, memorization, book, game, and discovery routes are active", async () => {
  for (const pathname of ["/dualar", "/ezberler", "/kitaplar", "/oyunlar", "/kesfet/zikirler", "/kesfet/dualar", "/kesfet/ezberler", "/kesfet/kitaplar", "/kesfet/oyunlar"]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
  }
});

test("PWA manifest and architecture declarations stay aligned", async () => {
  const [manifestText, registryText, typesText] = await Promise.all([
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../app/core/module-registry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/core/types.ts", import.meta.url), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.name, "Zikirlerim");
  assert.equal(manifest.id, "/");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.display, "standalone");
  assert.equal((registryText.match(/createTrackableModule\(/g) ?? []).length, 5);
  assert.match(registryText, /id: "games"[\s\S]*create: null/);
  assert.doesNotMatch(registryText, /enabled:|supportsCreate|createRoute/);
  assert.match(typesText, /"prayers"[\s\S]*"books"[\s\S]*"memorization"[\s\S]*"dhikr"[\s\S]*"games"/);
});

test("target units and long-press sorting remain modular", async () => {
  const [typesText, toggleText, hookText, cssText] = await Promise.all([
    readFile(new URL("../app/core/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TargetUnitToggle.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useLongPressSort.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/tracker.css", import.meta.url), "utf8"),
  ]);
  assert.match(typesText, /"count"\s*\|\s*"custom"/);
  assert.match(toggleText, /aria-pressed/);
  assert.match(hookText, /HOLD_DELAY_MS\s*=\s*240/);
  assert.match(hookText, /window\.addEventListener\("pointermove"/);
  assert.match(hookText, /document\.elementsFromPoint/);
  assert.match(hookText, /requestAnimationFrame\(autoScroll\)/);
  assert.match(cssText, /text-overflow:\s*ellipsis/);
  const navigationCss = await readFile(new URL("../app/styles/navigation.css", import.meta.url), "utf8");
  assert.doesNotMatch(navigationCss.match(/\.menu-scrim\s*\{[^}]+\}/)?.[0] ?? "", /backdrop-filter/);
});

test("the compact menu and completion symbols keep interaction work lightweight", async () => {
  const [menuText, moduleTabsText, moduleGlyphText, menuHookText, shellText, primitiveText, symbolText, navigationCss] = await Promise.all([
    readFile(new URL("../app/components/TransientBottomBar.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ModuleTabs.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ModuleGlyph.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useTransientMenu.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/AppShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TrackerPrimitives.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/PlusMinusIcon.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/navigation.css", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(menuText, /activityKey/);
  assert.doesNotMatch(menuText, /modules\.map/);
  assert.match(moduleTabsText, /\["dhikr", "prayers", "memorization", "books"\]/);
  assert.match(moduleTabsText, /aria-current/);
  assert.match(moduleTabsText, /aria-label=\{label\}/);
  assert.match(moduleTabsText, /<ModuleGlyph icon=\{definition\.icon\}/);
  assert.match(moduleGlyphText, /Record<IconName, string>/);
  assert.match(menuHookText, /timeoutRef/);
  assert.doesNotMatch(menuHookText, /setActivityKey/);
  assert.match(shellText, /navigateTo\(getModuleRoute/);
  assert.match(primitiveText, /<PlusMinusIcon minus=\{added\}/);
  assert.match(primitiveText, /<span className="completion-core" aria-hidden="true" \/>/);
  assert.match(symbolText, /is-minus/);
  assert.match(navigationCss, /\.top-module-tabs\s*\{[\s\S]*grid-template-columns:\s*repeat\(4/);
  assert.match(navigationCss, /\.transient-bottom-bar\s*\{[\s\S]*display:\s*flex/);
});

test("notifications stay viewport-pinned and routine success actions stay quiet", async () => {
  const [notificationsText, overlaysCss, discoveryText, libraryText] = await Promise.all([
    readFile(new URL("../app/components/AppNotifications.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/styles/overlays.css", import.meta.url), "utf8"),
    readFile(new URL("../app/features/discovery/DiscoveryModuleApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useLibraryModule.ts", import.meta.url), "utf8"),
  ]);
  assert.match(notificationsText, /className="notification-rail"/);
  assert.match(notificationsText, /role="region"/);
  assert.match(overlaysCss, /\.notification-rail\s*\{[\s\S]*position:\s*fixed;[\s\S]*top:/);
  assert.doesNotMatch(discoveryText, /toast\.addedToLibrary|toast\.alreadyInLibrary/);
  assert.doesNotMatch(libraryText, /toast\.savedGeneric|toast\.deletedGeneric/);
});

test("new modules can reuse navigation, storage, layout, and collection behavior", async () => {
  const [registryText, shellText, homeText, moduleTabsText, repositoryText, completionText, collectionText, layoutText, primitivesText, pwaText] = await Promise.all([
    readFile(new URL("../app/core/module-registry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/AppShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/features/home/HomeScreen.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/ModuleTabs.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/trackable-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/completion-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useTrackableCollection.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TrackableModuleLayout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TrackerPrimitives.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/usePwaUpdate.ts", import.meta.url), "utf8"),
  ]);
  assert.match(registryText, /discoverRoute/);
  assert.match(moduleTabsText, /getModuleRoute\(id, activeSpace\)/);
  assert.match(shellText, /navigateTo\(getModuleRoute\(activeModule, space\)\)/);
  assert.match(homeText, /getModuleRoute\(module\.id, space\)/);
  assert.doesNotMatch(homeText, /next\/link/);
  assert.match(repositoryText, /createTrackableRepository/);
  assert.match(completionText, /loadIds\(itemType: TrackableModuleId/);
  assert.match(collectionText, /completionRepository\.loadIds\(repository\.moduleId/);
  assert.match(layoutText, /className="module-screen"/);
  assert.match(layoutText, /className="trackable-list"/);
  assert.doesNotMatch(primitivesText, /dhikr-card/);
  assert.match(pwaText, /modules\.flatMap/);
});

test("discovery cards add individual catalog items to the matching library", async () => {
  const [screenText, hookText, primitivesText, dhikrCatalogText, prayerCatalogText] = await Promise.all([
    readFile(new URL("../app/features/discovery/DiscoveryModuleApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/useDiscoveryLibrary.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/TrackerPrimitives.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/features/discovery/catalogs/dhikr.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/features/discovery/catalogs/prayers.ts", import.meta.url), "utf8"),
  ]);
  assert.match(screenText, /useDiscoveryLibrary/);
  assert.match(hookText, /repository\.save\(item\)/);
  assert.match(primitivesText, /AddToLibraryButton/);
  assert.match(dhikrCatalogText, /recommended-esmaul-husna[\s\S]*listDisplay: "name"/);
  assert.match(prayerCatalogText, /discover-prayer-rabbana-atina/);
  assert.doesNotMatch(screenText, /tavsiye edilen tüm zikirler/i);
});

test("IndexedDB access is centralized and destructive updates stay atomic", async () => {
  const [trackableText, completionText, indexedDbText] = await Promise.all([
    readFile(new URL("../app/data/trackable-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/completion-repository.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data/indexed-db.ts", import.meta.url), "utf8"),
  ]);
  assert.match(trackableText, /runTransaction\(\[storeName, COMPLETION_STORE\]/);
  assert.match(trackableText, /repository|createTrackableRepository/);
  assert.match(completionText, /runTransaction\(COMPLETION_STORE/);
  assert.match(indexedDbText, /const done = transactionDone\(transaction\)[\s\S]*Promise\.all/);
  assert.match(indexedDbText, /request\.onblocked/);
  assert.match(indexedDbText, /database\.onversionchange/);
});

test("the v5 migration clears legacy dhikr records exactly once", async () => {
  const indexedDbText = await readFile(new URL("../app/data/indexed-db.ts", import.meta.url), "utf8");
  assert.match(indexedDbText, /DB_VERSION = 5/);
  assert.match(indexedDbText, /event\.oldVersion > 0 && event\.oldVersion < 5/);
  assert.match(indexedDbText, /objectStore\(ENTITY_STORES\.dhikr\)\.clear\(\)/);
  assert.match(indexedDbText, /cursor\.value\.itemType === "dhikr"/);
});

test("PWA updates replace stale application shells instead of preserving a stuck client", async () => {
  const [serviceWorkerText, updateHookText] = await Promise.all([
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../app/hooks/usePwaUpdate.ts", import.meta.url), "utf8"),
  ]);
  assert.match(serviceWorkerText, /zikirlerim-shell-v9/);
  assert.match(serviceWorkerText, /caches\.match\(request\)[\s\S]*cached \?\? \(await networkResponse\)/);
  assert.match(serviceWorkerText, /self\.registration\.active \? undefined : self\.skipWaiting\(\)/);
  assert.match(serviceWorkerText, /type === "SKIP_WAITING"/);
  assert.match(updateHookText, /updateViaCache: "none"/);
  assert.match(updateHookText, /visibilitychange/);
  assert.doesNotMatch(updateHookText, /icon-192|icon-512|NotoNaskhArabic/);
});

test("source modules stay bounded and unused database scaffolding stays out", async () => {
  const paths = (await readdir(new URL("../app/", import.meta.url), { recursive: true }))
    .filter((path) => /\.(css|ts|tsx)$/.test(path));
  const sources = await Promise.all(paths.map(async (path) => ({
    path,
    lines: (await readFile(new URL(`../app/${path}`, import.meta.url), "utf8")).split("\n").length,
  })));
  const oversized = sources.filter((source) => source.lines > 300);
  assert.deepEqual(oversized, []);

  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.dependencies?.["drizzle-orm"], undefined);
  assert.equal(packageJson.devDependencies?.["drizzle-kit"], undefined);
});
