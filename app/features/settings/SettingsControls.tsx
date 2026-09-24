import { useId } from "react";

export function SettingsSlider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void;
}) {
  const id = useId();
  return <div className="settings-flat-row">
    <label htmlFor={id} className="settings-flat-label">{label}</label>
    <div className="settings-slider-wrap">
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(event) => onChange(Number(event.target.value))} className="settings-slider" />
    </div>
  </div>;
}

export function SettingsSwitch({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  const id = useId();
  return <div className="settings-flat-row">
    <span id={id} className="settings-flat-label">{label}</span>
    <button type="button" role="switch" aria-checked={checked} aria-labelledby={id}
      className={`settings-toggle-switch${checked ? " is-active" : ""}`} onClick={onToggle}>
      <span className="toggle-thumb" aria-hidden="true" />
    </button>
  </div>;
}
