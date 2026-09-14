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
  itemLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmationModal
      title={itemLabel ? t("delete.genericTitle", { item: itemLabel }) : t("delete.title")}
      body={<p>{itemLabel ? t("delete.genericBody", { title }) : t("delete.body", { title })}</p>}
      cancelLabel={t("action.cancel")}
      confirmLabel={t("delete.confirm")}
      tone="danger"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
