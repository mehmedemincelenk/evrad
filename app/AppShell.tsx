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
import { QuickAddModal } from "./components/QuickAddModal";
import { useScrollDirection } from "./hooks/useScrollDirection";
import { useIsHydrated } from "./hooks/useIsHydrated";

import { ARABIC_DIACRITICS_STORAGE_KEY } from "./core/arabic-fonts";
import { DAY_RESET_TIME_STORAGE_KEY } from "./core/date";


import type { DevotionalItem } from "./core/types";

export function AppShell({
  children,
  section,
  onSelectSection,
  onOpenDetailed,
}: {
  children: ReactNode;
  section: AppSection | "settings" | "create";
  onSelectSection?: (section: AppSection | "settings" | "create") => void;
  onOpenDetailed?: (item: DevotionalItem | null) => void;
}) {
  const { updateReady, activateUpdate } = usePwaUpdate();
  const [toast, setToast] = useState<string | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const isScrolledDown = useScrollDirection();
  const isHydrated = useIsHydrated();

  const [customDiacritics, setCustomDiacritics] = useState<boolean | null>(null);
  const [customTranslations, setCustomTranslations] = useState<boolean | null>(null);
  const [customHaptic, setCustomHaptic] = useState<boolean | null>(null);
  const [customDayResetTime, setCustomDayResetTime] = useState<string | null>(null);
  const [customFontSizeScale, setCustomFontSizeScale] = useState<number | null>(null);
  const [customLineHeight, setCustomLineHeight] = useState<number | null>(null);

  const showDiacritics = isHydrated
    ? (customDiacritics ?? (typeof window !== "undefined" && localStorage.getItem(ARABIC_DIACRITICS_STORAGE_KEY) === "false" ? false : true))
    : true;

  const showTranslations = isHydrated
    ? (customTranslations ?? (typeof window !== "undefined" && localStorage.getItem("evrad_show_translations") === "false" ? false : true))
    : true;

  const hapticEnabled = isHydrated
    ? (customHaptic ?? (typeof window !== "undefined" && localStorage.getItem("evrad_haptic_feedback") === "false" ? false : true))
    : true;

  const dayResetTime = isHydrated
    ? (customDayResetTime ?? (typeof window !== "undefined" ? localStorage.getItem(DAY_RESET_TIME_STORAGE_KEY) ?? "00:00" : "00:00"))
    : "00:00";

  const fontSizeScale = isHydrated
    ? (customFontSizeScale ?? (() => {
        if (typeof window === "undefined") return 100;
        const stored = Number(localStorage.getItem("evrad_font_size_scale"));
        return Number.isFinite(stored) && stored >= 75 && stored <= 140 ? stored : 100;
      })())
    : 100;

  const lineHeight = isHydrated
    ? (customLineHeight ?? (() => {
        if (typeof window === "undefined") return 1.75;
        const stored = Number(localStorage.getItem("evrad_line_height_scale"));
        return Number.isFinite(stored) && stored >= 1.2 && stored <= 2.5 ? stored : 1.75;
      })())
    : 1.75;

  const showToast = useCallback((message: string) => setToast(message), []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--text-scale", String(fontSizeScale / 100));
    document.documentElement.style.setProperty("--arabic-line-height", String(lineHeight));
  }, [fontSizeScale, lineHeight]);

  const setShowDiacritics = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setCustomDiacritics((prevCustom) => {
      const current = prevCustom ?? (typeof window !== "undefined" && localStorage.getItem(ARABIC_DIACRITICS_STORAGE_KEY) === "false" ? false : true);
      const next = typeof val === "function" ? val(current) : val;
      try {
        localStorage.setItem(ARABIC_DIACRITICS_STORAGE_KEY, String(next));
      } catch {
        // localStorage kısıtı
      }
      return next;
    });
  }, []);

  const setShowTranslations = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setCustomTranslations((prevCustom) => {
      const current = prevCustom ?? (typeof window !== "undefined" && localStorage.getItem("evrad_show_translations") === "false" ? false : true);
      const next = typeof val === "function" ? val(current) : val;
      try {
        localStorage.setItem("evrad_show_translations", String(next));
      } catch {
        // localStorage kısıtı
      }
      return next;
    });
  }, []);

  const setHapticEnabled = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setCustomHaptic((prevCustom) => {
      const current = prevCustom ?? (typeof window !== "undefined" && localStorage.getItem("evrad_haptic_feedback") === "false" ? false : true);
      const next = typeof val === "function" ? val(current) : val;
      try {
        localStorage.setItem("evrad_haptic_feedback", String(next));
      } catch {
        // localStorage kısıtı
      }
      return next;
    });
  }, []);

  const setDayResetTime = useCallback((time: string) => {
    setCustomDayResetTime(time);
    try {
      localStorage.setItem(DAY_RESET_TIME_STORAGE_KEY, time);
    } catch {
      // localStorage kısıtı
    }
  }, []);

  const setFontSizeScale = useCallback((scale: number) => {
    setCustomFontSizeScale(scale);
    try {
      localStorage.setItem("evrad_font_size_scale", String(scale));
    } catch {
      // localStorage kısıtı
    }
  }, []);

  const setLineHeight = useCallback((height: number) => {
    setCustomLineHeight(height);
    try {
      localStorage.setItem("evrad_line_height_scale", String(height));
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
  useSwipeNavigation(section, !onSelectSection);

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
        <AppFooter
          label={t("backup.save")}
          saving={backup.saving}
          onBackup={() => void backup.exportBackup()}
          onSelectSettings={onSelectSection ? () => onSelectSection("settings") : undefined}
        />
        <BottomNavigation
          section={section}
          onSelectSection={onSelectSection}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
          isScrolledHidden={isScrolledDown && !quickAddOpen}
        />
        <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} onOpenDetailed={onOpenDetailed} />
        <AppNotifications message={toast} updateReady={updateReady} onActivateUpdate={activateUpdate} />
      </main>
    </AppRuntimeContext.Provider>
  );
}
