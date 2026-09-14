"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ContentSpace, ModuleId } from "./core/types";
import { t } from "./core/i18n";
import { TransientBottomBar } from "./components/TransientBottomBar";
import { ModuleTabs } from "./components/ModuleTabs";
import { AppNotifications } from "./components/AppNotifications";
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
  const menu = useTransientMenu();
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
    menu.closeMenu();
    if (space !== activeSpace) navigateTo(getModuleRoute(activeModule, space));
  };

  const handleAdd = () => {
    if (!activeDefinition.create) return;
    menu.closeMenu();
    navigateTo(activeDefinition.create.route);
  };

  return (
    <AppRuntimeContext.Provider value={runtimeValue}>
      <main className="app-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <ModuleTabs activeModule={activeModule} activeSpace={activeSpace} />
        {children}
        <button
          className={`edge-launcher${menu.open ? " is-open" : ""}`}
          type="button"
          aria-label={t(menu.open ? "menu.close" : "menu.open")}
          aria-expanded={menu.open}
          onClick={menu.open ? menu.closeMenu : menu.openMenu}
        >
          <span />
          <span />
          <span />
        </button>
        <TransientBottomBar
          open={menu.open}
          activeSpace={activeSpace}
          onClose={menu.closeMenu}
          onActivity={menu.registerActivity}
          onSpace={handleSpace}
          addLabel={activeDefinition.create ? t(activeDefinition.create.label) : null}
          onAdd={handleAdd}
        />
        <AppNotifications message={toast} updateReady={updateReady} onActivateUpdate={activateUpdate} />
      </main>
    </AppRuntimeContext.Provider>
  );
}
