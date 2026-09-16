import type { DevotionalItem, DevotionalModuleId } from "../../core/types";
import { DailyTrackableCard } from "./DailyTrackableCard";

export function DailySelectionSection({ title, items, kind, moduleId, completeIds, expandedIds, onToggleComplete, onToggleExpanded }: {
  title: string;
  items: DevotionalItem[];
  kind: "dhikr" | "prayer" | "surah" | "poem";
  moduleId: DevotionalModuleId;
  completeIds: Set<string>;
  expandedIds: Set<string>;
  onToggleComplete: (moduleId: DevotionalModuleId, itemId: string) => void;
  onToggleExpanded: (key: string) => void;
}) {
  if (!items.length) return null;
  return (
    <section className={`daily-selection-section is-${kind}`}>
      <h2>{title}</h2>
      <div className="daily-selection-items">
        {items.map((item) => {
          const key = `${moduleId}:${item.id}`;
          return <DailyTrackableCard key={key} item={item} moduleId={moduleId} complete={completeIds.has(item.id)} expanded={expandedIds.has(key)} onToggleComplete={() => onToggleComplete(moduleId, item.id)} onToggleExpanded={() => onToggleExpanded(key)} />;
        })}
      </div>
    </section>
  );
}
