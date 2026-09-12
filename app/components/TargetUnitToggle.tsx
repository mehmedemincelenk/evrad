import { t } from "../core/i18n";
import type { TargetUnit } from "../core/types";

const units: TargetUnit[] = ["count", "page", "minute", "hour"];

export function TargetUnitToggle({
  value,
  onChange,
}: {
  value: TargetUnit;
  onChange: (unit: TargetUnit) => void;
}) {
  return (
    <div className="target-unit-toggle" role="group" aria-label={t("editor.targetUnit")}>
      {units.map((unit) => (
        <button
          key={unit}
          type="button"
          className={value === unit ? "is-selected" : ""}
          aria-pressed={value === unit}
          onClick={() => onChange(unit)}
        >
          {t(`targetUnit.${unit}`)}
        </button>
      ))}
    </div>
  );
}
