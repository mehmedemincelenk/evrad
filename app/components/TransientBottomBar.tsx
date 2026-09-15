import type { ContentSpace } from "../core/types";
import { t } from "../core/i18n";
import { PlusMinusIcon } from "./PlusMinusIcon";
import { TransientMenuBackdrop } from "./TransientMenuBackdrop";

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
        {addLabel ? (
          <button className="bottom-add-button" type="button" onClick={onAdd} aria-label={addLabel} tabIndex={open ? 0 : -1} data-tooltip={addLabel}>
            <PlusMinusIcon />
          </button>
        ) : null}
      </nav>
    </>
  );
}
