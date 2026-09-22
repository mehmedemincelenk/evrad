"use client";

import { useState, type FormEvent } from "react";
import { EntityEditorPage } from "../../components/EntityEditorPage";
import { TargetFields } from "../../components/TargetFields";
import { t } from "../../core/i18n";
import { validateTarget } from "../../core/target";
import type { BookDraft, BookItem } from "../../core/types";

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
  const [draft, setDraft] = useState(() => createDraft(item));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const update = (patch: Partial<BookDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return setError(t("editor.bookTitleError"));
    const targetError = validateTarget(draft);
    if (targetError) return setError(t(targetError));
    setSaving(true);
    try {
      await onSave({ ...draft, title: draft.title.trim(), author: draft.author.trim(), details: draft.details.trim(), targetCount: draft.targetCount.trim(), targetUnitLabel: draft.targetUnitLabel.trim() });
    } catch {
      setSaving(false);
    }
  };
  return (
    <EntityEditorPage title={t(item ? "editor.editGeneric" : "editor.addGeneric", { item: t("module.books.singular") })} subtitle={t("editor.bookSubtitle")} closeLabel={t("editor.close")} onClose={onClose}>
      <form className="entity-form" onSubmit={(event) => void submit(event)} noValidate aria-busy={saving}>
        <label className="field-group"><span>{t("editor.bookTitle")}</span><input value={draft.title} onChange={(event) => update({ title: event.target.value })} placeholder={t("editor.bookTitlePlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.bookAuthor")}</span><input value={draft.author} onChange={(event) => update({ author: event.target.value })} placeholder={t("editor.bookAuthorPlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.bookDetails")}</span><textarea value={draft.details} onChange={(event) => update({ details: event.target.value })} placeholder={t("editor.bookDetailsPlaceholder")} rows={5} /></label>
        <TargetFields value={draft} showHint onChange={update} />
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <footer className="form-actions"><button className="secondary-button" type="button" onClick={onClose} disabled={saving}>{t("action.cancel")}</button><button className="primary-button" type="submit" disabled={saving}>{t("action.save")}</button></footer>
      </form>
    </EntityEditorPage>
  );
}
