"use client";

import { useCallback, useEffect, useState } from "react";
import { useIsHydrated } from "./useIsHydrated";
import {
  ARABIC_FONT_STORAGE_KEY,
  DEFAULT_ARABIC_FONT_ID,
  getArabicFont,
  getArabicPreviewFontsUrl,
} from "../core/arabic-fonts";
import { readPreference, writePreference } from "../core/preferences";
import { isFontAvailable, loadGoogleFont, applyArabicFontToDocument } from "../data/arabic-font-loader";
import { t } from "../core/i18n";

export function useArabicFont(showToast?: (message: string) => void) {
  const isHydrated = useIsHydrated();
  const [selectedFontId, setSelectedFontId] = useState<string | null>(null);
  const [loadingFontId, setLoadingFontId] = useState<string | null>(null);

  const activeFontId = isHydrated
    ? (selectedFontId ?? (readPreference(ARABIC_FONT_STORAGE_KEY) ?? DEFAULT_ARABIC_FONT_ID))
    : DEFAULT_ARABIC_FONT_ID;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (event: StorageEvent) => {
      if (event.key === ARABIC_FONT_STORAGE_KEY && event.newValue) {
        setSelectedFontId(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const selectFont = useCallback(
    async (fontId: string) => {
      if (fontId === activeFontId || loadingFontId) return;
      const targetFont = getArabicFont(fontId);

      const available = isFontAvailable(targetFont);
      if (!available && !navigator.onLine) {
        showToast?.(t("settings.fontOfflineError"));
        return;
      }
      setLoadingFontId(targetFont.id);
      try {
        if (!available) await loadGoogleFont(targetFont);
        if (!writePreference(ARABIC_FONT_STORAGE_KEY, targetFont.id)) {
          showToast?.(t("toast.storageError"));
          return;
        }
        applyArabicFontToDocument(targetFont);
        setSelectedFontId(targetFont.id);
      } catch {
        showToast?.(t("settings.fontLoadError"));
      } finally {
        setLoadingFontId(null);
      }
    },
    [activeFontId, loadingFontId, showToast],
  );

  return {
    activeFontId,
    loadingFontId,
    selectFont,
    activeFont: getArabicFont(activeFontId),
  };
}

export function useArabicFontPreviews(enabled = true): boolean {
  // Server and first client render must agree, even when the stylesheet is cached.
  const [previewsReady, setPreviewsReady] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const linkId = "gfonts-arabic-previews";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    const ready = () => {
      Promise.resolve(document.fonts?.ready).then(() => { if (active) setPreviewsReady(true); });
    };
    const failed = () => { link?.remove(); if (active) setPreviewsReady(false); };
    const existing = Boolean(link);
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = getArabicPreviewFontsUrl();
    }
    link.addEventListener("load", ready);
    link.addEventListener("error", failed);
    if (!existing) document.head.appendChild(link);
    else if (link.sheet) ready();
    return () => {
      active = false;
      link.removeEventListener("load", ready);
      link.removeEventListener("error", failed);
    };
  }, [enabled]);
  return previewsReady;
}
