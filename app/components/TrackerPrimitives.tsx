import type { CSSProperties, KeyboardEventHandler, PointerEventHandler, ReactNode } from "react";
import { t } from "../core/i18n";

export function TrackableCardShell({
  id,
  complete,
  expanded,
  dragging,
  summary,
  dragHandle,
  completion,
  children,
}: {
  id: string;
  complete: boolean;
  expanded: boolean;
  dragging: boolean;
  summary: ReactNode;
  dragHandle: ReactNode;
  completion: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article
      className={`dhikr-card${complete ? " is-complete" : ""}${expanded ? " is-expanded" : ""}${dragging ? " is-dragging" : ""}`}
      data-card-id={id}
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
  expanded,
  onToggle,
}: {
  title: string;
  arabic: boolean;
  targetCount: number | null;
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
      <span className={arabic ? "arabic-preview" : "name-preview"} lang={arabic ? "ar" : "tr"} dir={arabic ? "rtl" : "ltr"}>
        {title}
      </span>
      <TargetBadge count={targetCount} />
    </button>
  );
}

export function TargetBadge({ count }: { count: number | null }) {
  if (count === null) {
    return (
      <span className="target-preview infinity-target" aria-label={t("card.infinityLabel")} title={t("card.infinityLabel")}>
        {t("card.infinity")}
      </span>
    );
  }
  return <span className="target-preview">{t("card.target", { count })}</span>;
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
  label,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: {
  label: string;
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onPointerMove: PointerEventHandler<HTMLButtonElement>;
  onPointerUp: PointerEventHandler<HTMLButtonElement>;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className="drag-handle"
      type="button"
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
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
