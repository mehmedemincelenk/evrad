"use client";

import { useState } from "react";
import type { ContentSpace, ModuleId } from "../core/types";
import { t } from "../core/i18n";
import { getModule, trackableNavigationModules } from "../core/module-registry";
import { PlusMinusIcon } from "./PlusMinusIcon";
import { TransientMenuBackdrop } from "./TransientMenuBackdrop";
import { ModuleGlyph } from "./ModuleGlyph";
import { NavigationGlyph } from "./NavigationGlyph";

export function TransientBottomBar({
  open,
  activeSpace,
  activeModule,
  pinned = false,
  onClose,
  onActivity,
  onSpace,
  onHome,
  onModule,
  addLabel,
  onAdd,
}: {
  open: boolean;
  activeSpace: ContentSpace | null;
  activeModule: ModuleId | null;
  pinned?: boolean;
  onClose: () => void;
  onActivity: () => void;
  onSpace: (space: ContentSpace) => void;
  onHome: () => void;
  onModule: (moduleId: ModuleId) => void;
  addLabel: string | null;
  onAdd: () => void;
}) {
  const [contextOpen, setContextOpen] = useState(false);
  const contextModule = activeModule ?? "dhikr";
  const contextSpace = activeSpace ?? "library";
  const contextDefinition = getModule(contextModule);
  const contextLabel = `${t(contextDefinition.copy.menu)}, ${t(contextSpace === "library" ? "menu.library" : "menu.discover")}`;

  const chooseSpace = (space: ContentSpace) => {
    setContextOpen(false);
    onSpace(space);
  };

  const chooseModule = (moduleId: ModuleId) => {
    setContextOpen(false);
    onModule(moduleId);
  };

  return (
    <>
      {open && !pinned ? <TransientMenuBackdrop label={t("menu.close")} onClose={() => { setContextOpen(false); onClose(); }} /> : null}
      <nav
        className={`transient-bottom-bar${open ? " is-open" : ""}${pinned ? " is-pinned" : ""}`}
        aria-label={t("menu.label")}
        aria-hidden={!open}
        onPointerDown={onActivity}
        onFocusCapture={onActivity}
      >
        <div className={`bottom-context${contextOpen ? " is-open" : ""}`}>
          <div className="bottom-context-panel" aria-hidden={!contextOpen}>
            <div className="bottom-module-buttons" role="group" aria-label={t("menu.modulesLabel")}>
              {trackableNavigationModules.map((id) => {
                const definition = getModule(id);
                const label = t(definition.copy.menu);
                const selected = id === contextModule;
                return (
                  <button key={id} type="button" className={`bottom-module-button${selected ? " is-selected" : ""}`} aria-label={label} aria-pressed={selected} title={label} onClick={() => chooseModule(id)} tabIndex={open && contextOpen ? 0 : -1}>
                    <ModuleGlyph icon={definition.icon} />
                  </button>
                );
              })}
            </div>
            <div className="bottom-space-segment" role="group" aria-label={t("menu.spaceLabel")}>
              {(["library", "discover"] as const).map((space) => {
                const selected = contextSpace === space;
                const label = t(space === "library" ? "menu.library" : "menu.discover");
                return (
                  <button key={space} type="button" className={`bottom-space-option${selected ? " is-selected" : ""}`} aria-label={label} aria-pressed={selected} title={label} onClick={() => chooseSpace(space)} tabIndex={open && contextOpen ? 0 : -1}>
                    <NavigationGlyph name={space} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bottom-base-row">
            <button type="button" className={`bottom-nav-button bottom-home${activeModule === null ? " is-selected" : ""}`} aria-current={activeModule === null ? "page" : undefined} onClick={() => { setContextOpen(false); onHome(); }} tabIndex={open ? 0 : -1} aria-label={t("menu.home")} title={t("menu.home")}>
              <NavigationGlyph name="home" />
            </button>
            <button type="button" className={`bottom-context-trigger${contextOpen ? " is-selected" : ""}`} onClick={() => setContextOpen((current) => !current)} tabIndex={open ? 0 : -1} aria-label={contextLabel} aria-expanded={contextOpen}>
              <ModuleGlyph icon={contextDefinition.icon} />
              <span className="context-join" aria-hidden="true" />
              <NavigationGlyph name={contextSpace} />
              <span className="context-chevron" aria-hidden="true" />
            </button>
            {addLabel ? (
              <button className="bottom-nav-button bottom-add" type="button" onClick={onAdd} aria-label={addLabel} tabIndex={open ? 0 : -1} title={addLabel}>
                <PlusMinusIcon />
              </button>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  );
}
