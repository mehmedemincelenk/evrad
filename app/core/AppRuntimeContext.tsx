"use client";

import { createContext, useContext } from "react";

interface AppRuntimeValue {
  showToast: (message: string) => void;
  showDiacritics: boolean;
  setShowDiacritics: (value: boolean | ((prev: boolean) => boolean)) => void;
  showTranslations: boolean;
  setShowTranslations: (value: boolean | ((prev: boolean) => boolean)) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (value: boolean | ((prev: boolean) => boolean)) => void;
  dayResetTime: string;
  setDayResetTime: (time: string) => void;
  fontSizeScale: number;
  setFontSizeScale: (scale: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
}

export const AppRuntimeContext = createContext<AppRuntimeValue | null>(null);

export function useAppRuntime(): AppRuntimeValue {
  const value = useContext(AppRuntimeContext);
  if (!value) throw new Error("useAppRuntime must be used inside AppShell");
  return value;
}
