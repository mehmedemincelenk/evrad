"use client";

import { useMemo, useState, type FormEvent } from "react";
import { EntityEditorShell } from "../../components/EntityEditorShell";
import { t } from "../../core/i18n";
import type { Dhikr, DhikrDraft } from "../../core/types";

const emptyDraft: DhikrDraft = {
  name: "",
  arabic: "",
  translation: "",
  details: "",
  targetCount: "",
  listDisplay: "arabic",
};

function draftFromDhikr(dhikr: Dhikr | null): DhikrDraft {
  if (!dhikr) return emptyDraft;
  return {
    name: dhikr.name ?? "",
    arabic: dhikr.arabic ?? "",
    translation: dhikr.translation ?? "",
    details: dhikr.details ?? "",
    targetCount: dhikr.targetCount?.toString() ?? "",
    listDisplay: dhikr.listDisplay,
  };
}

export function DhikrEditor({
  dhikr,
  onClose,
  onSave,
}: {
  dhikr: Dhikr | null;
  onClose: () => void;
  onSave: (draft: DhikrDraft) => void;
}) {
  const initialDraft = useMemo(() => draftFromDhikr(dhikr), [dhikr]);
  const [draft, setDraft] = useState(initialDraft);
  const [error, setError] = useState<string | null>(null);
  const canChooseName = draft.name.trim().length > 0 && draft.arabic.trim().length > 0;

  const update = <Key extends keyof DhikrDraft>(key: Key, value: DhikrDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const hasName = draft.name.trim().length > 0;
    const hasArabic = draft.arabic.trim().length > 0;
    if (!hasName && !hasArabic) {
      setError(t("editor.identityError"));
      return;
    }
    if (draft.targetCount.trim() && !/^[1-9]\d*$/.test(draft.targetCount.trim())) {
      setError(t("editor.targetError"));
      return;
    }
    onSave({
      ...draft,
      name: draft.name.trim(),
      arabic: draft.arabic.trim(),
      translation: draft.translation.trim(),
      details: draft.details.trim(),
      targetCount: draft.targetCount.trim(),
      listDisplay: !hasArabic ? "name" : !hasName ? "arabic" : draft.listDisplay,
    });
  };

  return (
    <EntityEditorShell
      title={t(dhikr ? "editor.editTitle" : "editor.addTitle")}
      subtitle={t("editor.subtitle")}
      closeLabel={t("editor.close")}
      onClose={onClose}
    >
      <form className="dhikr-form" onSubmit={submit} noValidate>
        <label className="field-group">
          <span>{t("editor.name")}</span>
          <input
            value={draft.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder={t("editor.namePlaceholder")}
            autoComplete="off"
          />
        </label>

        <label className="field-group">
          <span>{t("editor.arabic")}</span>
          <textarea
            className="arabic-field"
            value={draft.arabic}
            onChange={(event) => update("arabic", event.target.value)}
            placeholder={t("editor.arabicPlaceholder")}
            lang="ar"
            dir="rtl"
            rows={4}
          />
        </label>

        <label className="field-group">
          <span>{t("editor.translation")}</span>
          <textarea
            value={draft.translation}
            onChange={(event) => update("translation", event.target.value)}
            placeholder={t("editor.translationPlaceholder")}
            rows={3}
          />
        </label>

        <label className="field-group">
          <span>{t("editor.details")}</span>
          <textarea
            value={draft.details}
            onChange={(event) => update("details", event.target.value)}
            placeholder={t("editor.detailsPlaceholder")}
            rows={5}
          />
        </label>

        <label className="field-group target-field">
          <span>{t("editor.target")}</span>
          <input
            value={draft.targetCount}
            onChange={(event) => update("targetCount", event.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="∞"
          />
          <small>{t("editor.targetHint")}</small>
        </label>

        {canChooseName ? (
          <label className="choice-row">
            <input
              type="checkbox"
              checked={draft.listDisplay === "name"}
              onChange={(event) => update("listDisplay", event.target.checked ? "name" : "arabic")}
            />
            <span className="choice-control" aria-hidden="true"><i /></span>
            <span>{t("editor.showName")}</span>
          </label>
        ) : null}

        {error ? <p className="form-error" role="alert">{error}</p> : null}

        <footer className="form-actions">
          <button className="secondary-button" type="button" onClick={onClose}>{t("action.cancel")}</button>
          <button className="primary-button" type="submit">{t("action.save")}</button>
        </footer>
      </form>
    </EntityEditorShell>
  );
}
