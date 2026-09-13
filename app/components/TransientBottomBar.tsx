"use client";

import { useEffect } from "react";
import { modules } from "../core/module-registry";
import type { IconName, ModuleId } from "../core/types";
import { t } from "../core/i18n";

const glyphs: Record<IconName, string> = {
  prayer: "✦",
  book: "▤",
  memory: "◇",
  dhikr: "◉",
  game: "⌘",
};

export function TransientBottomBar({
  open,
  activityKey,
  activeModule,
  onClose,
  onActivity,
  onModule,
  addLabel,
  onAdd,
}: {
  open: boolean;
  activityKey: number;
  activeModule: ModuleId;
  onClose: () => void;
  onActivity: () => void;
  onModule: (id: ModuleId, enabled: boolean) => void;
  addLabel: string | null;
  onAdd: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timeout);
  }, [open, activityKey, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open ? <button className="menu-scrim" aria-label={t("menu.close")} type="button" onClick={onClose} /> : null}
      <nav
        className={`transient-bottom-bar${open ? " is-open" : ""}`}
        aria-label={t("menu.label")}
        aria-hidden={!open}
        onPointerDown={onActivity}
        onFocusCapture={onActivity}
      >
        {modules.map((module) => {
          const label = t(module.translationKey);
          const active = module.id === activeModule;
          return (
            <button
              className={`module-button${active ? " is-active" : ""}${!module.enabled ? " is-disabled" : ""}`}
              type="button"
              key={module.id}
              onClick={() => { onActivity(); onModule(module.id, module.enabled); }}
              aria-label={module.enabled ? `${label}${active ? `, ${t("menu.active")}` : ""}` : t("menu.comingSoonLabel", { module: label })}
              tabIndex={open ? 0 : -1}
              data-tooltip={label}
            >
              <span aria-hidden="true">{glyphs[module.icon]}</span>
            </button>
          );
        })}
        {addLabel ? (
          <button className="module-button add-module-button" type="button" onClick={() => { onActivity(); onAdd(); }} aria-label={addLabel} tabIndex={open ? 0 : -1} data-tooltip={addLabel}>
            <span aria-hidden="true">+</span>
          </button>
        ) : null}
      </nav>
    </>
  );
}
