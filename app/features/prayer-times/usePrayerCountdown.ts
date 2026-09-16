"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getNextPrayer, type StoredCoordinates } from "./prayer-time-utils";

const STORAGE_KEY = "zikirlerim.prayer-location.v1";

export function usePrayerCountdown() {
  const [position, setPosition] = useState<StoredCoordinates | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [requesting, setRequesting] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) queueMicrotask(() => setPosition(JSON.parse(stored) as StoredCoordinates));
    } catch {
      // Konum saklanamasa da mevcut oturumda sayaç çalışabilir.
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return setDenied(true);
    setRequesting(true);
    setDenied(false);
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const next = { latitude: coords.latitude, longitude: coords.longitude };
      setPosition(next);
      setRequesting(false);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* cihaz saklamayı reddedebilir */ }
    }, () => {
      setRequesting(false);
      setDenied(true);
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 86_400_000 });
  }, []);

  const prayer = useMemo(() => position ? getNextPrayer(position, now) : null, [position, now]);
  return { prayer, now, hasPosition: Boolean(position), requesting, denied, requestLocation };
}
