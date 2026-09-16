import type { CSSProperties, KeyboardEventHandler, PointerEventHandler, ReactNode } from "react";
import { t } from "../core/i18n";
import type { TargetUnit } from "../core/types";
import { PlusMinusIcon } from "./PlusMinusIcon";

export interface SortHandleHandlers {
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
}

export function TrackableCardShell({
  id,
  complete = false,
  expanded,
  dragging = false,
  dragOffsetY = 0,
  summary,
  leading,
  trailing,
  children,
}: {
  id: string;
  complete?: boolean;
  expanded: boolean;
  dragging?: boolean;
  dragOffsetY?: number;
  summary: ReactNode;
  leading: ReactNode;
  trailing: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article
      className={`trackable-card${complete ? " is-complete" : ""}${expanded ? " is-expanded" : ""}${dragging ? " is-dragging" : ""}`}
      data-card-id={id}
      style={{ "--drag-offset-y": `${dragOffsetY}px` } as CSSProperties}
    >
      <div className="card-collapsed-row">
        {leading}
        {summary}
        {trailing}
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
  tags = [],
}: {
  title: string;
  arabic: boolean;
  targetCount: number | null;
  targetUnit: TargetUnit;
  targetUnitLabel: string | null;
  expanded: boolean;
  onToggle: () => void;
  tags?: string[];
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
      <span className="card-summary-copy">
        <span className={arabic ? "arabic-preview" : "name-preview"} dir="auto">{title}</span>
        <MiniTags tags={tags} />
      </span>
    </button>
  );
}

export function MiniTags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return <span className="mini-tags" aria-label={tags.join(", ")}>{tags.map((tag) => <span key={tag}>{tag}</span>)}</span>;
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
  complete,
  onToggle,
  label,
}: {
  complete: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      className="completion-light"
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={complete}
    >
      <span className="completion-core" aria-hidden="true" />
    </button>
  );
}

export function AddToLibraryButton({ title, added, onAdd }: { title: string; added: boolean; onAdd: () => void }) {
  return (
    <button
      className={`completion-light discovery-add${added ? " is-added" : ""}`}
      type="button"
      onClick={onAdd}
      aria-label={t(added ? "discover.added" : "discover.add", { title })}
      aria-pressed={added}
    >
      <span className="completion-core" aria-hidden="true"><PlusMinusIcon minus={added} /></span>
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
