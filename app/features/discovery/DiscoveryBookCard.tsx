"use client";

import { AddToLibraryButton, CollapsedCardSummary, DetailBlock, ExpandableCardContent, TrackableCardShell } from "../../components/TrackerPrimitives";
import { t } from "../../core/i18n";
import type { BookTemplate } from "./catalogs/books";

export function DiscoveryBookCard({ item, expanded, added, onToggle, onAdd }: { item: BookTemplate; expanded: boolean; added: boolean; onToggle: () => void; onAdd: () => void }) {
  return (
    <TrackableCardShell
      id={item.id}
      complete={false}
      expanded={expanded}
      dragging={false}
      dragOffsetY={0}
      dragHandle={<span className="discovery-mark" aria-label={t("discover.mark")}>✦</span>}
      summary={<CollapsedCardSummary title={item.title} arabic={false} targetCount={item.targetCount} targetUnit={item.targetUnit} targetUnitLabel={item.targetUnitLabel} expanded={expanded} onToggle={onToggle} />}
      completion={<AddToLibraryButton title={item.title} added={added} onAdd={onAdd} />}
    >
      <ExpandableCardContent>
        <DetailBlock label={t("editor.bookTitle")}><p>{item.title}</p></DetailBlock>
        {item.author ? <DetailBlock label={t("detail.author")}><p>{item.author}</p></DetailBlock> : null}
        {item.details ? <DetailBlock label={t("detail.details")}><p>{item.details}</p></DetailBlock> : null}
      </ExpandableCardContent>
    </TrackableCardShell>
  );
}
