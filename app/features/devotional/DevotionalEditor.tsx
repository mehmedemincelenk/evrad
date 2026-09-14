"use client";

import { useMemo, useState, type FormEvent } from "react";
import { EntityEditorPage } from "../../components/EntityEditorPage";
import { TargetUnitToggle } from "../../components/TargetUnitToggle";
import { t } from "../../core/i18n";
import type { DevotionalDraft, DevotionalItem } from "../../core/types";

const emptyDraft: DevotionalDraft = {
  name: "", arabic: "", translation: "", details: "", targetCount: "",
  targetUnit: "count", targetUnitLabel: "", listDisplay: "arabic",
};

function createDraft(item: DevotionalItem | null): DevotionalDraft {
  if (!item) return emptyDraft;
  return {
    name: item.name ?? "", arabic: item.arabic ?? "", translation: item.translation ?? "",
    details: item.details ?? "", targetCount: item.targetCount?.toString() ?? "",
    targetUnit: item.targetUnit, targetUnitLabel: item.targetUnitLabel ?? "", listDisplay: item.listDisplay,
  };
}

export function DevotionalEditor({
  item, itemLabel, onClose, onSave,
}: {
  item: DevotionalItem | null;
  itemLabel: string;
  onClose: () => void;
  onSave: (draft: DevotionalDraft) => void;
}) {
  const initialDraft = useMemo(() => createDraft(item), [item]);
  const [draft, setDraft] = useState(initialDraft);
  const [error, setError] = useState<string | null>(null);
  const canChooseName = Boolean(draft.name.trim() && draft.arabic.trim());
  const update = <Key extends keyof DevotionalDraft>(key: Key, value: DevotionalDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const hasName = Boolean(draft.name.trim());
    const hasArabic = Boolean(draft.arabic.trim());
    if (!hasName && !hasArabic) return setError(t("editor.identityError"));
    if (draft.targetCount.trim() && !/^[1-9]\d*$/.test(draft.targetCount.trim())) return setError(t("editor.targetError"));
    if (draft.targetCount.trim() && draft.targetUnit === "custom" && !draft.targetUnitLabel.trim()) return setError(t("editor.targetUnitError"));
    onSave({
      ...draft,
      name: draft.name.trim(), arabic: draft.arabic.trim(), translation: draft.translation.trim(),
      details: draft.details.trim(), targetCount: draft.targetCount.trim(), targetUnitLabel: draft.targetUnitLabel.trim(),
      listDisplay: !hasArabic ? "name" : !hasName ? "arabic" : draft.listDisplay,
    });
  };

  return (
    <EntityEditorPage
      title={t(item ? "editor.editGeneric" : "editor.addGeneric", { item: itemLabel })}
      subtitle={t("editor.subtitleGeneric")}
      closeLabel={t("editor.close")}
      onClose={onClose}
    >
      <form className="entity-form" onSubmit={submit} noValidate>
        <label className="field-group"><span>{t("editor.name")}</span><input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder={t("editor.namePlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.arabic")}</span><textarea className="arabic-field" value={draft.arabic} onChange={(event) => update("arabic", event.target.value)} placeholder={t("editor.arabicPlaceholder")} lang="ar" dir="rtl" rows={4} /></label>
        <label className="field-group"><span>{t("editor.translation")}</span><textarea value={draft.translation} onChange={(event) => update("translation", event.target.value)} placeholder={t("editor.translationPlaceholder")} rows={3} /></label>
        <label className="field-group"><span>{t("editor.details")}</span><textarea value={draft.details} onChange={(event) => update("details", event.target.value)} placeholder={t("editor.detailsPlaceholder")} rows={5} /></label>
        <section className="field-group target-field">
          <span>{t("editor.target")}</span>
          <div className="target-config-row">
            <input className="target-number-input" value={draft.targetCount} onChange={(event) => update("targetCount", event.target.value)} inputMode="numeric" pattern="[0-9]*" placeholder="∞" aria-label={t("editor.target")} />
            <TargetUnitToggle value={draft.targetUnit} customLabel={draft.targetUnitLabel} onChange={(unit) => update("targetUnit", unit)} onCustomLabelChange={(label) => update("targetUnitLabel", label)} />
          </div>
          <small>{t("editor.targetHint")}</small>
        </section>
        {canChooseName ? <label className="choice-row"><input type="checkbox" checked={draft.listDisplay === "name"} onChange={(event) => update("listDisplay", event.target.checked ? "name" : "arabic")} /><span className="choice-control" aria-hidden="true"><i /></span><span>{t("editor.showName")}</span></label> : null}
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <footer className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>{t("action.cancel")}</button><button className="primary-button" type="submit">{t("action.save")}</button></footer>
      </form>
    </EntityEditorPage>
  );
}
