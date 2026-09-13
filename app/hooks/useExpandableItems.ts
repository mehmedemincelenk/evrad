"use client";

import { useCallback, useState } from "react";

export function useExpandableItems() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const forgetExpanded = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  return { expandedIds, toggleExpanded, forgetExpanded };
}
