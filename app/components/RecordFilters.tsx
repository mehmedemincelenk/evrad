import { t } from "../core/i18n";
import { RecordCategoryChips } from "./RecordCategoryChips";
import { DevotionalContextChips } from "./DevotionalContextChips";
import type { useRecordFilters } from "../hooks/useRecordFilters";

export function RecordFilters({ filters }: { filters: ReturnType<typeof useRecordFilters> }) {
  return (
    <div className="bag-toolbar">
      <RecordCategoryChips selected={filters.categories} onToggle={filters.toggleCategory} />
      <DevotionalContextChips selected={filters.contexts} onToggle={filters.toggleContext} label={t("filter.contexts")} />
    </div>
  );
}
