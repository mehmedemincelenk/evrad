"use client";

import { useCallback } from "react";
import type { EntityEditorMode } from "../../core/editor";
import type { ArabicFontLevel, DevotionalDraft, DevotionalItem, DevotionalModuleId } from "../../core/types";
import { devotionalRepositories } from "../../data/repositories";
import { useLibraryModule } from "../../hooks/useLibraryModule";
import { devotionalFromDraft, getDevotionalDisplay } from "./devotional-utils";

export function useDevotionalModule(moduleId: DevotionalModuleId, editorMode: EntityEditorMode) {
  const fromDraft = useCallback(
    (draft: DevotionalDraft, existing: DevotionalItem | null, sortOrder: number) => devotionalFromDraft(moduleId, draft, existing, sortOrder),
    [moduleId],
  );
  const state = useLibraryModule({
    moduleId,
    editorMode,
    repository: devotionalRepositories[moduleId],
    getTitle: getDevotionalTitle,
    fromDraft,
  });
  const { updateItem } = state;

  const changeFont = useCallback((item: DevotionalItem, direction: -1 | 1) => {
    const expandedArabicSize = Math.max(0, Math.min(4, item.expandedArabicSize + direction)) as ArabicFontLevel;
    if (expandedArabicSize === item.expandedArabicSize) return;
    updateItem({ ...item, expandedArabicSize, updatedAt: new Date().toISOString() });
  }, [updateItem]);

  return {
    ...state,
    changeFont,
  };
}

function getDevotionalTitle(item: DevotionalItem): string {
  return getDevotionalDisplay(item).text;
}
