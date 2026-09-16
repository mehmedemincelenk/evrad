import type { DevotionalItem, DevotionalModuleId } from "../../core/types";
import { DailyTrackableCard } from "./DailyTrackableCard";

export function DailySelectionCards({ items, moduleId, completeIds, expandedIds, onToggleComplete, onToggleExpanded }: {
  items: DevotionalItem[];
  moduleId: DevotionalModuleId;
  completeIds: Set<string>;
  expandedIds: Set<string>;
  onToggleComplete: (moduleId: DevotionalModuleId, itemId: string) => void;
  onToggleExpanded: (key: string) => void;
}) {
  return items.map((item) => {
    const key = `${moduleId}:${item.id}`;
    return <DailyTrackableCard key={key} item={item} moduleId={moduleId} complete={completeIds.has(item.id)} expanded={expandedIds.has(key)} onToggleComplete={() => onToggleComplete(moduleId, item.id)} onToggleExpanded={() => onToggleExpanded(key)} />;
  });
}
