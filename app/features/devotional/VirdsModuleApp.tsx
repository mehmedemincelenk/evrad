"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../AppShell";
import { CollectionChoiceModal, type CollectionChoice } from "../../components/CollectionChoiceModal";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { SortStatus } from "../../components/SortStatus";
import { StorageLoading } from "../../components/StorageLoading";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { TrackableModuleLayout } from "../../components/TrackableModuleLayout";
import { t } from "../../core/i18n";
import { getModule } from "../../core/module-registry";
import type { ArabicFontLevel } from "../../core/types";
import { DevotionalCard } from "./DevotionalCard";
import { type VirdEntry, useVirdsCollection } from "./useVirdsCollection";

export function VirdsModuleApp() {
  return (
    <AppShell activeModule="dhikr" activeSpace="library">
      <VirdsScreen />
    </AppShell>
  );
}

function VirdsScreen() {
  const router = useRouter();
  const state = useVirdsCollection();
  const [removeTarget, setRemoveTarget] = useState<VirdEntry | null>(null);

  const chooseRemoval = async (choice: CollectionChoice) => {
    if (!removeTarget) return;
    if (choice === "virds") await state.removeFromVirds(removeTarget);
    else await state.removeFromBag(removeTarget);
    setRemoveTarget(null);
  };

  return (
    <>
      <TrackableModuleLayout
        header={<ModuleScreenHeader eyebrow={t("module.dhikr.eyebrow")} title={t("module.dhikr.title")} tagline={t("module.dhikr.tagline")} />}
        loading={!state.ready}
        hasItems={state.entries.length > 0}
        loadingState={<StorageLoading label={t("loading.generic", { module: t("module.dhikr.title") })} />}
        emptyState={<TrackableEmptyState title={t("virds.empty")} body={t("virds.emptyBody")} actionLabel={t("menu.bag")} actionHref="/canta" />}
        status={<SortStatus active={Boolean(state.sorting.draggingId)} announcement={state.sorting.announcement} activeLabel={t("card.sorting")} />}
        footer={<p className="quiet-note">{t("app.lightNote")}</p>}
      >
        {state.entries.map((entry) => {
          const key = `${entry.moduleId}:${entry.item.id}`;
          return (
            <DevotionalCard
              key={key}
              mode="virds"
              moduleId={entry.moduleId}
              item={entry.item}
              complete={state.completeKeys.has(key)}
              expanded={state.expansion.expandedIds.has(key)}
              dragging={state.sorting.draggingId === key}
              dragOffsetY={state.sorting.draggingId === key ? state.sorting.dragOffsetY : 0}
              position={state.entries.findIndex((candidate) => candidate.id === key) + 1}
              onToggleExpanded={() => state.expansion.toggleExpanded(key)}
              onToggleComplete={() => state.toggleComplete(entry)}
              onChangeFont={(direction) => {
                const expandedArabicSize = Math.max(0, Math.min(4, entry.item.expandedArabicSize + direction)) as ArabicFontLevel;
                void state.update(entry, { expandedArabicSize });
              }}
              onEdit={() => router.push(`${entry.moduleId === "dhikr" ? "/zikirler" : getModule(entry.moduleId).route}/${encodeURIComponent(entry.item.id)}/duzenle`)}
              onDelete={() => setRemoveTarget(entry)}
              onRemoveFromCollections={() => setRemoveTarget(entry)}
              sortHandleProps={state.sorting.handleProps}
            />
          );
        })}
      </TrackableModuleLayout>
      {removeTarget ? (
        <CollectionChoiceModal
          title={t("collection.removeQuestion")}
          body={t("collection.removeBody")}
          choices={["virds", "bag", "both"]}
          onCancel={() => setRemoveTarget(null)}
          onChoose={chooseRemoval}
        />
      ) : null}
    </>
  );
}
