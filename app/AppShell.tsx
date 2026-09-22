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

export function AppShell({ children, section }: { children: ReactNode; section: AppSection }) {
  const { updateReady, activateUpdate } = usePwaUpdate();
  const [toast, setToast] = useState<string | null>(null);
  const showToast = useCallback((message: string) => setToast(message), []);
  const runtimeValue = useMemo(() => ({ showToast }), [showToast]);
  const backup = useBackupExport(() => showToast(t("backup.error")));
  usePersistentStorage();

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
