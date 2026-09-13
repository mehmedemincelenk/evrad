import { t } from "../core/i18n";
import type { TargetUnit } from "../core/types";

export function TargetUnitToggle({
  value,
  customLabel,
  onChange,
  onCustomLabelChange,
}: {
  value: TargetUnit;
  customLabel: string;
  onChange: (unit: TargetUnit) => void;
  onCustomLabelChange: (label: string) => void;
}) {
  return (
    <div className="target-unit-toggle" role="group" aria-label={t("editor.targetUnit")}>
      <button
        type="button"
        className={value === "count" ? "is-selected" : ""}
        aria-pressed={value === "count"}
        onClick={() => onChange("count")}
      >
        {t("targetUnit.count")}
      </button>
      <label className={value === "custom" ? "custom-unit is-selected" : "custom-unit"}>
        <span className="sr-only">{t("targetUnit.custom")}</span>
        <input
          value={customLabel}
          onFocus={() => onChange("custom")}
          onChange={(event) => {
            onChange("custom");
            onCustomLabelChange(event.target.value);
          }}
          placeholder={t("targetUnit.customPlaceholder")}
          maxLength={18}
        />
      </label>
    </div>
  );
}
