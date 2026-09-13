"use client";

import { createContext, useContext } from "react";

interface AppRuntimeValue {
  showToast: (message: string) => void;
}

export const AppRuntimeContext = createContext<AppRuntimeValue | null>(null);

export function useAppRuntime(): AppRuntimeValue {
  const value = useContext(AppRuntimeContext);
  if (!value) throw new Error("useAppRuntime must be used inside AppShell");
  return value;
}
