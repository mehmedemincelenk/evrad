"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function EntityEditorShell({
  title,
  subtitle,
  closeLabel,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    document.body.classList.add("modal-open");
    const focusable = panel?.querySelector<HTMLElement>("input, textarea, button, [tabindex]:not([tabindex='-1'])");
    focusable?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>("input, textarea, button, [tabindex]:not([tabindex='-1'])"))
        .filter((item) => !item.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="editor-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title" ref={panelRef}>
        <header className="editor-heading">
          <div>
            <p className="eyebrow">{title}</p>
            {subtitle ? <p className="editor-subtitle">{subtitle}</p> : null}
          </div>
          <button className="round-icon-button" type="button" onClick={onClose} aria-label={closeLabel}>×</button>
        </header>
        {children}
      </div>
    </div>
  );
}
