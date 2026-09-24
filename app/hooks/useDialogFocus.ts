"use client";

import { useEffect, useEffectEvent, useRef } from "react";

// Native dialogs handle focus trapping/restoration and inert background. Their
// top layer also escapes the transformed swipe pages and nested overlays.
export function useDialogFocus(onCancel: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancel = useEffectEvent(onCancel);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
    const onCancel = (event: Event) => { event.preventDefault(); cancel(); };
    const onBackdrop = (event: MouseEvent) => { if (event.target === dialog) cancel(); };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onBackdrop);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onBackdrop);
      dialog.close();
    };
  }, []);
  return ref;
}
