"use client";

import { useEffect } from "react";
import { modules } from "../core/module-registry";
import type { ContentSpace, IconName, ModuleId } from "../core/types";
import { t } from "../core/i18n";
import { PlusMinusIcon } from "./PlusMinusIcon";

const glyphs: Record<IconName, string> = {
  prayer: "✦",
  book: "▤",
  memory: "◇",
  dhikr: "◉",
  game: "⌘",
};

export function TransientBottomBar({
  open,
  activeModule,
  activeSpace,
  onClose,
  onActivity,
  onModule,
  onSpace,
  addLabel,
  onAdd,
}: {
  open: boolean;
  activeModule: ModuleId;
  activeSpace: ContentSpace;
  onClose: () => void;
  onActivity: () => void;
  onModule: (id: ModuleId) => void;
  onSpace: (space: ContentSpace) => void;
  addLabel: string | null;
  onAdd: () => void;
}) {
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
        <div className="space-toggle" role="group" aria-label={t("menu.spaceLabel")}>
          {(["library", "discover"] as const).map((space) => (
            <button
              key={space}
              type="button"
              className={activeSpace === space ? "is-selected" : ""}
              aria-pressed={activeSpace === space}
              aria-label={t(space === "library" ? "menu.library" : "menu.discover")}
              data-tooltip={t(space === "library" ? "menu.library" : "menu.discover")}
              onClick={() => onSpace(space)}
              tabIndex={open ? 0 : -1}
            >
              <span className={`space-glyph is-${space}`} aria-hidden="true">{space === "library" ? "▦" : "✦"}</span>
            </button>
          ))}
        </div>
        <div className={`module-actions${addLabel ? "" : " without-add"}`}>
          {modules.map((module) => {
            const label = t(module.copy.menu);
            const active = module.id === activeModule;
            return (
              <button
                className={`module-button${active ? " is-active" : ""}`}
                type="button"
                key={module.id}
                onClick={() => onModule(module.id)}
                aria-label={`${label}${active ? `, ${t("menu.active")}` : ""}`}
                tabIndex={open ? 0 : -1}
                data-tooltip={label}
              >
                <span aria-hidden="true">{glyphs[module.icon]}</span>
              </button>
            );
          })}
          {addLabel ? (
            <button className="module-button add-module-button" type="button" onClick={onAdd} aria-label={addLabel} tabIndex={open ? 0 : -1} data-tooltip={addLabel}>
              <PlusMinusIcon />
            </button>
          ) : null}
        </div>
      </nav>
    </>
  );
}
