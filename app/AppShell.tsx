"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ContentSpace, ModuleId } from "./core/types";
import { t } from "./core/i18n";
import { TransientBottomBar } from "./components/TransientBottomBar";
import { ModuleTabs } from "./components/ModuleTabs";
import { AppNotifications } from "./components/AppNotifications";
import { EdgeMenuLauncher } from "./components/EdgeMenuLauncher";
import { AppRuntimeContext } from "./core/AppRuntimeContext";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import { useTransientMenu } from "./hooks/useTransientMenu";
import { getModule, getModuleRoute } from "./core/module-registry";
import { navigateTo } from "./core/navigation";

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
  const topMenu = useTransientMenu();
  const { updateReady, activateUpdate } = usePwaUpdate();
  const [toast, setToast] = useState<string | null>(null);
  const showToast = useCallback((message: string) => setToast(message), []);
  const runtimeValue = useMemo(() => ({ showToast }), [showToast]);

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

  return (
    <AppRuntimeContext.Provider value={runtimeValue}>
      <main className="app-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <ModuleTabs
          open={topMenu.open}
          activeModule={activeModule}
          activeSpace={activeSpace}
          onClose={topMenu.closeMenu}
          onActivity={topMenu.registerActivity}
        />
        {children}
        {!topMenu.open ? (
          <EdgeMenuLauncher
            edge="top"
            label={t("menu.openModules")}
            onClick={() => { bottomMenu.closeMenu(); topMenu.openMenu(); }}
          />
        ) : null}
        {!bottomMenu.open ? (
          <EdgeMenuLauncher
            edge="bottom"
            label={t("menu.openSpaces")}
            onClick={() => { topMenu.closeMenu(); bottomMenu.openMenu(); }}
          />
        ) : null}
        <TransientBottomBar
          open={bottomMenu.open}
          activeSpace={activeSpace}
          onClose={bottomMenu.closeMenu}
          onActivity={bottomMenu.registerActivity}
          onSpace={handleSpace}
          addLabel={activeDefinition.create ? t(activeDefinition.create.label) : null}
          onAdd={handleAdd}
        />
        <AppNotifications message={toast} updateReady={updateReady} onActivateUpdate={activateUpdate} />
      </main>
    </AppRuntimeContext.Provider>
  );
}
