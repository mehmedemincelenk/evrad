"use client";

import { AddToLibraryButton, CollapsedCardSummary, TrackableCardShell } from "../../components/TrackerPrimitives";
import { t } from "../../core/i18n";
import { BookDetails } from "../books/BookDetails";
import type { BookTemplate } from "./discovery-types";

export function DiscoveryBookCard({ item, expanded, added, onToggle, onAdd }: { item: BookTemplate; expanded: boolean; added: boolean; onToggle: () => void; onAdd: () => void }) {
  return (
    <TrackableCardShell
      id={item.id}
      expanded={expanded}
      leading={<span className="discovery-mark" aria-label={t("discover.mark")}>✦</span>}
      summary={<CollapsedCardSummary title={item.title} arabic={false} targetCount={item.targetCount} targetUnit={item.targetUnit} targetUnitLabel={item.targetUnitLabel} expanded={expanded} onToggle={onToggle} />}
      trailing={<AddToLibraryButton title={item.title} added={added} onAdd={onAdd} />}
    >
      <BookDetails item={item} />
    </TrackableCardShell>
  );
}
