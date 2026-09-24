"use client";

import { useState, type ReactNode } from "react";
import { useDialogFocus } from "../hooks/useDialogFocus";

export function Dialog({ children, onClose, busy = false, labelledBy, variant = "confirmation", alert = false }: {
  children: (close: () => void) => ReactNode;
  onClose: () => void;
  busy?: boolean;
  labelledBy: string;
  variant?: "confirmation" | "quick-add" | "editor";
  alert?: boolean;
}) {
  const [closing, setClosing] = useState(false);
  const dismiss = () => setClosing(true);
  const cancel = () => { if (!busy) dismiss(); };
  const ref = useDialogFocus(cancel);
  return (
    <dialog ref={ref} className={`dialog-layer ${variant}-layer`} data-closing={closing}
      role={alert ? "alertdialog" : "dialog"} aria-modal="true" aria-labelledby={labelledBy} aria-busy={busy}
      onAnimationEnd={(event) => { if (closing && event.target === event.currentTarget) onClose(); }}>
      <div className="dialog-surface" inert={closing}>{children(dismiss)}</div>
    </dialog>
  );
}
