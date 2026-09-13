"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function EntityEditorPage({
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
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("editor-open");
    pageRef.current?.querySelector<HTMLElement>("input, textarea, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("editor-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <section className="editor-page" aria-labelledby="editor-title" ref={pageRef}>
      <header className="editor-heading">
        <div>
          <h2 id="editor-title">{title}</h2>
          {subtitle ? <p className="editor-subtitle">{subtitle}</p> : null}
        </div>
        <button className="round-icon-button" type="button" onClick={onClose} aria-label={closeLabel}>×</button>
      </header>
      {children}
    </section>
  );
}
