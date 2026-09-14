"use client";

import {
  CollapsedCardSummary,
  CompletionLight,
  SortHandle,
  TrackableCardShell,
  type SortHandleHandlers,
} from "../../components/TrackerPrimitives";
import { t } from "../../core/i18n";
import type { DevotionalItem } from "../../core/types";
import { getDevotionalDisplay } from "./devotional-utils";
import { DevotionalDetails } from "./DevotionalDetails";

interface DevotionalCardProps {
  item: DevotionalItem;
  complete: boolean;
  expanded: boolean;
  dragging: boolean;
  dragOffsetY: number;
  position: number;
  onToggleExpanded: () => void;
  onToggleComplete: () => void;
  onChangeFont: (direction: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
  sortHandleProps: SortHandleHandlers;
}

export function DevotionalCard(props: DevotionalCardProps) {
  const { item } = props;
  const display = getDevotionalDisplay(item);
  return (
    <TrackableCardShell
      id={item.id}
      complete={props.complete}
      expanded={props.expanded}
      dragging={props.dragging}
      dragOffsetY={props.dragOffsetY}
      dragHandle={<SortHandle sortId={item.id} label={t("card.reorderGeneric", { position: props.position })} {...props.sortHandleProps} />}
      summary={(
        <CollapsedCardSummary
          title={display.text}
          arabic={display.arabic}
          targetCount={item.targetCount}
          targetUnit={item.targetUnit}
          targetUnitLabel={item.targetUnitLabel}
          expanded={props.expanded}
          onToggle={props.onToggleExpanded}
        />
      )}
      completion={(
        <CompletionLight
          title={display.text}
          complete={props.complete}
          onToggle={props.onToggleComplete}
          completeLabel={t("card.completeGeneric", { title: display.text })}
          undoLabel={t("card.undoCompleteGeneric", { title: display.text })}
        />
      )}
    >
      <DevotionalDetails item={item} fontLevel={item.expandedArabicSize} onChangeFont={props.onChangeFont} actions={(
        <footer className="card-actions">
          <button type="button" className="edit-button" onClick={props.onEdit}>{t("action.edit")}</button>
          <button type="button" className="delete-button" onClick={props.onDelete} aria-label={`${display.text}: ${t("action.delete")}`}>×</button>
        </footer>
      )} />
    </TrackableCardShell>
  );
}
