"use client";

import {
  CollapsedCardSummary,
  CompletionLight,
  SortHandle,
  TrackableCardShell,
  type SortHandleHandlers,
} from "../../components/TrackerPrimitives";
import { CardActions } from "../../components/CardActions";
import { t } from "../../core/i18n";
import type { BookItem } from "../../core/types";
import { BookDetails } from "./BookDetails";

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
      leading={<SortHandle sortId={item.id} label={t("card.reorderGeneric", { position })} {...sortHandleProps} />}
      summary={<CollapsedCardSummary title={item.title} arabic={false} expanded={expanded} onToggle={onToggleExpanded} />}
      trailing={<CompletionLight complete={complete} onToggle={onToggleComplete} label={t(complete ? "card.undoCompleteGeneric" : "card.completeGeneric", { title: item.title })} />}
    >
      <BookDetails item={item} actions={<CardActions title={item.title} onEdit={onEdit} onDelete={onDelete} />} />
    </TrackableCardShell>
  );
}
