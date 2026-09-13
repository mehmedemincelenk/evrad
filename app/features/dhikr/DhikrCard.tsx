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
import type { Dhikr } from "../../core/types";

const fontSizes = ["1.75rem", "2.1rem", "2.5rem", "2.95rem", "3.45rem"];

export function getDisplayTitle(dhikr: Dhikr): { text: string; arabic: boolean } {
  if (dhikr.listDisplay === "name" && dhikr.name) return { text: dhikr.name, arabic: false };
  if (dhikr.arabic) return { text: dhikr.arabic, arabic: true };
  return { text: dhikr.name ?? "", arabic: false };
}

export function DhikrCard({
  dhikr,
  complete,
  expanded,
  dragging,
  dragOffsetY,
  position,
  onToggleExpanded,
  onToggleComplete,
  onChangeFont,
  onEdit,
  onDelete,
  sortHandleProps,
}: {
  dhikr: Dhikr;
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
}) {
  const display = getDisplayTitle(dhikr);

  return (
    <TrackableCardShell
      id={dhikr.id}
      complete={complete}
      expanded={expanded}
      dragging={dragging}
      dragOffsetY={dragOffsetY}
      dragHandle={(
        <SortHandle
          sortId={dhikr.id}
          label={t("card.reorder", { position })}
          {...sortHandleProps}
        />
      )}
      summary={(
        <CollapsedCardSummary
          title={display.text}
          arabic={display.arabic}
          targetCount={dhikr.targetCount}
          targetUnit={dhikr.targetUnit}
          targetUnitLabel={dhikr.targetUnitLabel}
          expanded={expanded}
          onToggle={onToggleExpanded}
        />
      )}
      completion={<CompletionLight title={display.text} complete={complete} onToggle={onToggleComplete} />}
    >
      <ExpandableCardContent>
        {dhikr.name ? <DetailBlock label={t("detail.name")}><p>{dhikr.name}</p></DetailBlock> : null}
        {dhikr.arabic ? (
          <DetailBlock label={t("detail.arabic")} className="arabic-detail">
            <div className="font-controls">
              <button
                type="button"
                onClick={() => onChangeFont(-1)}
                aria-label={t("detail.fontSmaller")}
                disabled={dhikr.expandedArabicSize === 0}
              >A−</button>
              <span>{t("detail.fontLevel", { level: dhikr.expandedArabicSize + 1 })}</span>
              <button
                type="button"
                onClick={() => onChangeFont(1)}
                aria-label={t("detail.fontLarger")}
                disabled={dhikr.expandedArabicSize === 4}
              >A+</button>
            </div>
            <p
              className="expanded-arabic"
              lang="ar"
              dir="rtl"
              style={{ fontSize: fontSizes[dhikr.expandedArabicSize] }}
            >{dhikr.arabic}</p>
          </DetailBlock>
        ) : null}
        {dhikr.translation ? <DetailBlock label={t("detail.translation")}><p>{dhikr.translation}</p></DetailBlock> : null}
        {dhikr.details ? <DetailBlock label={t("detail.details")}><p className="details-copy">{dhikr.details}</p></DetailBlock> : null}

        <footer className="card-actions">
          <button type="button" className="edit-button" onClick={onEdit}>{t("action.edit")}</button>
          <button type="button" className="delete-button" onClick={onDelete} aria-label={`${display.text}: ${t("action.delete")}`}>×</button>
        </footer>
      </ExpandableCardContent>
    </TrackableCardShell>
  );
}
