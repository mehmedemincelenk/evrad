"use client";

import { EntityEditorPage } from "../../components/EntityEditorPage";
import { TargetFields } from "../../components/TargetFields";
import { t } from "../../core/i18n";
import { validateTarget } from "../../core/target";
import type { BookDraft, BookItem } from "../../core/types";

import { useEditorForm } from "../../hooks/useEditorForm";
import { FormActions } from "../../components/FormActions";

const emptyDraft: BookDraft = { title: "", author: "", details: "", targetCount: "", targetUnit: "custom", targetUnitLabel: "sayfa" };

function createDraft(item: BookItem | null): BookDraft {
  if (!item) return emptyDraft;
  return {
    title: item.title,
    author: item.author ?? "",
    details: item.details ?? "",
    targetCount: item.targetCount?.toString() ?? "",
    targetUnit: item.targetUnit,
    targetUnitLabel: item.targetUnitLabel ?? "",
  };
}

export function BookEditor({ item, onClose, onSave }: { item: BookItem | null; onClose: () => void; onSave: (draft: BookDraft) => Promise<void> }) {
  const { draft, update, error, saving, submit } = useEditorForm(createDraft(item),
    (value) => !value.title ? "editor.bookTitleError" : validateTarget(value), onSave);
  return (
    <EntityEditorPage title={t(item ? "editor.editGeneric" : "editor.addGeneric", { item: t("module.books.singular") })} subtitle={t("editor.bookSubtitle")} closeLabel={t("editor.close")} onClose={onClose} saving={saving}>
      {(close) => <form className="entity-form" onSubmit={(event) => submit(event, close)} noValidate aria-busy={saving}>
        <label className="field-group"><span>{t("editor.bookTitle")}</span><input data-initial-focus value={draft.title} onChange={(event) => update({ title: event.target.value })} placeholder={t("editor.bookTitlePlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.bookAuthor")}</span><input value={draft.author} onChange={(event) => update({ author: event.target.value })} placeholder={t("editor.bookAuthorPlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.bookDetails")}</span><textarea value={draft.details} onChange={(event) => update({ details: event.target.value })} placeholder={t("editor.bookDetailsPlaceholder")} rows={5} /></label>
        <TargetFields value={draft} showHint onChange={update} />
        <FormActions saving={saving} error={error} onClose={close} />
      </form>}
    </EntityEditorPage>
  );
}
