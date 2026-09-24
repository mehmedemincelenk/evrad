"use client";

import { useId, useState, type ReactNode } from "react";
import { t } from "../core/i18n";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { Dialog } from "./Dialog";

export type DialogAction = () => void | boolean | Promise<void | boolean>;

export function ActionDialog({ title, body, actions, cancelLabel, onCancel, alert = false }: {
  title: string;
  body: ReactNode;
  actions: { label: string; tone?: "primary" | "danger"; run: DialogAction }[];
  cancelLabel: string;
  onCancel: () => void;
  alert?: boolean;
}) {
  const titleId = useId();
  const { pending, run } = useAsyncAction();
  const [failed, setFailed] = useState(false);
  return <Dialog labelledBy={titleId} onClose={onCancel} busy={pending} alert={alert}>
    {(close) => <div className="confirmation-modal">
      <h2 id={titleId}>{title}</h2>
      <div className="confirmation-copy">{body}</div>
      {failed ? <p className="form-error" role="alert">{t("toast.storageError")}</p> : null}
      <div className={alert ? "confirmation-actions" : "collection-choice-actions"}>
        {alert ? <button className="secondary-button" type="button" disabled={pending} onClick={close}>{cancelLabel}</button> : null}
        {actions.map((action) => <button key={action.label} className={`${action.tone ?? "secondary"}-button`} type="button" disabled={pending}
          onClick={() => void run(async () => {
            setFailed(false);
            if (await action.run() === false) setFailed(true); else close();
          }).catch(() => setFailed(true))}>{action.label}</button>)}
        {!alert ? <button className="secondary-button" type="button" disabled={pending} onClick={close}>{cancelLabel}</button> : null}
      </div>
    </div>}
  </Dialog>;
}
