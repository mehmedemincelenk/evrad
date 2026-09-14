import { AppShell } from "../../AppShell";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { t } from "../../core/i18n";

export function EmptyModuleApp() {
  return (
    <AppShell activeModule="games" activeSpace="library">
      <section className="module-screen" aria-labelledby="page-title">
        <ModuleScreenHeader eyebrow={t("module.games.eyebrow")} title={t("module.games.title")} tagline={t("module.games.tagline")} />
        <TrackableEmptyState title={t("empty.libraryTitle")} body={t("empty.moduleBody")} />
      </section>
    </AppShell>
  );
}
