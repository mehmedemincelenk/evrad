"use client";

import { useState, type FormEvent } from "react";
import { EntityEditorPage } from "../../components/EntityEditorPage";
import { TargetUnitToggle } from "../../components/TargetUnitToggle";
import { t } from "../../core/i18n";
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

export function BookEditor({ item, onClose, onSave }: { item: BookItem | null; onClose: () => void; onSave: (draft: BookDraft) => void }) {
  const [draft, setDraft] = useState(() => createDraft(item));
  const [error, setError] = useState<string | null>(null);
  const update = <Key extends keyof BookDraft>(key: Key, value: BookDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return setError(t("editor.bookTitleError"));
    if (draft.targetCount.trim() && !/^[1-9]\d*$/.test(draft.targetCount.trim())) return setError(t("editor.targetError"));
    if (draft.targetCount.trim() && draft.targetUnit === "custom" && !draft.targetUnitLabel.trim()) return setError(t("editor.targetUnitError"));
    onSave({ ...draft, title: draft.title.trim(), author: draft.author.trim(), details: draft.details.trim(), targetCount: draft.targetCount.trim(), targetUnitLabel: draft.targetUnitLabel.trim() });
  };
  return (
    <EntityEditorPage title={t(item ? "editor.editGeneric" : "editor.addGeneric", { item: t("module.books.singular") })} subtitle={t("editor.bookSubtitle")} closeLabel={t("editor.close")} onClose={onClose}>
      <form className="entity-form" onSubmit={submit} noValidate>
        <label className="field-group"><span>{t("editor.bookTitle")}</span><input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder={t("editor.bookTitlePlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.bookAuthor")}</span><input value={draft.author} onChange={(event) => update("author", event.target.value)} placeholder={t("editor.bookAuthorPlaceholder")} autoComplete="off" /></label>
        <label className="field-group"><span>{t("editor.bookDetails")}</span><textarea value={draft.details} onChange={(event) => update("details", event.target.value)} placeholder={t("editor.bookDetailsPlaceholder")} rows={5} /></label>
        <section className="field-group target-field">
          <span>{t("editor.target")}</span>
          <div className="target-config-row">
            <input className="target-number-input" value={draft.targetCount} onChange={(event) => update("targetCount", event.target.value)} inputMode="numeric" pattern="[0-9]*" placeholder="∞" aria-label={t("editor.target")} />
            <TargetUnitToggle value={draft.targetUnit} customLabel={draft.targetUnitLabel} onChange={(unit) => update("targetUnit", unit)} onCustomLabelChange={(label) => update("targetUnitLabel", label)} />
          </div>
        </section>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <footer className="form-actions"><button className="secondary-button" type="button" onClick={onClose}>{t("action.cancel")}</button><button className="primary-button" type="submit">{t("action.save")}</button></footer>
      </form>
    </EntityEditorPage>
  );
}
