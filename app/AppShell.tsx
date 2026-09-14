"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ContentSpace, ModuleId } from "./core/types";
import { t } from "./core/i18n";
import { TransientBottomBar } from "./components/TransientBottomBar";
import { AppRuntimeContext } from "./core/AppRuntimeContext";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import { useTransientMenu } from "./hooks/useTransientMenu";
import { getModule, getModuleRoute } from "./core/module-registry";

export function AppShell({
  children,
  activeModule,
  activeSpace = "library",
}: {
  children: ReactNode;
  activeModule: ModuleId;
  activeSpace?: ContentSpace;
}) {
  const router = useRouter();
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

  const handleModule = (id: ModuleId) => {
    menu.registerActivity();
    menu.closeMenu();
    if (id !== activeModule) router.push(getModuleRoute(id, activeSpace));
  };

  const handleSpace = (space: ContentSpace) => {
    menu.closeMenu();
    if (space !== activeSpace) router.push(getModuleRoute(activeModule, space));
  };

  const handleAdd = () => {
    if (!activeDefinition.create) return;
    menu.closeMenu();
    router.push(activeDefinition.create.route);
  };

  return (
    <AppRuntimeContext.Provider value={runtimeValue}>
      <main className="app-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
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
          activityKey={menu.activityKey}
          activeModule={activeModule}
          activeSpace={activeSpace}
          onClose={menu.closeMenu}
          onActivity={menu.registerActivity}
          onModule={handleModule}
          onSpace={handleSpace}
          addLabel={activeSpace === "library" && activeDefinition.create ? t(activeDefinition.create.label) : null}
          onAdd={handleAdd}
        />
        {toast ? <div className="toast" role="status">{toast}</div> : null}
        {updateReady ? (
          <div className="update-banner" role="status">
            <span>{t("toast.updateReady")}</span>
            <button type="button" onClick={activateUpdate}>{t("toast.reload")}</button>
          </div>
        ) : null}
      </main>
    </AppRuntimeContext.Provider>
  );
}
