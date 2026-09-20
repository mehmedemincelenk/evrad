"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ContentSpace, ModuleId } from "./core/types";
import { t } from "./core/i18n";
import { TransientBottomBar } from "./components/TransientBottomBar";
import { AppNotifications } from "./components/AppNotifications";
import { AppRuntimeContext } from "./core/AppRuntimeContext";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import { getModule, getModuleRoute } from "./core/module-registry";
import { useBackupExport } from "./features/backup/useBackupExport";
import { usePersistentStorage } from "./hooks/usePersistentStorage";
import { AppFooter } from "./components/AppFooter";
import { useRouter } from "next/navigation";

export function AppShell({
  children,
  activeModule,
  activeSpace = "library",
}: {
  children: ReactNode;
  activeModule: ModuleId | null;
  activeSpace?: ContentSpace | null;
}) {
  const activeDefinition = activeModule ? getModule(activeModule) : null;
  const router = useRouter();
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

  const handleSpace = (space: ContentSpace) => {
    if (space === "discover") router.push("/kesfet/canta");
    else router.push("/virdlerim");
  };

  const handleAdd = () => {
    router.push(activeDefinition?.create?.route ?? "/canta/yeni");
  };

  const handleModule = (moduleId: ModuleId) => {
    if (moduleId === "dhikr") router.push("/virdlerim");
    else if (moduleId === "bag") router.push("/canta");
    else if (moduleId !== activeModule) router.push(getModuleRoute(moduleId, activeSpace ?? "library"));
  };

  const handleHome = () => router.push("/");

  const handleBackup = () => {
    void backup.exportBackup();
  };

  return (
    <AppRuntimeContext.Provider value={runtimeValue}>
      <main className="app-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        {children}
        <AppFooter label={t("backup.save")} saving={backup.saving} onBackup={handleBackup} />
        <TransientBottomBar
          activeSpace={activeSpace}
          activeModule={activeModule}
          onSpace={handleSpace}
          onHome={handleHome}
          onModule={handleModule}
          addLabel={activeDefinition?.create ? t(activeDefinition.create.label) : t("menu.addBag")}
          onAdd={handleAdd}
        />
        <AppNotifications message={toast} updateReady={updateReady} onActivateUpdate={activateUpdate} />
      </main>
    </AppRuntimeContext.Provider>
  );
}
