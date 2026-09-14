import type { TranslationKey } from "./i18n";
import type { TargetDraft } from "./types";

const POSITIVE_INTEGER = /^[1-9]\d*$/;

export function validateTarget(draft: TargetDraft): TranslationKey | null {
  const count = draft.targetCount.trim();
  if (count && !POSITIVE_INTEGER.test(count)) return "editor.targetError";
  if (count && draft.targetUnit === "custom" && !draft.targetUnitLabel.trim()) return "editor.targetUnitError";
  return null;
}

export function targetFromDraft(draft: TargetDraft) {
  return {
    targetCount: draft.targetCount ? Number(draft.targetCount) : null,
    targetUnit: draft.targetUnit,
    targetUnitLabel: draft.targetUnit === "custom" ? draft.targetUnitLabel : null,
  };
}
