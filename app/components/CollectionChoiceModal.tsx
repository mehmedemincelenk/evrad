"use client";

import { useEffect, useId, useRef, useState } from "react";
import { t } from "../core/i18n";

export type CollectionChoice = "bag" | "virds" | "both";

export function CollectionChoiceModal({
  title,
  body,
  choices,
  onCancel,
  onChoose,
}: {
  title: string;
  body: string;
  choices: CollectionChoice[];
  onCancel: () => void;
  onChoose: (choice: CollectionChoice) => void | Promise<void>;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.classList.add("confirmation-open");
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onCancel();
      if (event.key !== "Tab" || !panelRef.current) return;
      const buttons = Array.from(panelRef.current.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
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
  }, [onCancel, pending]);

  const choose = async (choice: CollectionChoice) => {
    if (pending) return;
    setPending(true);
    try {
      await onChoose(choice);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="confirmation-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !pending && onCancel()}>
      <div className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-busy={pending} ref={panelRef}>
        <h2 id={titleId}>{title}</h2>
        <div className="confirmation-copy"><p>{body}</p></div>
        <div className="collection-choice-actions">
          {choices.map((choice) => (
            <button key={choice} className="secondary-button" type="button" disabled={pending} onClick={() => void choose(choice)}>
              {t(`collection.${choice}`)}
            </button>
          ))}
          <button className="secondary-button" type="button" disabled={pending} onClick={onCancel}>{t("action.cancel")}</button>
        </div>
      </div>
    </div>
  );
}
