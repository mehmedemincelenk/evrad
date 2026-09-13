"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ModuleId } from "./core/types";
import { t } from "./core/i18n";
import { TransientBottomBar } from "./components/TransientBottomBar";
import { AppRuntimeContext } from "./core/AppRuntimeContext";
import { usePwaUpdate } from "./hooks/usePwaUpdate";
import { useTransientMenu } from "./hooks/useTransientMenu";

export function AppShell({
  children,
  activeModule,
  onAdd,
}: {
  children: ReactNode;
  activeModule: ModuleId;
  onAdd: () => void;
}) {
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

  const handleModule = (id: ModuleId, enabled: boolean) => {
    menu.registerActivity();
    if (!enabled) {
      const key = `menu.${id}` as "menu.prayers" | "menu.books" | "menu.memorization" | "menu.games";
      showToast(t("toast.comingSoon", { module: t(key) }));
      return;
    }
    if (id === activeModule) menu.closeMenu();
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
          onClose={menu.closeMenu}
          onActivity={menu.registerActivity}
          onModule={handleModule}
          onAdd={() => { menu.closeMenu(); onAdd(); }}
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
