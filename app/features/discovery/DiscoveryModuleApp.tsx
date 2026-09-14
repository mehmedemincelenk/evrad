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
import { getDevotionalDisplay } from "../devotional/devotional-utils";
import { DiscoveryBookCard } from "./DiscoveryBookCard";
import { DiscoveryDevotionalCard } from "./DiscoveryDevotionalCard";
import { bookCatalog, getDevotionalCatalog } from "./discovery-catalog";

export function DiscoveryModuleApp({ moduleId }: { moduleId: ModuleId }) {
  return (
    <AppShell activeModule={moduleId} activeSpace="discover">
      {moduleId === "games" ? <DiscoveryLayout moduleId="games" loading={false} hasItems={false} /> : moduleId === "books" ? <BookDiscovery /> : <DevotionalDiscovery moduleId={moduleId} />}
    </AppShell>
  );
}

function DiscoveryLayout({ moduleId, loading, hasItems, children }: { moduleId: ModuleId; loading: boolean; hasItems: boolean; children?: ReactNode }) {
  const definition = getModule(moduleId);
  const title = t(definition.copy.discoverTitle);
  return (
    <TrackableModuleLayout
      header={<ModuleScreenHeader eyebrow={t("space.discoverEyebrow")} title={title} tagline={t("space.discoverTagline")} />}
      loading={loading}
      hasItems={hasItems}
      loadingState={<StorageLoading label={t("loading.generic", { module: title })} />}
      emptyState={<TrackableEmptyState title={t("discover.emptyTitle")} body={t("discover.emptyBody")} />}
    >
      {children}
    </TrackableModuleLayout>
  );
}

function DiscoveryList<T extends TrackableEntity>({
  moduleId,
  catalog,
  repository,
  getTitle,
  renderCard,
}: {
  moduleId: ModuleId;
  catalog: EntityTemplate<T>[];
  repository: TrackableRepository<T>;
  getTitle: (item: EntityTemplate<T>) => string;
  renderCard: (props: { item: EntityTemplate<T>; expanded: boolean; added: boolean; onToggle: () => void; onAdd: () => void }) => ReactNode;
}) {
  const { showToast } = useAppRuntime();
  const { expandedIds, toggleExpanded } = useExpandableItems();
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useDiscoveryLibrary(repository, onError);

  const add = async (item: EntityTemplate<T>) => {
    const title = getTitle(item);
    const result = await library.add(item);
    if (result !== "failed") showToast(t(result === "added" ? "toast.addedToLibrary" : "toast.alreadyInLibrary", { title }));
  };

  return (
    <DiscoveryLayout moduleId={moduleId} loading={!library.ready} hasItems={catalog.length > 0}>
      {catalog.map((item) => (
        <Fragment key={item.id}>
          {renderCard({
            item,
            expanded: expandedIds.has(item.id),
            added: library.itemIds.has(item.id),
            onToggle: () => toggleExpanded(item.id),
            onAdd: () => void add(item),
          })}
        </Fragment>
      ))}
    </DiscoveryLayout>
  );
}

function DevotionalDiscovery({ moduleId }: { moduleId: DevotionalModuleId }) {
  return (
    <DiscoveryList<DevotionalItem>
      moduleId={moduleId}
      catalog={getDevotionalCatalog(moduleId)}
      repository={devotionalRepositories[moduleId]}
      getTitle={(item) => getDevotionalDisplay(item).text}
      renderCard={(props) => <DiscoveryDevotionalCard {...props} />}
    />
  );
}

function BookDiscovery() {
  return (
    <DiscoveryList<BookItem>
      moduleId="books"
      catalog={bookCatalog}
      repository={bookRepository}
      getTitle={(item) => item.title}
      renderCard={(props) => <DiscoveryBookCard {...props} />}
    />
  );
}
