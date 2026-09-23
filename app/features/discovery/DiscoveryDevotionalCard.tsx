"use client";

import { useState } from "react";
import {
  AddToLibraryButton,
  LikeButton,
  CollapsedCardSummary,
  TargetBadge,
  TrackableCardShell,
} from "../../components/TrackerPrimitives";
import { ModuleGlyph } from "../../components/ModuleGlyph";
import { DevotionalDetails } from "../devotional/DevotionalDetails";
import { getDevotionalDisplay } from "../../core/devotional";
import type { DevotionalTemplate } from "./discovery-types";
import type { DevotionalModuleId } from "../../core/types";
import { getRecordIcon } from "../../core/record-categories";

export function DiscoveryDevotionalCard({
  item,
  expanded,
  added,
  liked,
  onToggle,
  onAdd,
  onLike,
  moduleId,
}: {
  item: DevotionalTemplate;
  expanded: boolean;
  added: boolean;
  liked: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onLike: () => void;
  moduleId: DevotionalModuleId;
}) {
  const [fontLevel, setFontLevel] = useState(item.expandedArabicSize);
  const display = getDevotionalDisplay(item);
  const changeFont = (direction: -1 | 1) => setFontLevel((current) => (
    Math.max(0, Math.min(4, current + direction)) as 0 | 1 | 2 | 3 | 4
  ));
  return (
    <TrackableCardShell
      id={item.id}
      expanded={expanded}
      leading={<LikeButton title={display.text} liked={liked} onToggle={onLike} />}
      marker={<ModuleGlyph icon={getRecordIcon(item, moduleId)} />}
      targetBadge={<TargetBadge count={item.targetCount} unit={item.targetUnit} unitLabel={item.targetUnitLabel} />}
      summary={<CollapsedCardSummary title={display.text} arabic={display.arabic} expanded={expanded} onToggle={onToggle} />}
      trailing={<AddToLibraryButton title={display.text} added={added} onAdd={onAdd} />}
    >
      <DevotionalDetails item={item} fontLevel={fontLevel} onChangeFont={changeFont} />
    </TrackableCardShell>
  );
}
