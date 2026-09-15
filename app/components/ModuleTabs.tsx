import { getModule, getModuleRoute } from "../core/module-registry";
import { t } from "../core/i18n";
import type { ContentSpace, TrackableModuleId } from "../core/types";
import { ModuleGlyph } from "./ModuleGlyph";
import { TransientMenuBackdrop } from "./TransientMenuBackdrop";

const moduleIds: TrackableModuleId[] = ["dhikr", "prayers", "memorization", "books"];

export function ModuleTabs({
  open,
  activeModule,
  activeSpace,
  onClose,
  onActivity,
}: {
  open: boolean;
  activeModule: TrackableModuleId | "games";
  activeSpace: ContentSpace;
  onClose: () => void;
  onActivity: () => void;
}) {
  return (
    <>
      {open ? <TransientMenuBackdrop label={t("menu.close")} onClose={onClose} /> : null}
      <nav
        className={`top-module-nav${open ? " is-open" : ""}`}
        aria-label={t("menu.modulesLabel")}
        aria-hidden={!open}
        onPointerDown={onActivity}
        onFocusCapture={onActivity}
      >
        <div className="top-module-tabs">
          {moduleIds.map((id) => {
            const definition = getModule(id);
            const active = id === activeModule;
            const label = t(definition.copy.menu);
            return (
              <a
                key={id}
                className={`top-module-tab${active ? " is-selected" : ""}`}
                href={getModuleRoute(id, activeSpace)}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                title={label}
                tabIndex={open ? 0 : -1}
                onClick={onClose}
              >
                <ModuleGlyph icon={definition.icon} />
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
