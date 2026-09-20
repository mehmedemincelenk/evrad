"use client";

import { useState } from "react";
import { AppShell } from "../../AppShell";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { SortStatus } from "../../components/SortStatus";
import { StorageLoading } from "../../components/StorageLoading";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { TrackableModuleLayout } from "../../components/TrackableModuleLayout";
import { t } from "../../core/i18n";
import { DevotionalCard } from "../devotional/DevotionalCard";
import { DevotionalContextChips } from "../devotional/DevotionalContextChips";
import { useDevotionalContextFilter } from "../devotional/useDevotionalContextFilter";
import { useDevotionalModule } from "../devotional/useDevotionalModule";
import { BagCategoryChips } from "./BagCategoryChips";
import { bagCategoryModule, matchesBagCategory, type BagCategory } from "./bag-categories";

export function BagModuleApp() {
  const [category, setCategory] = useState<BagCategory>("dhikr");
  return (
    <AppShell activeModule="bag" activeSpace="library">
      <BagCategoryList key={category} category={category} onCategory={setCategory} />
    </AppShell>
  );
}

function BagCategoryList({ category, onCategory }: { category: BagCategory; onCategory: (category: BagCategory) => void }) {
  const moduleId = bagCategoryModule(category);
  const state = useDevotionalModule(moduleId, null);
  const collection = state.collection;
  const categoryItems = collection.items.filter((item) => matchesBagCategory(item, category));
  const contextFilter = useDevotionalContextFilter(categoryItems);
  const selectedContexts = contextFilter.activeContext ? [contextFilter.activeContext] : [];
  const toolbar = (
    <div className="bag-toolbar">
      <BagCategoryChips active={category} onChange={onCategory} />
      <DevotionalContextChips selected={selectedContexts} onToggle={contextFilter.toggleContext} label={t("filter.contexts")} />
    </div>
  );
  return (
    <>
      <TrackableModuleLayout
        header={<ModuleScreenHeader eyebrow={t("module.bag.eyebrow")} title={t("module.bag.title")} tagline={t("module.bag.tagline")} />}
        loading={!collection.storageReady}
        hasItems={categoryItems.length > 0}
        loadingState={<StorageLoading label={t("loading.generic", { module: t("module.bag.title") })} />}
        emptyState={<TrackableEmptyState title={t("empty.libraryTitle")} body={t("empty.moduleBody")} actionLabel={t("empty.discover", { item: t(`bag.${category}`) })} actionHref="/kesfet/canta" />}
        toolbar={toolbar}
        status={<SortStatus active={Boolean(collection.sorting.draggingId)} announcement={collection.sorting.announcement} activeLabel={t("card.sorting")} />}
        footer={<p className="quiet-note">{t("app.lightNote")}</p>}
      >
        {contextFilter.filteredItems.map((item) => (
          <DevotionalCard
            key={item.id}
            moduleId={moduleId}
            item={item}
            complete={collection.completeIds.has(item.id)}
            expanded={collection.expandedIds.has(item.id)}
            dragging={collection.sorting.draggingId === item.id}
            dragOffsetY={collection.sorting.draggingId === item.id ? collection.sorting.dragOffsetY : 0}
            position={collection.items.findIndex((candidate) => candidate.id === item.id) + 1}
            onToggleExpanded={() => collection.toggleExpanded(item.id)}
            onToggleComplete={() => collection.toggleComplete(item.id)}
            mode="bag"
            inVirds={Boolean(item.inVirds)}
            onToggleVird={() => state.updateItem({ ...item, inVirds: !item.inVirds, updatedAt: new Date().toISOString() })}
            onRemoveFromCollections={() => void state.removeItem(item.id)}
            onChangeFont={(direction) => state.changeFont(item, direction)}
            onEdit={() => state.editItem(item.id)}
            onDelete={() => state.setDeleteTarget(item)}
            sortHandleProps={collection.sorting.handleProps}
          />
        ))}
      </TrackableModuleLayout>
    </>
  );
}
