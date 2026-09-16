import type { DevotionalTemplate } from "../discovery-types";

export function memorizationTemplate(
  id: string,
  name: string,
  original: string,
  translation: string,
  details: string,
  source: string,
): DevotionalTemplate {
  return {
    id,
    name,
    arabic: original,
    translation,
    details,
    source,
    targetCount: 1,
    targetUnit: "count",
    targetUnitLabel: null,
    listDisplay: "name",
    expandedArabicSize: 1,
    contexts: [],
  };
}
