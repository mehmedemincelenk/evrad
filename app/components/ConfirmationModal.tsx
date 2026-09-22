"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { useDialogFocus } from "../hooks/useDialogFocus";

export function ConfirmationModal({
  title,
  body,
  cancelLabel,
  confirmLabel,
  tone = "default",
  onCancel,
  onConfirm,
}: {
  title: string;
  body: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  tone?: "default" | "danger";
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  const titleId = useId();
  const pendingRef = useRef(false);
  const [pending, setPending] = useState(false);

  const cancel = useCallback(() => {
    if (!pendingRef.current) onCancel();
  }, [onCancel]);

  const confirm = async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    try {
      await onConfirm();
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  const panelRef = useDialogFocus(cancel);

  return (
    <div className="confirmation-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && cancel()}>
      <div className="confirmation-modal" role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-busy={pending} ref={panelRef}>
        <h2 id={titleId}>{title}</h2>
        <div className="confirmation-copy">{body}</div>
        <div className="confirmation-actions">
          <button className="secondary-button" type="button" onClick={cancel} disabled={pending}>{cancelLabel}</button>
          <button className={tone === "danger" ? "danger-button" : "primary-button"} type="button" onClick={() => void confirm()} disabled={pending}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
