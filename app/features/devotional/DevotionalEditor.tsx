"use client";

import { useState, type FormEvent } from "react";
import { EntityEditorPage } from "../../components/EntityEditorPage";
import { TargetFields } from "../../components/TargetFields";
import { t } from "../../core/i18n";
import { validateTarget } from "../../core/target";
import type { DevotionalDraft, DevotionalItem } from "../../core/types";
import { DevotionalContextChips } from "./DevotionalContextChips";

const emptyDraft: DevotionalDraft = {
  name: "", arabic: "", translation: "", details: "", targetCount: "",
  targetUnit: "count", targetUnitLabel: "", listDisplay: "arabic",
  contexts: [],
};

function createDraft(item: DevotionalItem | null): DevotionalDraft {
  if (!item) return emptyDraft;
  return {
    name: item.name ?? "", arabic: item.arabic ?? "", translation: item.translation ?? "",
    details: item.details ?? "", targetCount: item.targetCount?.toString() ?? "",
    targetUnit: item.targetUnit, targetUnitLabel: item.targetUnitLabel ?? "", listDisplay: item.listDisplay,
    contexts: item.contexts,
  };
}

export function DevotionalEditor({
  item, itemLabel, onClose, onSave,
}: {
  item: DevotionalItem | null;
  itemLabel: string;
  onClose: () => void;
  onSave: (draft: DevotionalDraft) => Promise<void>;
}) {
  const [draft, setDraft] = useState(() => createDraft(item));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canChooseName = Boolean(draft.name.trim() && draft.arabic.trim());
  const update = (patch: Partial<DevotionalDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const hasName = Boolean(draft.name.trim());
    const hasArabic = Boolean(draft.arabic.trim());
    if (!hasName && !hasArabic) return setError(t("editor.identityError"));
    const targetError = validateTarget(draft);
    if (targetError) return setError(t(targetError));
    setSaving(true);
    try {
      await onSave({
        ...draft,
        name: draft.name.trim(), arabic: draft.arabic.trim(), translation: draft.translation.trim(),
        details: draft.details.trim(), targetCount: draft.targetCount.trim(), targetUnitLabel: draft.targetUnitLabel.trim(),
        listDisplay: !hasArabic ? "name" : !hasName ? "arabic" : draft.listDisplay,
      });
    } catch {
      setSaving(false);
    }
  };

  return (
    <EntityEditorPage
      title={t(item ? "editor.editGeneric" : "editor.addGeneric", { item: itemLabel })}
      subtitle={t("editor.subtitleGeneric")}
      closeLabel={t("editor.close")}
      onClose={onClose}
    >
      <form className="entity-form" onSubmit={(event) => void submit(event)} noValidate aria-busy={saving}>
        <label className="field-group"><span>{t("editor.name")}</span><input value={draft.name} onChange={(event) => update({ name: event.target.value })} placeholder={t("editor.namePlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.arabic")}</span><textarea className="arabic-field" value={draft.arabic} onChange={(event) => update({ arabic: event.target.value })} placeholder={t("editor.arabicPlaceholder")} lang="ar" dir="rtl" rows={4} /></label>
        <label className="field-group"><span>{t("editor.translation")}</span><textarea value={draft.translation} onChange={(event) => update({ translation: event.target.value })} placeholder={t("editor.translationPlaceholder")} rows={3} /></label>
        <label className="field-group"><span>{t("editor.details")}</span><textarea value={draft.details} onChange={(event) => update({ details: event.target.value })} placeholder={t("editor.detailsPlaceholder")} rows={5} /></label>
        <section className="field-group">
          <span>{t("editor.contexts")}</span>
          <DevotionalContextChips
            selected={draft.contexts}
            label={t("editor.contexts")}
            onToggle={(context) => update({ contexts: draft.contexts.includes(context) ? draft.contexts.filter((item) => item !== context) : [...draft.contexts, context] })}
          />
          <small>{t("editor.contextsHint")}</small>
        </section>
        <TargetFields value={draft} showHint onChange={update} />
        {canChooseName ? <label className="choice-row"><input type="checkbox" checked={draft.listDisplay === "name"} onChange={(event) => update({ listDisplay: event.target.checked ? "name" : "arabic" })} /><span className="choice-control" aria-hidden="true"><i /></span><span>{t("editor.showName")}</span></label> : null}
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <footer className="form-actions"><button className="secondary-button" type="button" onClick={onClose} disabled={saving}>{t("action.cancel")}</button><button className="primary-button" type="submit" disabled={saving}>{t("action.save")}</button></footer>
      </form>
    </EntityEditorPage>
  );
}
