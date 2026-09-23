import { useState, type CSSProperties, type KeyboardEventHandler, type PointerEventHandler, type ReactNode } from "react";
import { t } from "../core/i18n";
import type { TargetUnit } from "../core/types";
import { PlusMinusIcon } from "./PlusMinusIcon";
import { useAppRuntime } from "../core/AppRuntimeContext";
import { formatArabicDiacritics } from "../core/arabic-fonts";

export interface SortHandleHandlers {
  onPointerDown: PointerEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
}

export function TrackableCardShell({
  id,
  complete = false,
  expanded,
  dragging = false,
  dragOffsetY = 0,
  summary,
  leading,
  marker,
  targetBadge,
  trailing,
  children,
}: {
  id: string;
  complete?: boolean;
  expanded: boolean;
  dragging?: boolean;
  dragOffsetY?: number;
  summary: ReactNode;
  leading?: ReactNode;
  marker?: ReactNode;
  targetBadge?: ReactNode;
  trailing: ReactNode;
  children?: ReactNode;
}) {
  const [hasRendered, setHasRendered] = useState(expanded);
  if (expanded && !hasRendered) {
    setHasRendered(true);
  }

  return (
    <article
      className={`trackable-card${leading ? "" : " has-no-leading"}${marker ? " has-marker" : ""}${complete ? " is-complete" : ""}${expanded ? " is-expanded" : ""}${dragging ? " is-dragging" : ""}`}
      data-card-id={id}
      style={{ "--drag-offset-y": `${dragOffsetY}px` } as CSSProperties}
    >
      {marker ? <span className="card-module-marker" aria-hidden="true">{marker}</span> : null}
      {targetBadge}
      <div className="card-collapsed-row">
        {leading ?? <div className="card-leading-spacer" aria-hidden="true" />}
        {summary}
        {trailing}
      </div>
      <div className="card-details-accordion" aria-hidden={!expanded}>
        <div className="card-details-inner">
          {hasRendered ? children : null}
        </div>
      </div>
    </article>
  );
}

export function CollapsedCardSummary({
  sortId,
  sortProps,
  title,
  arabic,
  expanded,
  onToggle,
  tags = [],
}: {
  sortId?: string;
  sortProps?: SortHandleHandlers;
  title: string;
  arabic: boolean;
  targetCount?: number | null;
  targetUnit?: TargetUnit;
  targetUnitLabel?: string | null;
  expanded: boolean;
  onToggle: () => void;
  tags?: string[];
}) {
  const { showDiacritics } = useAppRuntime();
  const displayTitle = arabic ? formatArabicDiacritics(title, showDiacritics) : title;

  return (
    <button
      className="card-main"
      type="button"
      data-sort-id={sortId}
      onPointerDown={sortProps?.onPointerDown}
      onKeyDown={sortProps?.onKeyDown}
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={t(expanded ? "card.close" : "card.open", { title })}
    >
      <span className="card-summary-copy">
        <span className={arabic ? "arabic-preview" : "name-preview"} dir="auto">{displayTitle}</span>
        <MiniTags tags={tags} />
      </span>
    </button>
  );
}

export function MiniTags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return <span className="mini-tags" aria-label={tags.join(", ")}>{tags.map((tag) => <span key={tag}>{tag}</span>)}</span>;
}

export function TargetBadge({ count, unit, unitLabel }: { count?: number | null; unit?: TargetUnit; unitLabel?: string | null }) {
  if (count === null || count === undefined || count <= 0) return null;
  return (
    <span className="card-target-badge" aria-hidden="true">
      {unit === "custom" && unitLabel ? t("card.customTarget", { count, unit: unitLabel }) : t("card.target", { count })}
    </span>
  );
}

export function triggerHaptic(enabled = true, durationMs = 15): void {
  if (!enabled || typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(durationMs);
  } catch {
    // vibrate kısıtı
  }
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
  const { hapticEnabled } = useAppRuntime();

  const handleToggle = () => {
    triggerHaptic(hapticEnabled, 15);
    onToggle();
  };

  return (
    <button
      className="completion-light"
      type="button"
      onClick={handleToggle}
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

export function LikeButton({ title, liked, onToggle }: { title: string; liked: boolean; onToggle: () => void }) {
  return <button className={`completion-light discovery-like${liked ? " is-liked" : ""}`} type="button" onClick={onToggle} aria-label={t(liked ? "discover.unlike" : "discover.like", { title })} aria-pressed={liked}><span aria-hidden="true">🫀</span></button>;
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
