"use client";

import { useEffect, useRef } from "react";

// Focus and keyboard lifecycle shared by both confirmation dialogs.
export function useDialogFocus(onCancel: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(onCancel);
  useEffect(() => { cancelRef.current = onCancel; }, [onCancel]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const wasLocked = document.body.classList.contains("confirmation-open");
    document.body.classList.add("confirmation-open");
    panelRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancelRef.current();
      if (event.key !== "Tab" || !panelRef.current) return;
      const buttons = Array.from(panelRef.current.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
      const first = buttons[0];
      const last = buttons.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      if (!wasLocked) document.body.classList.remove("confirmation-open");
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return panelRef;
}
