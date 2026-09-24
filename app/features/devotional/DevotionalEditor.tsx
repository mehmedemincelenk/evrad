"use client";

import { type ReactNode } from "react";
import { EntityEditorPage } from "../../components/EntityEditorPage";
import { TargetFields } from "../../components/TargetFields";
import { t } from "../../core/i18n";
import { validateTarget } from "../../core/target";
import type { DevotionalDraft, DevotionalItem } from "../../core/types";
import { DevotionalContextChips } from "../../components/DevotionalContextChips";
import { RecordCategoryChips } from "../../components/RecordCategoryChips";
import type { BagCategory } from "../../core/record-categories";

import { toggleSelection } from "../../core/record-filters";
import { devotionalDraft } from "../../core/devotional-draft";
import { useEditorForm } from "../../hooks/useEditorForm";
import { FormActions } from "../../components/FormActions";

export function DevotionalEditor({
  item, itemLabel, onClose, onSave, beforeFields, defaultCategory, initialDraft,
}: {
  item: DevotionalItem | null;
  itemLabel: string;
  onClose: () => void;
  onSave: (draft: DevotionalDraft) => Promise<void>;
  beforeFields?: ReactNode;
  defaultCategory?: BagCategory;
  initialDraft?: DevotionalDraft;
}) {
  const { draft, update, error, saving, submit } = useEditorForm(
    initialDraft ?? devotionalDraft(item, defaultCategory),
    (value) => !value.name && !value.arabic ? "editor.identityError" : validateTarget(value),
    (value) => onSave({ ...value, listDisplay: !value.arabic ? "name" : !value.name ? "arabic" : value.listDisplay }),
  );
  const displayChoice = !draft.arabic.trim() ? "name" : !draft.name.trim() ? "arabic" : draft.listDisplay;

  return (
    <EntityEditorPage
      title={t(item?.id ? "editor.editGeneric" : "editor.addGeneric", { item: itemLabel })}
      closeLabel={t("editor.close")}
      onClose={onClose}
      saving={saving}
    >
      {(close) => <form className="entity-form" onSubmit={(event) => submit(event, close)} noValidate aria-busy={saving}>
        {beforeFields}
        <label className="field-group"><span>{t("editor.name")}</span><input data-initial-focus value={draft.name} onChange={(event) => update({ name: event.target.value })} placeholder={t("editor.namePlaceholder")} autoComplete="off" /></label>
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
          {defaultCategory ? <RecordCategoryChips selected={draft.bagCategories ?? []} onToggle={(category) => update({ bagCategories: toggleSelection(draft.bagCategories ?? [], category) })} /> : null}
          <DevotionalContextChips
            selected={draft.contexts}
            label={t("editor.contexts")}
            onToggle={(context) => update({ contexts: toggleSelection(draft.contexts, context) })}
          />
          </div>
          <small>{t("editor.contextsHint")}</small>
        </section>
        <TargetFields value={draft} showHint onChange={update} />
        <FormActions saving={saving} error={error} onClose={close} />
      </form>}
    </EntityEditorPage>
  );
}
