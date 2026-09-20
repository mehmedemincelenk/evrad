"use client";

import {
  CollapsedCardSummary,
  CompletionLight,
  AddToLibraryButton,
  SortHandle,
  TrackableCardShell,
  type SortHandleHandlers,
} from "../../components/TrackerPrimitives";
import { CardActions } from "../../components/CardActions";
import { ModuleGlyph } from "../../components/ModuleGlyph";
import { t } from "../../core/i18n";
import { getModule } from "../../core/module-registry";
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
  const tags = getDevotionalTags(props.moduleId, item);
  return (
    <TrackableCardShell
      id={item.id}
      complete={props.complete}
      expanded={props.expanded}
      dragging={props.dragging}
      dragOffsetY={props.dragOffsetY}
      leading={<SortHandle sortId={props.mode === "virds" ? `${props.moduleId}:${item.id}` : item.id} label={t("card.reorderGeneric", { position: props.position ?? 1 })} {...props.sortHandleProps!} />}
      marker={props.mode === "bag" || props.mode === "virds" ? <ModuleGlyph icon={getModule(props.moduleId).icon} /> : undefined}
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
        props.mode === "bag" ? (
          <AddToLibraryButton title={display.text} added={Boolean(props.inVirds)} onAdd={() => props.onToggleVird?.()} />
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
        tags={tags}
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
