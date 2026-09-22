"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { appSections, createRecordRoute } from "../core/module-registry";

const moduleUrls = [
  ...appSections.map((section) => section.route), createRecordRoute,
];

export function usePwaUpdate() {
  const [updateReady, setUpdateReady] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((items) => items.forEach((item) => item.unregister()));
      return;
    }
    let disposed = false;

    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then(async (registration) => {
      if (disposed) return;
      registrationRef.current = registration;
      if (registration.waiting) setUpdateReady(true);
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
        });
      });

      const ready = await navigator.serviceWorker.ready;
      const resourceUrls = performance.getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => url.startsWith(window.location.origin));
      ready.active?.postMessage({ type: "CACHE_URLS", urls: [...moduleUrls, ...resourceUrls] });
      registration.update().catch(() => undefined);
    }).catch(() => undefined);

    const onControllerChange = () => window.location.reload();
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    const checkForUpdate = () => {
      if (document.visibilityState === "visible") registrationRef.current?.update().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", checkForUpdate);
    return () => {
      disposed = true;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      document.removeEventListener("visibilitychange", checkForUpdate);
    };
  }, []);

  const activateUpdate = useCallback(() => {
    registrationRef.current?.waiting?.postMessage({ type: "SKIP_WAITING" });
  }, []);

  return { updateReady, activateUpdate };
}
