import type { ContentSpace } from "../core/types";
import { t } from "../core/i18n";
import { PlusMinusIcon } from "./PlusMinusIcon";
import { TransientMenuBackdrop } from "./TransientMenuBackdrop";
import { SaveIcon } from "./SaveIcon";

export function TransientBottomBar({
  open,
  activeSpace,
  onClose,
  onActivity,
  onSpace,
  addLabel,
  onAdd,
  backupLabel,
  backupSaving,
  onBackup,
}: {
  open: boolean;
  activeSpace: ContentSpace;
  onClose: () => void;
  onActivity: () => void;
  onSpace: (space: ContentSpace) => void;
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
        <div className="bottom-destinations">
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
          className="bottom-save-button"
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
          <button className="bottom-add-button" type="button" onClick={onAdd} aria-label={addLabel} tabIndex={open ? 0 : -1} data-tooltip={addLabel}>
            <PlusMinusIcon />
          </button>
        ) : null}
      </nav>
    </>
  );
}
