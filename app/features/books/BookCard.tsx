"use client";

import {
  CollapsedCardSummary,
  CompletionLight,
  DetailBlock,
  ExpandableCardContent,
  SortHandle,
  TrackableCardShell,
  type SortHandleHandlers,
} from "../../components/TrackerPrimitives";
import { t } from "../../core/i18n";
import type { BookItem } from "../../core/types";

export function BookCard({
  item, complete, expanded, dragging, dragOffsetY, position,
  onToggleExpanded, onToggleComplete, onEdit, onDelete, sortHandleProps,
}: {
  item: BookItem;
  complete: boolean;
  expanded: boolean;
  dragging: boolean;
  dragOffsetY: number;
  position: number;
  onToggleExpanded: () => void;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  sortHandleProps: SortHandleHandlers;
}) {
  return (
    <TrackableCardShell
      id={item.id}
      complete={complete}
      expanded={expanded}
      dragging={dragging}
      dragOffsetY={dragOffsetY}
      dragHandle={<SortHandle sortId={item.id} label={t("card.reorderGeneric", { position })} {...sortHandleProps} />}
      summary={<CollapsedCardSummary title={item.title} arabic={false} targetCount={item.targetCount} targetUnit={item.targetUnit} targetUnitLabel={item.targetUnitLabel} expanded={expanded} onToggle={onToggleExpanded} />}
      completion={<CompletionLight title={item.title} complete={complete} onToggle={onToggleComplete} completeLabel={t("card.completeGeneric", { title: item.title })} undoLabel={t("card.undoCompleteGeneric", { title: item.title })} />}
    >
      <ExpandableCardContent>
        <DetailBlock label={t("editor.bookTitle")}><p>{item.title}</p></DetailBlock>
        {item.author ? <DetailBlock label={t("detail.author")}><p>{item.author}</p></DetailBlock> : null}
        {item.details ? <DetailBlock label={t("detail.details")}><p className="details-copy">{item.details}</p></DetailBlock> : null}
        <footer className="card-actions">
          <button type="button" className="edit-button" onClick={onEdit}>{t("action.edit")}</button>
          <button type="button" className="delete-button" onClick={onDelete} aria-label={`${item.title}: ${t("action.delete")}`}>×</button>
        </footer>
      </ExpandableCardContent>
    </TrackableCardShell>
  );
}
