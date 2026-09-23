"use client";

import { useCallback, useEffect, useState } from "react";
import { useIsHydrated } from "./useIsHydrated";
import {
  ARABIC_FONT_STORAGE_KEY,
  DEFAULT_ARABIC_FONT_ID,
  getArabicFont,
  buildArabicFontFamilyCss,
  getGoogleFontsUrl,
  getArabicPreviewFontsUrl,
  type ArabicFontDefinition,
} from "../core/arabic-fonts";
import { t } from "../core/i18n";

export function isFontAvailable(font: ArabicFontDefinition): boolean {
  if (font.id === DEFAULT_ARABIC_FONT_ID) return true;
  if (typeof document === "undefined") return false;
  const linkId = `gfont-${font.id}`;
  if (document.getElementById(linkId)) return true;
  try {
    if (document.fonts?.check(`16px "${font.fontFamily}"`)) {
      return true;
    }
  } catch {
    // document.fonts api check fallback
  }
  return false;
}

export async function loadGoogleFont(font: ArabicFontDefinition, timeoutMs = 9000): Promise<void> {
  if (typeof document === "undefined" || !font.googleFontFamily) return;

  const linkId = `gfont-${font.id}`;
  let link = document.getElementById(linkId) as HTMLLinkElement | null;

  if (link) {
    if (document.fonts) {
      await document.fonts.load(`16px "${font.fontFamily}"`);
    }
    return;
  }

  link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = getGoogleFontsUrl(font.googleFontFamily);

  return new Promise<void>((resolve, reject) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        link?.remove();
        reject(new Error("Font load timeout"));
      }
    }, timeoutMs);

    link.onload = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      if (document.fonts) {
        document.fonts.load(`16px "${font.fontFamily}"`).then(() => resolve()).catch(() => resolve());
      } else {
        resolve();
      }
    };

    link.onerror = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      link?.remove();
      reject(new Error("Font load failed"));
    };

    document.head.appendChild(link);
  });
}

export function applyArabicFontToDocument(font: ArabicFontDefinition): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--font-arabic", buildArabicFontFamilyCss(font.fontFamily));
}

export function applyStoredArabicFont(): void {
  if (typeof window === "undefined") return;
  const storedId = localStorage.getItem(ARABIC_FONT_STORAGE_KEY);
  if (!storedId || storedId === DEFAULT_ARABIC_FONT_ID) return;
  const font = getArabicFont(storedId);
  if (!font.googleFontFamily) return;

  loadGoogleFont(font).then(() => {
    applyArabicFontToDocument(font);
  }).catch(() => {
    // Sessizce varsayılan font korunur
  });
}

export function useArabicFont(showToast?: (message: string) => void) {
  const isHydrated = useIsHydrated();
  const [selectedFontId, setSelectedFontId] = useState<string | null>(null);
  const [loadingFontId, setLoadingFontId] = useState<string | null>(null);

  const activeFontId = isHydrated
    ? (selectedFontId ?? (typeof window !== "undefined" ? localStorage.getItem(ARABIC_FONT_STORAGE_KEY) ?? DEFAULT_ARABIC_FONT_ID : DEFAULT_ARABIC_FONT_ID))
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

      if (targetFont.id === DEFAULT_ARABIC_FONT_ID) {
        applyArabicFontToDocument(targetFont);
        try {
          localStorage.setItem(ARABIC_FONT_STORAGE_KEY, targetFont.id);
        } catch {
          // localStorage kısıtı
        }
        setSelectedFontId(targetFont.id);
        return;
      }

      const available = isFontAvailable(targetFont);

      if (!available && typeof navigator !== "undefined" && !navigator.onLine) {
        showToast?.(t("settings.fontOfflineError"));
        return;
      }

      if (available) {
        applyArabicFontToDocument(targetFont);
        try {
          localStorage.setItem(ARABIC_FONT_STORAGE_KEY, targetFont.id);
        } catch {
          // localStorage kısıtı
        }
        setSelectedFontId(targetFont.id);
        return;
      }

      setLoadingFontId(targetFont.id);
      try {
        await loadGoogleFont(targetFont);
        applyArabicFontToDocument(targetFont);
        try {
          localStorage.setItem(ARABIC_FONT_STORAGE_KEY, targetFont.id);
        } catch {
          // localStorage kısıtı
        }
        setSelectedFontId(targetFont.id);
      } catch {
        showToast?.(t("settings.fontLoadError"));
        const current = getArabicFont(activeFontId);
        applyArabicFontToDocument(current);
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

export function useArabicFontPreviews(): boolean {
  const [previewsReady, setPreviewsReady] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return Boolean(document.getElementById("gfonts-arabic-previews"));
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const linkId = "gfonts-arabic-previews";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = getArabicPreviewFontsUrl();
      link.onload = () => {
        if (document.fonts) {
          document.fonts.ready.then(() => setPreviewsReady(true)).catch(() => setPreviewsReady(true));
        } else {
          setPreviewsReady(true);
        }
      };
      link.onerror = () => {
        setPreviewsReady(false);
      };
      document.head.appendChild(link);
    } else if (document.fonts) {
      document.fonts.ready.then(() => setPreviewsReady(true)).catch(() => setPreviewsReady(true));
    }
  }, []);

  return previewsReady;
}

