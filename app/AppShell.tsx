"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ContentSpace, ModuleId } from "./core/types";
import { t } from "./core/i18n";
import { TransientBottomBar } from "./components/TransientBottomBar";
import { AppNotifications } from "./components/AppNotifications";
import { EdgeMenuLauncher } from "./components/EdgeMenuLauncher";
import { AppRuntimeContext } from "./core/AppRuntimeContext";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import { useTransientMenu } from "./hooks/useTransientMenu";
import { getModule, getModuleRoute } from "./core/module-registry";
import { navigateTo } from "./core/navigation";
import { useBackupExport } from "./features/backup/useBackupExport";
import { usePersistentStorage } from "./hooks/usePersistentStorage";

export function AppShell({
  children,
  activeModule,
  activeSpace = "library",
}: {
  children: ReactNode;
  activeModule: ModuleId;
  activeSpace?: ContentSpace;
}) {
  const activeDefinition = getModule(activeModule);
  const bottomMenu = useTransientMenu();
  const [bottomMenuPage, setBottomMenuPage] = useState<"actions" | "modules">("actions");
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
    bottomMenu.closeMenu();
    if (space !== activeSpace) navigateTo(getModuleRoute(activeModule, space));
  };

  const handleAdd = () => {
    if (!activeDefinition.create) return;
    bottomMenu.closeMenu();
    navigateTo(activeDefinition.create.route);
  };

  const handleModule = (moduleId: ModuleId) => {
    bottomMenu.closeMenu();
    if (moduleId !== activeModule) navigateTo(getModuleRoute(moduleId, activeSpace));
  };

  const handleBackup = () => {
    bottomMenu.closeMenu();
    void backup.exportBackup();
  };

  const openBottomMenu = () => {
    setBottomMenuPage("actions");
    bottomMenu.openMenu();
  };

  return (
    <AppRuntimeContext.Provider value={runtimeValue}>
      <main className="app-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        {children}
        {!bottomMenu.open ? (
          <EdgeMenuLauncher
            label={t("menu.openSpaces")}
            onClick={openBottomMenu}
          />
        ) : null}
        <TransientBottomBar
          open={bottomMenu.open}
          activeSpace={activeSpace}
          activeModule={activeModule}
          page={bottomMenuPage}
          onPageChange={setBottomMenuPage}
          onClose={bottomMenu.closeMenu}
          onActivity={bottomMenu.registerActivity}
          onSpace={handleSpace}
          onModule={handleModule}
          addLabel={activeDefinition.create ? t(activeDefinition.create.label) : null}
          onAdd={handleAdd}
          backupLabel={t("backup.save")}
          backupSaving={backup.saving}
          onBackup={handleBackup}
        />
        <AppNotifications message={toast} updateReady={updateReady} onActivateUpdate={activateUpdate} />
      </main>
    </AppRuntimeContext.Provider>
  );
}
