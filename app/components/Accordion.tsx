"use client";

import { useState, type ReactNode } from "react";

export function Accordion({ open, className = "", children }: { open: boolean; className?: string; children: ReactNode }) {
  const [visited, setVisited] = useState(open);
  if (open && !visited) setVisited(true);
  return <div className={`accordion ${className}`} data-open={open} aria-hidden={!open} inert={!open}>
    <div className="accordion-inner">{visited ? children : null}</div>
  </div>;
}
