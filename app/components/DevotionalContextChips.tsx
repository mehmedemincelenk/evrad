import { t } from "../core/i18n";
import type { DevotionalContext } from "../core/types";

export const devotionalContexts: DevotionalContext[] = [
  "general",
  "afterPrayer",
  "beforePrayer",
  "morning",
  "gratitude",
  "forgiveness",
  "protection",
  "relief",
];

export function DevotionalContextChips({
  selected,
  onToggle,
  label,
}: {
  selected: readonly DevotionalContext[];
  onToggle: (context: DevotionalContext) => void;
  label: string;
}) {
  return (
    <div className="context-chips" role="group" aria-label={label}>
      {devotionalContexts.map((context) => (
        <button
          key={context}
          type="button"
          className={`context-chip is-${context}${selected.includes(context) ? " is-selected" : ""}`}
          aria-pressed={selected.includes(context)}
          onClick={() => onToggle(context)}
        >
          {t(`context.${context}`)}
        </button>
      ))}
    </div>
  );
}
