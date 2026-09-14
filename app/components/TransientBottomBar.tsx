"use client";

import { useEffect } from "react";
import type { ContentSpace } from "../core/types";
import { t } from "../core/i18n";
import { PlusMinusIcon } from "./PlusMinusIcon";

export function TransientBottomBar({
  open,
  activeSpace,
  onClose,
  onActivity,
  onSpace,
  addLabel,
  onAdd,
}: {
  open: boolean;
  activeSpace: ContentSpace;
  onClose: () => void;
  onActivity: () => void;
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
        {addLabel ? (
          <button className="bottom-add-button" type="button" onClick={onAdd} aria-label={addLabel} tabIndex={open ? 0 : -1} data-tooltip={addLabel}>
            <PlusMinusIcon />
          </button>
        ) : null}
      </nav>
    </>
  );
}
