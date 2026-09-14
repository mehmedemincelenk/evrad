import { AppShell } from "../../AppShell";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { t } from "../../core/i18n";
import type { ModuleId } from "../../core/types";

export function EmptyModuleApp({ moduleId }: { moduleId: ModuleId }) {
  return (
    <AppShell activeModule={moduleId} activeSpace="library">
      <section className="module-screen" aria-labelledby="page-title">
        <ModuleScreenHeader eyebrow={t("module.games.eyebrow")} title={t("module.games.title")} tagline={t("module.games.tagline")} />
        <TrackableEmptyState title={t("empty.libraryTitle")} body={t("empty.moduleBody")} />
      </section>
    </AppShell>
  );
}
