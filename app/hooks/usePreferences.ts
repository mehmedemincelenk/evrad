"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import { preferences, readPreference, writePreference } from "../core/preferences";
import { applyStoredArabicFont } from "../data/arabic-font-loader";
import { useIsHydrated } from "./useIsHydrated";

function usePreference<T>({ key, fallback, parse }: { key: string; fallback: T; parse: (value: string | null) => T }, onError: () => void) {
  const hydrated = useIsHydrated();
  const [custom, setCustom] = useState<T>();
  const current = useRef<T>(fallback);
  const stored = useMemo(() => hydrated ? parse(readPreference(key)) : fallback, [hydrated, key, parse, fallback]);
  const value = custom ?? stored;
  useEffect(() => { current.current = value; }, [value]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === key || event.key === null) setCustom(parse(readPreference(key)));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key, parse]);
  const set = useCallback((action: SetStateAction<T>) => {
    const next = typeof action === "function" ? (action as (previous: T) => T)(current.current) : action;
    const validated = parse(String(next));
    if (!writePreference(key, String(validated))) return onError();
    current.current = validated;
    setCustom(validated);
  }, [key, onError, parse]);
  return [value, set] as const;
}

export function usePreferences(onError: () => void) {
  const [showDiacritics, setShowDiacritics] = usePreference(preferences.showDiacritics, onError);
  const [showTranslations, setShowTranslations] = usePreference(preferences.showTranslations, onError);
  const [hapticEnabled, setHapticEnabled] = usePreference(preferences.hapticEnabled, onError);
  const [dayResetTime, setDayResetTime] = usePreference(preferences.dayResetTime, onError);
  const [fontSizeScale, setFontSizeScale] = usePreference(preferences.fontSizeScale, onError);
  const [lineHeight, setLineHeight] = usePreference(preferences.lineHeight, onError);

  useEffect(() => { applyStoredArabicFont(); }, []);
  useEffect(() => {
    document.documentElement.style.setProperty("--text-scale", String(fontSizeScale / 100));
    document.documentElement.style.setProperty("--arabic-line-height", String(lineHeight));
  }, [fontSizeScale, lineHeight]);

  return useMemo(() => ({ showDiacritics, setShowDiacritics, showTranslations, setShowTranslations,
    hapticEnabled, setHapticEnabled, dayResetTime, setDayResetTime, fontSizeScale, setFontSizeScale, lineHeight, setLineHeight }),
  [showDiacritics, setShowDiacritics, showTranslations, setShowTranslations, hapticEnabled, setHapticEnabled,
    dayResetTime, setDayResetTime, fontSizeScale, setFontSizeScale, lineHeight, setLineHeight]);
}
