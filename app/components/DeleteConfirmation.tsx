"use client";

import { EntityEditorShell } from "./EntityEditorShell";
import { t } from "../core/i18n";

export function DeleteConfirmation({ title, onCancel, onConfirm }: { title: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <EntityEditorShell title={t("delete.title")} closeLabel={t("delete.close")} onClose={onCancel}>
      <div className="confirmation-content">
        <p>{t("delete.body", { title })}</p>
        <div className="confirmation-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>{t("action.cancel")}</button>
          <button className="danger-button" type="button" onClick={onConfirm}>{t("delete.confirm")}</button>
        </div>
      </div>
    </EntityEditorShell>
  );
}
