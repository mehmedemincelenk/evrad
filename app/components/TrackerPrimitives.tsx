import type { CSSProperties, KeyboardEventHandler, PointerEventHandler, ReactNode } from "react";
import { t } from "../core/i18n";
import type { TargetUnit } from "../core/types";

export interface SortHandleHandlers {
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
}

export function TrackableCardShell({
  id,
  complete,
  expanded,
  dragging,
  dragOffsetY,
  summary,
  dragHandle,
  completion,
  children,
}: {
  id: string;
  complete: boolean;
  expanded: boolean;
  dragging: boolean;
  dragOffsetY: number;
  summary: ReactNode;
  dragHandle: ReactNode;
  completion: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article
      className={`trackable-card${complete ? " is-complete" : ""}${expanded ? " is-expanded" : ""}${dragging ? " is-dragging" : ""}`}
      data-card-id={id}
      style={{ "--drag-offset-y": `${dragOffsetY}px` } as CSSProperties}
    >
      <div className="card-collapsed-row">
        {dragHandle}
        {summary}
        {completion}
      </div>
      {expanded ? children : null}
    </article>
  );
}

export function CollapsedCardSummary({
  title,
  arabic,
  targetCount,
  targetUnit,
  targetUnitLabel,
  expanded,
  onToggle,
}: {
  title: string;
  arabic: boolean;
  targetCount: number | null;
  targetUnit: TargetUnit;
  targetUnitLabel: string | null;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="card-main"
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={t(expanded ? "card.close" : "card.open", { title })}
    >
      <TargetBadge count={targetCount} unit={targetUnit} unitLabel={targetUnitLabel} />
      <span className={arabic ? "arabic-preview" : "name-preview"} lang={arabic ? "ar" : "tr"} dir={arabic ? "rtl" : "ltr"}>
        {title}
      </span>
    </button>
  );
}

export function TargetBadge({ count, unit, unitLabel }: { count: number | null; unit: TargetUnit; unitLabel: string | null }) {
  if (count === null) {
    return (
      <span className="target-preview infinity-target" aria-label={t("card.infinityLabel")} title={t("card.infinityLabel")}>
        {t("card.infinity")}
      </span>
    );
  }
  return (
    <span className="target-preview">
      {unit === "custom" && unitLabel ? t("card.customTarget", { count, unit: unitLabel }) : t("card.target", { count })}
    </span>
  );
}

export function CompletionLight({
  title,
  complete,
  onToggle,
}: {
  title: string;
  complete: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="completion-light"
      type="button"
      onClick={onToggle}
      aria-label={t(complete ? "card.undoComplete" : "card.complete", { title })}
      aria-pressed={complete}
    >
      <span className="completion-core" aria-hidden="true">
        <i />
      </span>
    </button>
  );
}

export function SortHandle({
  sortId,
  label,
  onPointerDown,
  onKeyDown,
}: {
  sortId: string;
  label: string;
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className="drag-handle"
      type="button"
      data-sort-id={sortId}
      aria-label={label}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <i />
      <i />
      <i />
    </button>
  );
}

export function ExpandableCardContent({ children }: { children: ReactNode }) {
  return <div className="card-expanded-content">{children}</div>;
}

export function DetailBlock({
  label,
  children,
  className = "",
  style,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section className={`detail-block ${className}`}>
      <p className="detail-label">{label}</p>
      <div className="detail-value" style={style}>{children}</div>
    </section>
  );
}
