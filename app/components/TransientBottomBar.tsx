import type { ContentSpace, ModuleId } from "../core/types";
import { t } from "../core/i18n";
import { getModule, trackableNavigationModules } from "../core/module-registry";
import { PlusMinusIcon } from "./PlusMinusIcon";
import { TransientMenuBackdrop } from "./TransientMenuBackdrop";
import { SaveIcon } from "./SaveIcon";
import { ModuleGlyph } from "./ModuleGlyph";
import { NavigationGlyph } from "./NavigationGlyph";

export function TransientBottomBar({
  open,
  activeSpace,
  activeModule,
  pinned = false,
  page,
  onPageChange,
  onClose,
  onActivity,
  onSpace,
  onHome,
  onModule,
  addLabel,
  onAdd,
  backupLabel,
  backupSaving,
  onBackup,
}: {
  open: boolean;
  activeSpace: ContentSpace | null;
  activeModule: ModuleId | null;
  pinned?: boolean;
  page: "actions" | "modules";
  onPageChange: (page: "actions" | "modules") => void;
  onClose: () => void;
  onActivity: () => void;
  onSpace: (space: ContentSpace) => void;
  onHome: () => void;
  onModule: (moduleId: ModuleId) => void;
  addLabel: string | null;
  onAdd: () => void;
  backupLabel: string;
  backupSaving: boolean;
  onBackup: () => void;
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
        <div className="bottom-destinations">
          <button type="button" className={`bottom-destination${activeModule === null ? " is-selected" : ""}`} aria-current={activeModule === null ? "page" : undefined} onClick={onHome} tabIndex={open ? 0 : -1} aria-label={t("menu.home")} title={t("menu.home")}>
            <NavigationGlyph name="home" />
          </button>
          {(["library", "discover"] as const).map((space) => (
            <button
              key={space}
              type="button"
              className={`bottom-destination${activeSpace === space ? " is-selected" : ""}`}
              aria-current={activeSpace === space ? "page" : undefined}
              aria-label={t(space === "library" ? "menu.library" : "menu.discover")}
              title={t(space === "library" ? "menu.library" : "menu.discover")}
              onClick={() => onSpace(space)}
              tabIndex={open ? 0 : -1}
            >
              <NavigationGlyph name={space} />
            </button>
          ))}
        </div>
        <div className={`bottom-switcher is-${page}${addLabel ? " has-add" : ""}`}>
          <div className="bottom-page bottom-page-actions" aria-hidden={page !== "actions"}>
          <button
          className="bottom-action-button"
          type="button"
          onClick={onBackup}
          aria-label={backupLabel}
          aria-busy={backupSaving}
          disabled={backupSaving}
          tabIndex={open && page === "actions" ? 0 : -1}
          data-tooltip={backupLabel}
        >
          <SaveIcon />
        </button>
        {addLabel ? (
          <button className="bottom-action-button" type="button" onClick={onAdd} aria-label={addLabel} tabIndex={open && page === "actions" ? 0 : -1} data-tooltip={addLabel}>
            <PlusMinusIcon />
          </button>
        ) : null}
        <button className="bottom-action-button" type="button" aria-label={t("menu.openModules")} onClick={() => onPageChange("modules")} tabIndex={open && page === "actions" ? 0 : -1}>
          <span className="menu-chevron is-next" aria-hidden="true" />
        </button>
          </div>
          <div className="bottom-page bottom-page-modules" aria-hidden={page !== "modules"}>
          <button className="bottom-action-button" type="button" aria-label={t("menu.back")} onClick={() => onPageChange("actions")} tabIndex={open && page === "modules" ? 0 : -1}>
            <span className="menu-chevron is-back" aria-hidden="true" />
          </button>
          <div className="bottom-module-buttons">
            {trackableNavigationModules.map((id) => {
              const definition = getModule(id);
              const label = t(definition.copy.menu);
              const selected = id === activeModule;
              return (
                <button key={id} type="button" className={`bottom-module-button${selected ? " is-selected" : ""}`} aria-label={label} aria-current={selected ? "page" : undefined} title={label} onClick={() => onModule(id)} tabIndex={open && page === "modules" ? 0 : -1}>
                  <ModuleGlyph icon={definition.icon} />
                </button>
              );
            })}
          </div>
          </div>
        </div>
      </nav>
    </>
  );
}
