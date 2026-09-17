"use client";

import type { ContentSpace, ModuleId } from "../core/types";
import { t } from "../core/i18n";
import { getModule, navigationModules } from "../core/module-registry";
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
  return (
    <>
      {open && !pinned ? <TransientMenuBackdrop label={t("menu.close")} onClose={onClose} /> : null}
      <nav
        className={`transient-bottom-bar${open ? " is-open" : ""}${pinned ? " is-pinned" : ""}`}
        aria-label={t("menu.label")}
        aria-hidden={!open}
        onPointerDown={onActivity}
        onFocusCapture={onActivity}
      >
        <div className="bottom-base-row">
          <button type="button" className={`bottom-nav-button bottom-home${activeModule === null ? " is-selected" : ""}`} aria-current={activeModule === null ? "page" : undefined} onClick={onHome} tabIndex={open ? 0 : -1} aria-label={t("menu.home")} title={t("menu.home")}>
            <NavigationGlyph name="home" />
          </button>
          <span className="bottom-divider" aria-hidden="true" />
          <div className="bottom-module-buttons" role="group" aria-label={t("menu.modulesLabel")}>
            {navigationModules.map((id) => {
              const definition = getModule(id);
              const label = t(definition.copy.menu);
              const selected = id === activeModule;
              return <button key={id} type="button" className={`bottom-nav-button bottom-module-button${selected ? " is-selected" : ""}`} aria-label={label} aria-pressed={selected} title={label} onClick={() => onModule(id)} tabIndex={open ? 0 : -1}><ModuleGlyph icon={definition.icon} /></button>;
            })}
          </div>
          <span className="bottom-divider" aria-hidden="true" />
          <div className="bottom-space-segment" role="group" aria-label={t("menu.spaceLabel")}>
            {(["library", "discover"] as const).map((space) => {
              const selected = activeSpace === space;
              const label = t(space === "library" ? "menu.library" : "menu.discover");
              return <button key={space} type="button" className={`bottom-space-option${selected ? " is-selected" : ""}`} aria-label={label} aria-pressed={selected} title={label} onClick={() => onSpace(space)} tabIndex={open ? 0 : -1}><NavigationGlyph name={space} /></button>;
            })}
          </div>
          {addLabel ? <button className="bottom-nav-button bottom-add" type="button" onClick={onAdd} aria-label={addLabel} tabIndex={open ? 0 : -1} title={addLabel}><PlusMinusIcon /></button> : null}
        </div>
      </nav>
    </>
  );
}
