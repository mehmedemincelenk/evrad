"use client";

import { AddToLibraryButton, CollapsedCardSummary, TrackableCardShell } from "../../components/TrackerPrimitives";
import { ModuleGlyph } from "../../components/ModuleGlyph";
import { BookDetails } from "../books/BookDetails";
import type { BookTemplate } from "./discovery-types";

export function DiscoveryBookCard({ item, expanded, added, onToggle, onAdd }: { item: BookTemplate; expanded: boolean; added: boolean; onToggle: () => void; onAdd: () => void }) {
  return (
    <TrackableCardShell
      id={item.id}
      expanded={expanded}
      leading={undefined}
      marker={<ModuleGlyph icon="book" />}
      summary={<CollapsedCardSummary title={item.title} arabic={false} targetCount={item.targetCount} targetUnit={item.targetUnit} targetUnitLabel={item.targetUnitLabel} expanded={expanded} onToggle={onToggle} />}
      trailing={<AddToLibraryButton title={item.title} added={added} onAdd={onAdd} />}
    >
      <BookDetails item={item} />
    </TrackableCardShell>
  );
}
