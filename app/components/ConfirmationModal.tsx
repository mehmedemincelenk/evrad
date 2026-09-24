import type { ReactNode } from "react";
import { ActionDialog, type DialogAction } from "./ActionDialog";

export function ConfirmationModal({ title, body, cancelLabel, confirmLabel, tone = "default", onCancel, onConfirm }: {
  title: string;
  body: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  tone?: "default" | "danger";
  onCancel: () => void;
  onConfirm: DialogAction;
}) {
  return <ActionDialog title={title} body={body} cancelLabel={cancelLabel} onCancel={onCancel} alert
    actions={[{ label: confirmLabel, tone: tone === "danger" ? "danger" : "primary", run: onConfirm }]} />;
}
