"use client";

import { useState } from "react";
import { AppShell } from "../../AppShell";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { RecordFilters } from "../../components/RecordFilters";
import { SearchBar } from "../../components/SearchBar";
import { StorageLoading } from "../../components/StorageLoading";
import { TrackableModuleLayout } from "../../components/TrackableModuleLayout";
import { t } from "../../core/i18n";
import { recordKey } from "../../core/collections";
import { useExpandableItems } from "../../hooks/useExpandableItems";
import { useRecordFilters } from "../../hooks/useRecordFilters";
import { discoveryCatalog } from "./discovery-catalog";
import { DiscoveryDevotionalCard } from "./DiscoveryDevotionalCard";
import { useDiscovery } from "./useDiscovery";

export function DiscoveryApp() {
  return <AppShell section="discover"><DiscoveryScreen /></AppShell>;
}

export function DiscoveryScreen() {
  const library = useDiscovery();
  const filters = useRecordFilters();
  const expansion = useExpandableItems();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("tr");

  const visible = discoveryCatalog.filter(({ moduleId, item }) => {
    if (!filters.matches(item, moduleId)) return false;
    if (!normalizedQuery) return true;

    const inName = item.name?.toLocaleLowerCase("tr").includes(normalizedQuery);
    const inArabic = item.arabic?.includes(normalizedQuery);
    const inTranslation = item.translation?.toLocaleLowerCase("tr").includes(normalizedQuery);
    const inDetails = item.details?.toLocaleLowerCase("tr").includes(normalizedQuery);
    const inSource = item.source?.toLocaleLowerCase("tr").includes(normalizedQuery);

    return Boolean(inName || inArabic || inTranslation || inDetails || inSource);
  });

  return (
    <TrackableModuleLayout
      header={
        <ModuleScreenHeader
          title={t("discover.bag.title")}
          eyebrow={t("space.discoverEyebrow")}
          tagline={t("space.discoverTagline")}
          filters={<RecordFilters filters={filters} />}
        />
      }
      toolbar={<SearchBar value={searchQuery} onChange={setSearchQuery} />}
      loading={!library.ready}
      hasItems
      loadingState={<StorageLoading label={t("loading.generic", { module: t("menu.discover") })} />}
      emptyState={null}
    >
      {library.failed ? (
        <p role="alert">{t("toast.storageError")}</p>
      ) : (
        visible.map(({ moduleId, item }) => {
          const key = recordKey(moduleId, item.id);
          return (
            <DiscoveryDevotionalCard
              key={key}
              moduleId={moduleId}
              item={item}
              expanded={expansion.expandedIds.has(key)}
              onToggle={() => expansion.toggleExpanded(key)}
              added={library.includes(moduleId, item.id, "virds")}
              liked={library.includes(moduleId, item.id, "favorites")}
              onAdd={() => void library.toggle(moduleId, item, "virds")}
              onLike={() => void library.toggle(moduleId, item, "favorites")}
            />
          );
        })
      )}
      {!library.failed && !visible.length ? (
        <p className="filter-empty">
          {searchQuery.trim() ? t("discover.searchEmpty") : t("filter.empty")}
        </p>
      ) : null}
    </TrackableModuleLayout>
  );
}
