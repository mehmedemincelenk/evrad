import { t } from "../core/i18n";
import type { TargetDraft } from "../core/types";

export function TargetFields({
  value,
  showHint = false,
  onChange,
}: {
  value: TargetDraft;
  showHint?: boolean;
  onChange: (patch: Partial<TargetDraft>) => void;
}) {
  return (
    <section className="field-group target-field">
      <span>{t("editor.target")}</span>
      <div className="target-config-row">
        <label><span>{t("editor.targetNumber")}</span><input
          value={value.targetCount}
          onChange={(event) => onChange({ targetCount: event.target.value })}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={t("editor.targetNumberPlaceholder")}
        /></label>
        <label><span>{t("editor.targetUnit")}</span><input
          value={value.targetUnitLabel}
          onChange={(event) => onChange({ targetUnit: event.target.value.trim() ? "custom" : "count", targetUnitLabel: event.target.value })}
          placeholder={t("targetUnit.customPlaceholder")}
        /></label>
      </div>
      {showHint ? <small>{t("editor.targetHint")}</small> : null}
    </section>
  );
}
