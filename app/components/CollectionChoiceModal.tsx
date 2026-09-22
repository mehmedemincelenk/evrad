"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useDialogFocus } from "../hooks/useDialogFocus";
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
  const pendingRef = useRef(false);
  const cancel = useCallback(() => { if (!pendingRef.current) onCancel(); }, [onCancel]);
  const [pending, setPending] = useState(false);

  const panelRef = useDialogFocus(cancel);

  const choose = async (choice: CollectionChoice) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    try {
      await onChoose(choice);
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  return (
    <div className="confirmation-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && cancel()}>
      <div className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-busy={pending} ref={panelRef}>
        <h2 id={titleId}>{title}</h2>
        <div className="confirmation-copy"><p>{body}</p></div>
        <div className="collection-choice-actions">
          {choices.map((choice) => (
            <button key={choice} className="secondary-button" type="button" disabled={pending} onClick={() => void choose(choice)}>
              {t(`collection.${choice}`)}
            </button>
          ))}
          <button className="secondary-button" type="button" disabled={pending} onClick={cancel}>{t("action.cancel")}</button>
        </div>
      </div>
    </div>
  );
}
