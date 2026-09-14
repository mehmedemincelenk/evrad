const CACHE_NAME = "zikirlerim-shell-v7";
const CORE_URLS = [
  "/",
  "/zikirler",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/fonts/NotoNaskhArabic-Regular.ttf",
  "/fonts/NotoNaskhArabic-Bold.ttf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_URLS))
      .then(() => (self.registration.active ? undefined : self.skipWaiting())),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (event.data?.type === "CACHE_URLS" && Array.isArray(event.data.urls)) {
    const urls = [...new Set(event.data.urls)].filter((url) => {
      try {
        return new URL(url, self.location.origin).origin === self.location.origin;
      } catch {
        return false;
      }
    });
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.allSettled(urls.map((url) => cache.add(url)))));
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    const networkResponse = fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          return caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).then(() => response);
        }
        return response;
      })
      .catch(() => null);
    event.waitUntil(networkResponse.then(() => undefined));
    event.respondWith(
      caches.match(request).then(async (cached) => cached ?? (await networkResponse) ?? (await caches.match("/zikirler")) ?? Response.error()),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached ?? fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    })),
  );
});
