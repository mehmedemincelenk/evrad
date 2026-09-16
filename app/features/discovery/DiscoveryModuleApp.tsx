"use client";

import { Fragment, useCallback, type ReactNode } from "react";
import { AppShell } from "../../AppShell";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { StorageLoading } from "../../components/StorageLoading";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { TrackableModuleLayout } from "../../components/TrackableModuleLayout";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { t } from "../../core/i18n";
import { getModule } from "../../core/module-registry";
import type { BookItem, DevotionalItem, DevotionalModuleId, EntityTemplate, ModuleId, TrackableEntity, TrackableRepository } from "../../core/types";
import { bookRepository, devotionalRepositories } from "../../data/repositories";
import { useDiscoveryLibrary } from "../../hooks/useDiscoveryLibrary";
import { useExpandableItems } from "../../hooks/useExpandableItems";
import { DiscoveryBookCard } from "./DiscoveryBookCard";
import { DiscoveryDevotionalCard } from "./DiscoveryDevotionalCard";
import { bookCatalog, getDevotionalCatalog } from "./discovery-catalog";
import { DevotionalContextChips } from "../devotional/DevotionalContextChips";
import { useDevotionalContextFilter } from "../devotional/useDevotionalContextFilter";

export function DiscoveryModuleApp({ moduleId }: { moduleId: ModuleId }) {
  return (
    <AppShell activeModule={moduleId} activeSpace="discover">
      {moduleId === "games" ? <DiscoveryLayout moduleId="games" loading={false} hasItems={false} /> : moduleId === "books" ? <BookDiscovery /> : <DevotionalDiscovery moduleId={moduleId} />}
    </AppShell>
  );
}

function DiscoveryLayout({ moduleId, loading, hasItems, toolbar, children }: { moduleId: ModuleId; loading: boolean; hasItems: boolean; toolbar?: ReactNode; children?: ReactNode }) {
  const definition = getModule(moduleId);
  const title = t(definition.copy.discoverTitle);
  return (
    <TrackableModuleLayout
      header={<ModuleScreenHeader eyebrow={t("space.discoverEyebrow")} title={title} tagline={t("space.discoverTagline")} />}
      loading={loading}
      hasItems={hasItems}
      loadingState={<StorageLoading label={t("loading.generic", { module: title })} />}
      emptyState={<TrackableEmptyState title={t("discover.emptyTitle")} body={t("discover.emptyBody")} />}
      toolbar={toolbar}
    >
      {children}
    </TrackableModuleLayout>
  );
}

function DiscoveryList<T extends TrackableEntity>({
  moduleId,
  catalog,
  repository,
  toolbar,
  renderCard,
}: {
  moduleId: ModuleId;
  catalog: EntityTemplate<T>[];
  repository: TrackableRepository<T>;
  toolbar?: ReactNode;
  renderCard: (props: { item: EntityTemplate<T>; expanded: boolean; added: boolean; onToggle: () => void; onAdd: () => void }) => ReactNode;
}) {
  const { showToast } = useAppRuntime();
  const { expandedIds, toggleExpanded } = useExpandableItems();
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useDiscoveryLibrary(repository, onError);

  return (
    <DiscoveryLayout moduleId={moduleId} loading={!library.ready} hasItems={Boolean(toolbar) || catalog.length > 0} toolbar={toolbar}>
      {catalog.length === 0 ? <p className="filter-empty">{t("filter.empty")}</p> : catalog.map((item) => (
        <Fragment key={item.id}>
          {renderCard({
            item,
            expanded: expandedIds.has(item.id),
            added: library.itemIds.has(item.id),
            onToggle: () => toggleExpanded(item.id),
            onAdd: () => void library.toggle(item),
          })}
        </Fragment>
      ))}
    </DiscoveryLayout>
  );
}

function DevotionalDiscovery({ moduleId }: { moduleId: DevotionalModuleId }) {
  const catalog = getDevotionalCatalog(moduleId);
  const contextFilter = useDevotionalContextFilter(catalog);
  const selectedContexts = contextFilter.activeContext ? [contextFilter.activeContext] : [];
  const hasContextFilter = moduleId !== "memorization";
  return (
    <DiscoveryList<DevotionalItem>
      moduleId={moduleId}
      catalog={hasContextFilter ? contextFilter.filteredItems : catalog}
      repository={devotionalRepositories[moduleId]}
      toolbar={hasContextFilter ? (
        <div className="context-filter">
          <DevotionalContextChips selected={selectedContexts} onToggle={contextFilter.toggleContext} label={t("filter.contexts")} />
        </div>
      ) : undefined}
      renderCard={(props) => <DiscoveryDevotionalCard {...props} moduleId={moduleId} />}
    />
  );
}

function BookDiscovery() {
  return (
    <DiscoveryList<BookItem>
      moduleId="books"
      catalog={bookCatalog}
      repository={bookRepository}
      renderCard={(props) => <DiscoveryBookCard {...props} />}
    />
  );
}
