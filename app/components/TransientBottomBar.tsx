"use client";

import type { ContentSpace, ModuleId } from "../core/types";
import { t } from "../core/i18n";
import { Plus } from "lucide-react";
import { NavigationGlyph } from "./NavigationGlyph";

export function TransientBottomBar({
  activeSpace,
  activeModule,
  onSpace,
  onHome,
  onModule,
  addLabel,
  onAdd,
}: {
  activeSpace: ContentSpace | null;
  activeModule: ModuleId | null;
  onSpace: (space: ContentSpace) => void;
  onHome: () => void;
  onModule: (moduleId: ModuleId) => void;
  addLabel: string;
  onAdd: () => void;
}) {
  return (
      <nav
        className="transient-bottom-bar is-open is-pinned"
        aria-label={t("menu.label")}
      >
        <div className="bottom-base-row">
          <div className="bottom-space-segment bottom-primary-segment" role="group" aria-label={t("menu.label")}>
            <button type="button" className={`bottom-space-option${activeModule === null ? " is-selected" : ""}`} aria-label={t("menu.home")} aria-pressed={activeModule === null} title={t("menu.home")} onClick={onHome}><NavigationGlyph name="home" /></button>
            <button type="button" className={`bottom-space-option${activeModule === "dhikr" && activeSpace !== "discover" ? " is-selected" : ""}`} aria-label={t("menu.virds")} aria-pressed={activeModule === "dhikr" && activeSpace !== "discover"} title={t("menu.virds")} onClick={() => onModule("dhikr")}><NavigationGlyph name="virds" /></button>
            <button type="button" className={`bottom-space-option${activeModule === "bag" && activeSpace !== "discover" ? " is-selected" : ""}`} aria-label={t("menu.bag")} aria-pressed={activeModule === "bag" && activeSpace !== "discover"} title={t("menu.bag")} onClick={() => onModule("bag")}><NavigationGlyph name="bag" /></button>
            <button type="button" className={`bottom-space-option${activeSpace === "discover" ? " is-selected" : ""}`} aria-label={t("menu.discover")} aria-pressed={activeSpace === "discover"} title={t("menu.discover")} onClick={() => onSpace("discover")}><NavigationGlyph name="discover" /></button>
          </div>
          <button className="bottom-nav-button bottom-add" type="button" onClick={onAdd} aria-label={addLabel} title={addLabel}><Plus className="navigation-glyph" aria-hidden="true" strokeWidth={1.8} /></button>
        </div>
      </nav>
  );
}
