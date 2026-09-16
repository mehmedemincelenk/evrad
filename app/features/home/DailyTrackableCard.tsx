"use client";

import { useState } from "react";
import { CollapsedCardSummary, CompletionLight, TrackableCardShell } from "../../components/TrackerPrimitives";
import { ModuleGlyph } from "../../components/ModuleGlyph";
import { getModule } from "../../core/module-registry";
import { t } from "../../core/i18n";
import type { DevotionalItem, DevotionalModuleId } from "../../core/types";
import { DevotionalDetails } from "../devotional/DevotionalDetails";
import { getDevotionalDisplay } from "../devotional/devotional-utils";
import { getDevotionalTags } from "../devotional/devotional-tags";

export function DailyTrackableCard({ item, moduleId, complete, expanded, onToggleExpanded, onToggleComplete }: {
  item: DevotionalItem;
  moduleId: DevotionalModuleId;
  complete: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onToggleComplete: () => void;
}) {
  const [fontLevel, setFontLevel] = useState(item.expandedArabicSize);
  const display = getDevotionalDisplay(item);
  const definition = getModule(moduleId);
  const tags = getDevotionalTags(moduleId, item);
  const changeFont = (direction: -1 | 1) => setFontLevel((current) => (
    Math.max(0, Math.min(4, current + direction)) as 0 | 1 | 2 | 3 | 4
  ));

  return (
    <TrackableCardShell
      id={item.id}
      complete={complete}
      expanded={expanded}
      leading={<span className="home-card-marker" aria-hidden="true"><ModuleGlyph icon={definition.icon} /></span>}
      summary={<CollapsedCardSummary title={display.text} arabic={display.arabic} targetCount={item.targetCount} targetUnit={item.targetUnit} targetUnitLabel={item.targetUnitLabel} expanded={expanded} onToggle={onToggleExpanded} tags={tags} />}
      trailing={<CompletionLight complete={complete} onToggle={onToggleComplete} label={t(complete ? "card.undoCompleteGeneric" : "card.completeGeneric", { title: display.text })} />}
    >
      <DevotionalDetails item={item} fontLevel={fontLevel} onChangeFont={changeFont} tags={tags} />
    </TrackableCardShell>
  );
}
