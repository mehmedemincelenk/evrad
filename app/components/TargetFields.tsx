import { t } from "../core/i18n";
import type { TargetDraft } from "../core/types";
import { TargetUnitToggle } from "./TargetUnitToggle";

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
        <input
          className="target-number-input"
          value={value.targetCount}
          onChange={(event) => onChange({ targetCount: event.target.value })}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="∞"
          aria-label={t("editor.target")}
        />
        <TargetUnitToggle
          value={value.targetUnit}
          customLabel={value.targetUnitLabel}
          onChange={(targetUnit) => onChange({ targetUnit })}
          onCustomLabelChange={(targetUnitLabel) => onChange({ targetUnit: "custom", targetUnitLabel })}
        />
      </div>
      {showHint ? <small>{t("editor.targetHint")}</small> : null}
    </section>
  );
}
