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
  assert.match(html, /سُبْحَانَ اللّٰهِ/);
  assert.match(html, /Bölüm menüsünü aç/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
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
  assert.match(cssText, /text-overflow:\s*ellipsis/);
  assert.doesNotMatch(cssText.match(/\.menu-scrim\s*\{[^}]+\}/)?.[0] ?? "", /backdrop-filter/);
});
