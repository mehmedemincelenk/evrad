import type { ContentSpace, ModuleId } from "../core/types";
import { t } from "../core/i18n";
import { getModule, trackableNavigationModules } from "../core/module-registry";
import { PlusMinusIcon } from "./PlusMinusIcon";
import { TransientMenuBackdrop } from "./TransientMenuBackdrop";
import { SaveIcon } from "./SaveIcon";
import { ModuleGlyph } from "./ModuleGlyph";

export function TransientBottomBar({
  open,
  activeSpace,
  activeModule,
  page,
  onPageChange,
  onClose,
  onActivity,
  onSpace,
  onModule,
  addLabel,
  onAdd,
  backupLabel,
  backupSaving,
  onBackup,
}: {
  open: boolean;
  activeSpace: ContentSpace;
  activeModule: ModuleId;
  page: "actions" | "modules";
  onPageChange: (page: "actions" | "modules") => void;
  onClose: () => void;
  onActivity: () => void;
  onSpace: (space: ContentSpace) => void;
  onModule: (moduleId: ModuleId) => void;
  addLabel: string | null;
  onAdd: () => void;
  backupLabel: string;
  backupSaving: boolean;
  onBackup: () => void;
}) {
  return (
    <>
      {open ? <TransientMenuBackdrop label={t("menu.close")} onClose={onClose} /> : null}
      <nav
        className={`transient-bottom-bar${open ? " is-open" : ""}`}
        aria-label={t("menu.label")}
        aria-hidden={!open}
        onPointerDown={onActivity}
        onFocusCapture={onActivity}
      >
        {page === "actions" ? <><div className="bottom-destinations">
          {(["library", "discover"] as const).map((space) => (
            <button
              key={space}
              type="button"
              className={`bottom-destination${activeSpace === space ? " is-selected" : ""}`}
              aria-current={activeSpace === space ? "page" : undefined}
              onClick={() => onSpace(space)}
              tabIndex={open ? 0 : -1}
            >
              {t(space === "library" ? "menu.library" : "menu.discover")}
            </button>
          ))}
        </div>
        <button
          className="bottom-action-button"
          type="button"
          onClick={onBackup}
          aria-label={backupLabel}
          aria-busy={backupSaving}
          disabled={backupSaving}
          tabIndex={open ? 0 : -1}
          data-tooltip={backupLabel}
        >
          <SaveIcon />
        </button>
        {addLabel ? (
          <button className="bottom-action-button" type="button" onClick={onAdd} aria-label={addLabel} tabIndex={open ? 0 : -1} data-tooltip={addLabel}>
            <PlusMinusIcon />
          </button>
        ) : null}
        <button className="bottom-action-button" type="button" aria-label={t("menu.openModules")} onClick={() => onPageChange("modules")} tabIndex={open ? 0 : -1}>
          <span className="menu-chevron is-next" aria-hidden="true" />
        </button></> : <>
          <button className="bottom-action-button" type="button" aria-label={t("menu.back")} onClick={() => onPageChange("actions")} tabIndex={open ? 0 : -1}>
            <span className="menu-chevron is-back" aria-hidden="true" />
          </button>
          <div className="bottom-module-buttons">
            {trackableNavigationModules.map((id) => {
              const definition = getModule(id);
              const label = t(definition.copy.menu);
              const selected = id === activeModule;
              return (
                <button key={id} type="button" className={`bottom-module-button${selected ? " is-selected" : ""}`} aria-label={label} aria-current={selected ? "page" : undefined} title={label} onClick={() => onModule(id)} tabIndex={open ? 0 : -1}>
                  <ModuleGlyph icon={definition.icon} />
                </button>
              );
            })}
          </div>
        </>}
      </nav>
    </>
  );
}
