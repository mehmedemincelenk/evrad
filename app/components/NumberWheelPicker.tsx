"use client";

import { useEffect, useMemo, useRef } from "react";
import { t } from "../core/i18n";

const ITEM_HEIGHT = 38;
const DEFAULT_MAX = 1000;

export function NumberWheelPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const numericValue = /^\d+$/.test(value) ? Number(value) : 0;
  const max = Math.max(DEFAULT_MAX, numericValue + 100);
  const values = useMemo(() => Array.from({ length: max + 1 }, (_, index) => index), [max]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const target = numericValue * ITEM_HEIGHT;
    if (Math.abs(scroller.scrollTop - target) > ITEM_HEIGHT / 2) scroller.scrollTop = target;
  }, [numericValue]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const commitNearest = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const next = Math.max(0, Math.min(max, Math.round(scroller.scrollTop / ITEM_HEIGHT)));
    onChange(next === 0 ? "" : String(next));
  };

  return (
    <div
      className="number-wheel"
      ref={scrollerRef}
      role="listbox"
      aria-label={t("editor.target")}
      aria-activedescendant={`target-number-${numericValue}`}
      tabIndex={0}
      onScroll={() => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(commitNearest);
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        const next = Math.max(0, numericValue + (event.key === "ArrowDown" ? 1 : -1));
        onChange(next === 0 ? "" : String(next));
      }}
    >
      {values.map((number) => (
        <button
          id={`target-number-${number}`}
          key={number}
          type="button"
          role="option"
          aria-selected={number === numericValue}
          className={number === numericValue ? "is-selected" : ""}
          onClick={() => onChange(number === 0 ? "" : String(number))}
        >
          {number === 0 ? "∞" : number}
        </button>
      ))}
    </div>
  );
}
