"use client";

import { ConfirmationModal } from "./ConfirmationModal";
import { t } from "../core/i18n";

export function DeleteConfirmation({
  title,
  itemLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  itemLabel: string;
  onCancel: () => void;
  onConfirm: () => Promise<boolean>;
}) {
  return (
    <ConfirmationModal
      title={t("delete.genericTitle", { item: itemLabel })}
      body={<p>{t("delete.genericBody", { title })}</p>}
      cancelLabel={t("action.cancel")}
      confirmLabel={t("delete.confirm")}
      tone="danger"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
