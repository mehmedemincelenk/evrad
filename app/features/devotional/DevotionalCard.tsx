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
import type { DevotionalItem, DevotionalModuleId } from "../../core/types";
import { getDevotionalDisplay } from "./devotional-utils";
import { DevotionalDetails } from "./DevotionalDetails";
import { getDevotionalTags } from "./devotional-tags";

interface DevotionalCardProps {
  item: DevotionalItem;
  moduleId: DevotionalModuleId;
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
  const tags = getDevotionalTags(props.moduleId, item);
  return (
    <TrackableCardShell
      id={item.id}
      complete={props.complete}
      expanded={props.expanded}
      dragging={props.dragging}
      dragOffsetY={props.dragOffsetY}
      leading={<SortHandle sortId={item.id} label={t("card.reorderGeneric", { position: props.position })} {...props.sortHandleProps} />}
      summary={(
        <CollapsedCardSummary
          title={display.text}
          arabic={display.arabic}
          targetCount={item.targetCount}
          targetUnit={item.targetUnit}
          targetUnitLabel={item.targetUnitLabel}
          expanded={props.expanded}
          onToggle={props.onToggleExpanded}
          tags={tags}
        />
      )}
      trailing={(
        <CompletionLight
          complete={props.complete}
          onToggle={props.onToggleComplete}
          label={t(props.complete ? "card.undoCompleteGeneric" : "card.completeGeneric", { title: display.text })}
        />
      )}
    >
      <DevotionalDetails item={item} fontLevel={item.expandedArabicSize} onChangeFont={props.onChangeFont} tags={tags} actions={<CardActions title={display.text} onEdit={props.onEdit} onDelete={props.onDelete} />} />
    </TrackableCardShell>
  );
}
