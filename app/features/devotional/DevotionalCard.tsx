"use client";

import {
  CollapsedCardSummary,
  CompletionLight,
  AddToLibraryButton,
  LikeButton,
  TargetBadge,
  TrackableCardShell,
  type SortHandleHandlers,
} from "../../components/TrackerPrimitives";
import type { CollectionId } from "../../core/collections";
import { ModuleGlyph } from "../../components/ModuleGlyph";
import { t } from "../../core/i18n";
import type { DevotionalItem, DevotionalModuleId } from "../../core/types";
import { getDevotionalDisplay } from "../../core/devotional";
import { DevotionalDetails } from "./DevotionalDetails";
import { getRecordIcon } from "../../core/record-categories";

interface DevotionalCardProps {
  cardId?: string;
  item: DevotionalItem;
  moduleId: DevotionalModuleId;
  complete: boolean;
  expanded: boolean;
  dragging: boolean;
  dragOffsetY: number;
  position?: number;
  onToggleExpanded: () => void;
  onToggleComplete: () => void;
  onChangeFont: (direction: -1 | 1) => void;
  onEdit: () => void;
  sortHandleProps?: SortHandleHandlers;
  collection: CollectionId;
  inVirds?: boolean;
  onToggleVird: () => void;
  onRemoveFromCollections: () => void;
}

export function DevotionalCard(props: DevotionalCardProps) {
  const { item } = props;
  const display = getDevotionalDisplay(item);
  return (
    <TrackableCardShell
      id={props.cardId ?? item.id}
      complete={props.complete}
      expanded={props.expanded}
      dragging={props.dragging}
      leading={(
        props.collection === "favorites" ? (
          <LikeButton title={display.text} liked onToggle={props.onRemoveFromCollections} />
        ) : undefined
      )}
      marker={(
        <span className="card-status-cluster">
          <ModuleGlyph icon={getRecordIcon(item, props.moduleId)} />
          <TargetBadge count={item.targetCount} unit={item.targetUnit} unitLabel={item.targetUnitLabel} />
        </span>
      )}
      summary={(
        <CollapsedCardSummary
          sortId={props.cardId ?? item.id}
          sortProps={props.sortHandleProps}
          title={display.text}
          arabic={display.arabic}
          expanded={props.expanded}
          onToggle={props.onToggleExpanded}
        />
      )}
      trailing={(
        props.collection === "favorites" ? (
          <AddToLibraryButton title={display.text} added={Boolean(props.inVirds)} onAdd={props.onToggleVird} />
        ) : (
          <CompletionLight
            complete={props.complete}
            onToggle={props.onToggleComplete}
            label={t(props.complete ? "card.undoCompleteGeneric" : "card.completeGeneric", { title: display.text })}
          />
        )
      )}
    >
      <DevotionalDetails
        item={item}
        fontLevel={item.expandedArabicSize}
        onChangeFont={props.onChangeFont}
        actions={(
          <footer className="card-actions">
            <button type="button" className="edit-button" onClick={props.onEdit}>{t("action.edit")}</button>
            <button type="button" className="danger-button" onClick={props.onRemoveFromCollections}>{t(props.collection === "favorites" ? "collection.removeFromBag" : "collection.remove")}</button>
          </footer>
        )}
      />
    </TrackableCardShell>
  );
}
