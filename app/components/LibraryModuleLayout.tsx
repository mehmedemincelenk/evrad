import type { ReactNode } from "react";
import { t } from "../core/i18n";
import type { TrackableModuleDefinition } from "../core/types";
import { ModuleScreenHeader } from "./ModuleScreenHeader";
import { SortStatus } from "./SortStatus";
import { StorageLoading } from "./StorageLoading";
import { TrackableEmptyState } from "./TrackableEmptyState";
import { TrackableModuleLayout } from "./TrackableModuleLayout";

export function LibraryModuleLayout({
  module,
  itemLabel,
  storageReady,
  hasItems,
  sorting,
  toolbar,
  children,
}: {
  module: TrackableModuleDefinition;
  itemLabel: string;
  storageReady: boolean;
  hasItems: boolean;
  sorting: { draggingId: string | null; announcement: string };
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const title = t(module.copy.title);
  return (
    <TrackableModuleLayout
      header={<ModuleScreenHeader eyebrow={t(module.copy.eyebrow)} title={title} tagline={t(module.copy.tagline)} />}
      loading={!storageReady}
      hasItems={hasItems}
      loadingState={<StorageLoading label={t("loading.generic", { module: title })} />}
      emptyState={<TrackableEmptyState title={t("empty.libraryTitle")} body={t("empty.libraryBody", { item: itemLabel })} actionLabel={t("empty.discover", { item: itemLabel })} actionHref={module.discoverRoute} />}
      status={<SortStatus active={Boolean(sorting.draggingId)} announcement={sorting.announcement} activeLabel={t("card.sorting")} />}
      footer={<p className="quiet-note">{t("app.lightNote")}</p>}
      toolbar={toolbar}
    >
      {children}
    </TrackableModuleLayout>
  );
}
