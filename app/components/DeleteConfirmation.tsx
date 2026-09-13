"use client";

import { ConfirmationModal } from "./ConfirmationModal";
import { t } from "../core/i18n";

export function DeleteConfirmation({ title, onCancel, onConfirm }: { title: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <ConfirmationModal
      title={t("delete.title")}
      body={<p>{t("delete.body", { title })}</p>}
      cancelLabel={t("action.cancel")}
      confirmLabel={t("delete.confirm")}
      tone="danger"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
