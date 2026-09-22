"use client";

import { AppShell } from "../../AppShell";
import { ModuleScreenHeader } from "../../components/ModuleScreenHeader";
import { RecordFilters } from "../../components/RecordFilters";
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

function DiscoveryScreen() {
  const library = useDiscovery();
  const filters = useRecordFilters();
  const expansion = useExpandableItems();
  const visible = discoveryCatalog.filter(({ moduleId, item }) => filters.matches(item, moduleId));
  return (
    <TrackableModuleLayout
      header={<ModuleScreenHeader title={t("discover.bag.title")} eyebrow={t("space.discoverEyebrow")} tagline={t("space.discoverTagline")} filters={<RecordFilters filters={filters} />} />}
      loading={!library.ready} hasItems loadingState={<StorageLoading label={t("loading.generic", { module: t("menu.discover") })} />} emptyState={null}
    >
      {library.failed ? <p role="alert">{t("toast.storageError")}</p> : visible.map(({ moduleId, item }) => {
        const key = recordKey(moduleId, item.id);
        return <DiscoveryDevotionalCard key={key} moduleId={moduleId} item={item}
          expanded={expansion.expandedIds.has(key)} onToggle={() => expansion.toggleExpanded(key)}
          added={library.includes(moduleId, item.id, "virds")} liked={library.includes(moduleId, item.id, "favorites")}
          onAdd={() => void library.toggle(moduleId, item, "virds")} onLike={() => void library.toggle(moduleId, item, "favorites")} />;
      })}
      {!library.failed && !visible.length ? <p className="filter-empty">{t("filter.empty")}</p> : null}
    </TrackableModuleLayout>
  );
}
