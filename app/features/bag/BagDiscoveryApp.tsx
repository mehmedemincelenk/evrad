"use client";

import { useCallback, useState } from "react";
import { AppShell } from "../../AppShell";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { StorageLoading } from "../../components/StorageLoading";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { TrackableModuleLayout } from "../../components/TrackableModuleLayout";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { t } from "../../core/i18n";
import { devotionalRepositories } from "../../data/repositories";
import { useDiscoveryLibrary } from "../../hooks/useDiscoveryLibrary";
import { useExpandableItems } from "../../hooks/useExpandableItems";
import { DiscoveryDevotionalCard } from "../discovery/DiscoveryDevotionalCard";
import { getDevotionalCatalog } from "../discovery/discovery-catalog";
import { DevotionalContextChips } from "../devotional/DevotionalContextChips";
import { useDevotionalContextFilter } from "../devotional/useDevotionalContextFilter";
import { BagCategoryChips } from "./BagCategoryChips";
import { bagCategoryModule, matchesBagCategory, type BagCategory } from "./bag-categories";

export function BagDiscoveryApp() {
  const [category, setCategory] = useState<BagCategory>("prayers");
  return (
    <AppShell activeModule="bag" activeSpace="discover">
      <BagDiscoveryList key={category} category={category} onCategory={setCategory} />
    </AppShell>
  );
}

function BagDiscoveryList({ category, onCategory }: { category: BagCategory; onCategory: (category: BagCategory) => void }) {
  const moduleId = bagCategoryModule(category);
  const catalog = getDevotionalCatalog(moduleId).filter((item) => matchesBagCategory(item, category));
  const contextFilter = useDevotionalContextFilter(catalog);
  const selectedContexts = contextFilter.activeContext ? [contextFilter.activeContext] : [];
  const { expandedIds, toggleExpanded } = useExpandableItems();
  const { showToast } = useAppRuntime();
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useDiscoveryLibrary(devotionalRepositories[moduleId], onError);
  return (
    <TrackableModuleLayout
      header={<ModuleScreenHeader eyebrow={t("space.discoverEyebrow")} title={t("discover.bag.title")} tagline={t("space.discoverTagline")} />}
      loading={!library.ready}
      hasItems={catalog.length > 0}
      loadingState={<StorageLoading label={t("loading.generic", { module: t("module.bag.title") })} />}
      emptyState={<TrackableEmptyState title={t("discover.emptyTitle")} body={t("discover.emptyBody")} />}
      toolbar={<div className="bag-toolbar"><BagCategoryChips active={category} onChange={onCategory} /><DevotionalContextChips selected={selectedContexts} onToggle={contextFilter.toggleContext} label={t("filter.contexts")} /></div>}
    >
      {contextFilter.filteredItems.map((item) => (
        <DiscoveryDevotionalCard
          key={item.id}
          moduleId={moduleId}
          item={item}
          expanded={expandedIds.has(item.id)}
          added={library.itemIds.has(item.id)}
          onToggle={() => toggleExpanded(item.id)}
          onAdd={() => void library.toggle(item)}
        />
      ))}
    </TrackableModuleLayout>
  );
}
