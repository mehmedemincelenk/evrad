"use client";

import { useMemo, useState } from "react";
import type { DevotionalContext, DevotionalItem } from "../../core/types";

export function useDevotionalContextFilter<T extends Pick<DevotionalItem, "contexts">>(items: readonly T[]) {
  const [activeContext, setActiveContext] = useState<DevotionalContext | null>(null);
  const filteredItems = useMemo(
    () => activeContext ? items.filter((item) => item.contexts.includes(activeContext)) : items,
    [activeContext, items],
  );
  const toggleContext = (context: DevotionalContext) => {
    setActiveContext((current) => current === context ? null : context);
  };
  return { activeContext, filteredItems, toggleContext };
}
