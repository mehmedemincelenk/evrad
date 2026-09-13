"use client";

import { useEffect } from "react";
import type { EntityEditorMode } from "../core/editor";

export function useEntityEditorRoute<T extends { id: string }>({
  mode,
  items,
  storageReady,
  onMissing,
}: {
  mode: EntityEditorMode;
  items: T[];
  storageReady: boolean;
  onMissing: () => void;
}): "new" | T | null {
  const editor = mode?.type === "new"
    ? "new"
    : mode?.type === "edit"
      ? items.find((item) => item.id === mode.id) ?? null
      : null;

  useEffect(() => {
    if (storageReady && mode?.type === "edit" && !editor) onMissing();
  }, [editor, mode, onMissing, storageReady]);

  return editor;
}
