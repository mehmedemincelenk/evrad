import { getModule, getModuleRoute } from "../core/module-registry";
import { t } from "../core/i18n";
import type { ContentSpace, TrackableModuleId } from "../core/types";
import { ModuleGlyph } from "./ModuleGlyph";

const moduleIds: TrackableModuleId[] = ["dhikr", "prayers", "memorization", "books"];

export function ModuleTabs({
  activeModule,
  activeSpace,
}: {
  activeModule: TrackableModuleId | "games";
  activeSpace: ContentSpace;
}) {
  return (
    <nav className="top-module-nav" aria-label={t("menu.modulesLabel")}>
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
            >
              <ModuleGlyph icon={definition.icon} />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
