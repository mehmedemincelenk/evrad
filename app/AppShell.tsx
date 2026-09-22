"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { t } from "./core/i18n";
import type { AppSection } from "./core/module-registry";
import { BottomNavigation } from "./components/BottomNavigation";
import { AppNotifications } from "./components/AppNotifications";
import { AppRuntimeContext } from "./core/AppRuntimeContext";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import { useBackupExport } from "./features/backup/useBackupExport";
import { usePersistentStorage } from "./hooks/usePersistentStorage";
import { AppFooter } from "./components/AppFooter";
import { useSwipeNavigation } from "./hooks/useSwipeNavigation";
import { applyStoredArabicFont } from "./hooks/useArabicFont";

import { ARABIC_DIACRITICS_STORAGE_KEY } from "./core/arabic-fonts";
import { DAY_RESET_TIME_STORAGE_KEY } from "./core/date";


export function AppShell({ children, section }: { children: ReactNode; section: AppSection | "settings" }) {
  const { updateReady, activateUpdate } = usePwaUpdate();
  const [toast, setToast] = useState<string | null>(null);

  const [showDiacritics, setShowDiacriticsState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(ARABIC_DIACRITICS_STORAGE_KEY) !== "false";
  });

  const [showTranslations, setShowTranslationsState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("evrad_show_translations") !== "false";
  });

  const [hapticEnabled, setHapticEnabledState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("evrad_haptic_feedback") !== "false";
  });

  const [dayResetTime, setDayResetTimeState] = useState<string>(() => {
    if (typeof window === "undefined") return "00:00";
    return localStorage.getItem(DAY_RESET_TIME_STORAGE_KEY) ?? "00:00";
  });

  const [fontSizeScale, setFontSizeScaleState] = useState<number>(() => {
    if (typeof window === "undefined") return 100;
    const stored = Number(localStorage.getItem("evrad_font_size_scale"));
    return Number.isFinite(stored) && stored >= 75 && stored <= 140 ? stored : 100;
  });

  const [lineHeight, setLineHeightState] = useState<number>(() => {
    if (typeof window === "undefined") return 1.75;
    const stored = Number(localStorage.getItem("evrad_line_height_scale"));
    return Number.isFinite(stored) && stored >= 1.2 && stored <= 2.5 ? stored : 1.75;
  });

  const showToast = useCallback((message: string) => setToast(message), []);

  const setShowDiacritics = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setShowDiacriticsState((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      try {
        localStorage.setItem(ARABIC_DIACRITICS_STORAGE_KEY, String(next));
      } catch {
        // localStorage kısıtı
      }
      return next;
    });
  }, []);

  const setShowTranslations = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setShowTranslationsState((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      try {
        localStorage.setItem("evrad_show_translations", String(next));
      } catch {
        // localStorage kısıtı
      }
      return next;
    });
  }, []);

  const setHapticEnabled = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setHapticEnabledState((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      try {
        localStorage.setItem("evrad_haptic_feedback", String(next));
      } catch {
        // localStorage kısıtı
      }
      return next;
    });
  }, []);

  const setDayResetTime = useCallback((time: string) => {
    setDayResetTimeState(time);
    try {
      localStorage.setItem(DAY_RESET_TIME_STORAGE_KEY, time);
    } catch {
      // localStorage kısıtı
    }
  }, []);

  const setFontSizeScale = useCallback((scale: number) => {
    setFontSizeScaleState(scale);
    try {
      localStorage.setItem("evrad_font_size_scale", String(scale));
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--text-scale", String(scale / 100));
      }
    } catch {
      // localStorage kısıtı
    }
  }, []);

  const setLineHeight = useCallback((height: number) => {
    setLineHeightState(height);
    try {
      localStorage.setItem("evrad_line_height_scale", String(height));
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--arabic-line-height", String(height));
      }
    } catch {
      // localStorage kısıtı
    }
  }, []);

  useEffect(() => {
    applyStoredArabicFont();
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--text-scale", String(fontSizeScale / 100));
      document.documentElement.style.setProperty("--arabic-line-height", String(lineHeight));
    }
  }, [fontSizeScale, lineHeight]);

  const runtimeValue = useMemo(
    () => ({
      showToast,
      showDiacritics,
      setShowDiacritics,
      showTranslations,
      setShowTranslations,
      hapticEnabled,
      setHapticEnabled,
      dayResetTime,
      setDayResetTime,
      fontSizeScale,
      setFontSizeScale,
      lineHeight,
      setLineHeight,
    }),
    [
      showToast,
      showDiacritics,
      setShowDiacritics,
      showTranslations,
      setShowTranslations,
      hapticEnabled,
      setHapticEnabled,
      dayResetTime,
      setDayResetTime,
      fontSizeScale,
      setFontSizeScale,
      lineHeight,
      setLineHeight,
    ],
  );

  const backup = useBackupExport(() => showToast(t("backup.error")));
  usePersistentStorage();
  useSwipeNavigation(section);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <AppRuntimeContext.Provider value={runtimeValue}>
      <main className="app-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        {children}
        <AppFooter label={t("backup.save")} saving={backup.saving} onBackup={() => void backup.exportBackup()} />
        <BottomNavigation section={section} />
        <AppNotifications message={toast} updateReady={updateReady} onActivateUpdate={activateUpdate} />
      </main>
    </AppRuntimeContext.Provider>
  );
}
