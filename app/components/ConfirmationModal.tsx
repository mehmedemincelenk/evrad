"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef(false);
  const [pending, setPending] = useState(false);

  const cancel = useCallback(() => {
    if (!pendingRef.current) onCancel();
  }, [onCancel]);

  const confirm = async () => {
    if (pending) return;
    pendingRef.current = true;
    setPending(true);
    try {
      await onConfirm();
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.classList.add("confirmation-open");
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancel();
      if (event.key !== "Tab" || !panelRef.current) return;
      const buttons = Array.from(panelRef.current.querySelectorAll<HTMLButtonElement>("button"));
      const first = buttons[0];
      const last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("confirmation-open");
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [cancel]);

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
