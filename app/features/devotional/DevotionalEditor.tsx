"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { EntityEditorPage } from "../../components/EntityEditorPage";
import { TargetFields } from "../../components/TargetFields";
import { t } from "../../core/i18n";
import { validateTarget } from "../../core/target";
import type { DevotionalDraft, DevotionalItem } from "../../core/types";
import { DevotionalContextChips } from "../../components/DevotionalContextChips";
import { RecordCategoryChips } from "../../components/RecordCategoryChips";
import type { BagCategory } from "../../core/record-categories";

const emptyDraft: DevotionalDraft = {
  name: "", arabic: "", translation: "", details: "", source: "", targetCount: "",
  targetUnit: "count", targetUnitLabel: "", listDisplay: "arabic",
  contexts: [],
  bagCategories: [],
};

function createDraft(item: DevotionalItem | null): DevotionalDraft {
  if (!item) return emptyDraft;
  return {
    name: item.name ?? "", arabic: item.arabic ?? "", translation: item.translation ?? "",
    details: item.details ?? "", source: item.source ?? "", targetCount: item.targetCount?.toString() ?? "",
    targetUnit: item.targetUnit, targetUnitLabel: item.targetUnitLabel ?? "", listDisplay: item.listDisplay,
    contexts: item.contexts,
    bagCategories: item.bagCategories ?? [],
  };
}

export function DevotionalEditor({
  item, itemLabel, onClose, onSave, beforeFields, defaultCategory,
}: {
  item: DevotionalItem | null;
  itemLabel: string;
  onClose: () => void;
  onSave: (draft: DevotionalDraft) => Promise<void>;
  beforeFields?: ReactNode;
  defaultCategory?: BagCategory;
}) {
  const [draft, setDraft] = useState(() => ({ ...createDraft(item), bagCategories: item?.bagCategories ?? (defaultCategory ? [defaultCategory] : []) }));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const displayChoice = !draft.arabic.trim() ? "name" : !draft.name.trim() ? "arabic" : draft.listDisplay;
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
        details: draft.details.trim(), source: draft.source.trim(), targetCount: draft.targetCount.trim(), targetUnitLabel: draft.targetUnitLabel.trim(),
        listDisplay: !hasArabic ? "name" : !hasName ? "arabic" : draft.listDisplay,
      });
    } catch {
      setSaving(false);
    }
  };

  return (
    <EntityEditorPage
      title={t(item ? "editor.editGeneric" : "editor.addGeneric", { item: itemLabel })}
      closeLabel={t("editor.close")}
      onClose={onClose}
    >
      <form className="entity-form" onSubmit={(event) => void submit(event)} noValidate aria-busy={saving}>
        {beforeFields}
        <label className="field-group"><span>{t("editor.name")}</span><input value={draft.name} onChange={(event) => update({ name: event.target.value })} placeholder={t("editor.namePlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.arabic")}</span><textarea className="arabic-field" value={draft.arabic} onChange={(event) => update({ arabic: event.target.value })} placeholder={t("editor.arabicPlaceholder")} dir="auto" rows={4} /></label>
        <fieldset className="display-choice">
          <legend>{t("editor.displayQuestion")}</legend>
          <label><input type="radio" name="listDisplay" checked={displayChoice === "name"} disabled={!draft.name.trim()} onChange={() => update({ listDisplay: "name" })} /><span>{t("editor.displayName")}</span></label>
          <label><input type="radio" name="listDisplay" checked={displayChoice === "arabic"} disabled={!draft.arabic.trim()} onChange={() => update({ listDisplay: "arabic" })} /><span>{t("editor.displayOriginal")}</span></label>
        </fieldset>
        <label className="field-group"><span>{t("editor.translation")}</span><textarea value={draft.translation} onChange={(event) => update({ translation: event.target.value })} placeholder={t("editor.translationPlaceholder")} rows={3} /></label>
        <label className="field-group"><span>{t("editor.details")}</span><textarea value={draft.details} onChange={(event) => update({ details: event.target.value })} placeholder={t("editor.detailsPlaceholder")} rows={5} /></label>
        <label className="field-group"><span>{t("editor.source")}</span><input value={draft.source} onChange={(event) => update({ source: event.target.value })} placeholder={t("editor.sourcePlaceholder")} autoComplete="off" /></label>
        <section className="field-group">
          <span>{t("editor.contexts")}</span>
          <div className="editor-category-box">
          {defaultCategory ? <RecordCategoryChips selected={draft.bagCategories ?? []} onToggle={(category) => update({ bagCategories: draft.bagCategories?.includes(category) ? draft.bagCategories.filter((item) => item !== category) : [...(draft.bagCategories ?? []), category] })} /> : null}
          <DevotionalContextChips
            selected={draft.contexts}
            label={t("editor.contexts")}
            onToggle={(context) => update({ contexts: draft.contexts.includes(context) ? draft.contexts.filter((item) => item !== context) : [...draft.contexts, context] })}
          />
          </div>
          <small>{t("editor.contextsHint")}</small>
        </section>
        <TargetFields value={draft} showHint onChange={update} />
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <footer className="form-actions"><button className="secondary-button" type="button" onClick={onClose} disabled={saving}>{t("action.cancel")}</button><button className="primary-button" type="submit" disabled={saving}>{t("action.save")}</button></footer>
      </form>
    </EntityEditorPage>
  );
}
