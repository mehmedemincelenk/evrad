"use client";

import { useCallback, type ReactNode } from "react";
import { AppShell } from "../../AppShell";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { StorageLoading } from "../../components/StorageLoading";
import { TrackableEmptyState } from "../../components/TrackableEmptyState";
import { TrackableModuleLayout } from "../../components/TrackableModuleLayout";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { t, type TranslationKey } from "../../core/i18n";
import type { BookItem, DevotionalItem, DevotionalModuleId, ModuleId } from "../../core/types";
import { useDiscoveryLibrary } from "../../hooks/useDiscoveryLibrary";
import { useExpandableItems } from "../../hooks/useExpandableItems";
import { bookRepository } from "../books/book-repository";
import { getDevotionalConfig } from "../devotional/devotional-config";
import { getDevotionalDisplay } from "../devotional/devotional-utils";
import { DiscoveryBookCard } from "./DiscoveryBookCard";
import { DiscoveryDevotionalCard } from "./DiscoveryDevotionalCard";
import { bookCatalog, getDevotionalCatalog } from "./discovery-catalog";

const titleKeys: Record<ModuleId, TranslationKey> = {
  dhikr: "discover.dhikr.title",
  prayers: "discover.prayers.title",
  memorization: "discover.memorization.title",
  books: "discover.books.title",
  games: "discover.games.title",
};

export function DiscoveryModuleApp({ moduleId }: { moduleId: ModuleId }) {
  return (
    <AppShell activeModule={moduleId} activeSpace="discover">
      {moduleId === "books" ? <BookDiscovery /> : moduleId === "games" ? <EmptyDiscovery moduleId={moduleId} /> : <DevotionalDiscovery moduleId={moduleId} />}
    </AppShell>
  );
}

function DiscoveryLayout({ moduleId, loading, hasItems, children }: { moduleId: ModuleId; loading: boolean; hasItems: boolean; children: ReactNode }) {
  const title = t(titleKeys[moduleId]);
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

function DevotionalDiscovery({ moduleId }: { moduleId: DevotionalModuleId }) {
  const { showToast } = useAppRuntime();
  const { expandedIds, toggleExpanded } = useExpandableItems();
  const config = getDevotionalConfig(moduleId);
  const catalog = getDevotionalCatalog(moduleId);
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useDiscoveryLibrary<DevotionalItem>(config.repository, onError);
  const add = async (item: (typeof catalog)[number]) => {
    const title = getDevotionalDisplay(item as DevotionalItem).text;
    const result = await library.add(item);
    if (result !== "failed") showToast(t(result === "added" ? "toast.addedToLibrary" : "toast.alreadyInLibrary", { title }));
  };
  return (
    <DiscoveryLayout moduleId={moduleId} loading={!library.ready} hasItems={catalog.length > 0}>
      {catalog.map((item) => <DiscoveryDevotionalCard key={item.id} item={item} expanded={expandedIds.has(item.id)} added={library.itemIds.has(item.id)} onToggle={() => toggleExpanded(item.id)} onAdd={() => add(item)} />)}
    </DiscoveryLayout>
  );
}

function BookDiscovery() {
  const { showToast } = useAppRuntime();
  const { expandedIds, toggleExpanded } = useExpandableItems();
  const onError = useCallback(() => showToast(t("toast.storageError")), [showToast]);
  const library = useDiscoveryLibrary<BookItem>(bookRepository, onError);
  const add = async (item: (typeof bookCatalog)[number]) => {
    const result = await library.add(item);
    if (result !== "failed") showToast(t(result === "added" ? "toast.addedToLibrary" : "toast.alreadyInLibrary", { title: item.title }));
  };
  return (
    <DiscoveryLayout moduleId="books" loading={!library.ready} hasItems={bookCatalog.length > 0}>
      {bookCatalog.map((item) => <DiscoveryBookCard key={item.id} item={item} expanded={expandedIds.has(item.id)} added={library.itemIds.has(item.id)} onToggle={() => toggleExpanded(item.id)} onAdd={() => add(item)} />)}
    </DiscoveryLayout>
  );
}

function EmptyDiscovery({ moduleId }: { moduleId: ModuleId }) {
  return <DiscoveryLayout moduleId={moduleId} loading={false} hasItems={false}>{null}</DiscoveryLayout>;
}
