"use client";

import { useState } from "react";
import {
  AddToLibraryButton,
  CollapsedCardSummary,
  TrackableCardShell,
} from "../../components/TrackerPrimitives";
import { ModuleGlyph } from "../../components/ModuleGlyph";
import { getModule } from "../../core/module-registry";
import { DevotionalDetails } from "../devotional/DevotionalDetails";
import { getDevotionalDisplay } from "../devotional/devotional-utils";
import type { DevotionalTemplate } from "./discovery-types";
import type { DevotionalModuleId } from "../../core/types";
import { getDevotionalTags } from "../devotional/devotional-tags";

export function DiscoveryDevotionalCard({
  item,
  expanded,
  added,
  onToggle,
  onAdd,
  moduleId,
}: {
  item: DevotionalTemplate;
  expanded: boolean;
  added: boolean;
  onToggle: () => void;
  onAdd: () => void;
  moduleId: DevotionalModuleId;
}) {
  const [fontLevel, setFontLevel] = useState(item.expandedArabicSize);
  const display = getDevotionalDisplay(item);
  const tags = getDevotionalTags(moduleId, item);
  const changeFont = (direction: -1 | 1) => setFontLevel((current) => (
    Math.max(0, Math.min(4, current + direction)) as 0 | 1 | 2 | 3 | 4
  ));
  return (
    <TrackableCardShell
      id={item.id}
      expanded={expanded}
      leading={undefined}
      marker={<ModuleGlyph icon={getModule(moduleId).icon} />}
      summary={<CollapsedCardSummary title={display.text} arabic={display.arabic} targetCount={item.targetCount} targetUnit={item.targetUnit} targetUnitLabel={item.targetUnitLabel} expanded={expanded} onToggle={onToggle} tags={tags} />}
      trailing={<AddToLibraryButton title={display.text} added={added} onAdd={onAdd} />}
    >
      <DevotionalDetails item={item} fontLevel={fontLevel} onChangeFont={changeFont} tags={tags} />
    </TrackableCardShell>
  );
}
