"use client";

import type { ReactNode } from "react";
import type { ModuleId } from "./core/types";
import { t } from "./core/i18n";
import { TransientBottomBar } from "./components/TransientBottomBar";

export function AppShell({
  children,
  menuOpen,
  menuActivity,
  activeModule,
  onOpenMenu,
  onCloseMenu,
  onMenuActivity,
  onModule,
  onAdd,
}: {
  children: ReactNode;
  menuOpen: boolean;
  menuActivity: number;
  activeModule: ModuleId;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onMenuActivity: () => void;
  onModule: (id: ModuleId, enabled: boolean) => void;
  onAdd: () => void;
}) {
  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      {children}
      <button
        className={`edge-launcher${menuOpen ? " is-open" : ""}`}
        type="button"
        aria-label={t(menuOpen ? "menu.close" : "menu.open")}
        aria-expanded={menuOpen}
        onClick={menuOpen ? onCloseMenu : onOpenMenu}
      >
        <span />
        <span />
        <span />
      </button>
      <TransientBottomBar
        open={menuOpen}
        activityKey={menuActivity}
        activeModule={activeModule}
        onClose={onCloseMenu}
        onActivity={onMenuActivity}
        onModule={onModule}
        onAdd={onAdd}
      />
    </main>
  );
}
