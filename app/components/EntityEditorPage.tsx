"use client";

import { useId, type ReactNode } from "react";
import { Dialog } from "./Dialog";

export function EntityEditorPage({ title, subtitle, closeLabel, onClose, saving, children }: {
  title: string;
  subtitle?: string;
  closeLabel: string;
  onClose: () => void;
  saving?: boolean;
  children: (close: () => void) => ReactNode;
}) {
  const titleId = useId();
  return <Dialog variant="editor" labelledBy={titleId} busy={saving} onClose={onClose}>
    {(close) => <section className="editor-page">
      <header className="editor-heading">
        <div><h2 id={titleId}>{title}</h2>{subtitle ? <p className="editor-subtitle">{subtitle}</p> : null}</div>
        <button className="round-icon-button" type="button" onClick={close} disabled={saving} aria-label={closeLabel}>×</button>
      </header>
      {children(close)}
    </section>}
  </Dialog>;
}
