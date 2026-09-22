"use client";

import {
  CollapsedCardSummary,
  CompletionLight,
  AddToLibraryButton,
  LikeButton,
  SortHandle,
  TrackableCardShell,
  type SortHandleHandlers,
} from "../../components/TrackerPrimitives";
import { CardActions } from "../../components/CardActions";
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
  onDelete: () => void;
  sortHandleProps?: SortHandleHandlers;
  mode?: "standard" | "bag" | "virds";
  inVirds?: boolean;
  onToggleVird?: () => void;
  onRemoveFromCollections?: () => void;
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
      dragOffsetY={props.dragOffsetY}
      leading={props.sortHandleProps ? <SortHandle sortId={props.cardId ?? item.id} label={t("card.reorderGeneric", { position: props.position ?? 1 })} {...props.sortHandleProps} /> : null}
      marker={<ModuleGlyph icon={getRecordIcon(item, props.moduleId)} />}
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
      trailing={(
        props.mode === "bag" ? (
          <div className="discovery-actions"><LikeButton title={display.text} liked onToggle={() => props.onRemoveFromCollections?.()} /><AddToLibraryButton title={display.text} added={Boolean(props.inVirds)} onAdd={() => props.onToggleVird?.()} /></div>
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
        actions={props.mode === "standard" || !props.mode ? (
          <CardActions title={display.text} onEdit={props.onEdit} onDelete={props.onDelete} />
        ) : (
          <footer className="card-actions">
            <button type="button" className="edit-button" onClick={props.onEdit}>{t("action.edit")}</button>
            <button type="button" className="danger-button" onClick={props.onRemoveFromCollections}>{t(props.mode === "bag" ? "collection.removeFromBag" : "collection.remove")}</button>
          </footer>
        )}
      />
    </TrackableCardShell>
  );
}
