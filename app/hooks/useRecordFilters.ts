"use client";

import { useState } from "react";
import { matchesBagCategory, type BagCategory } from "../core/record-categories";
import type { DevotionalContext, DevotionalItem, DevotionalModuleId } from "../core/types";

function toggle<T>(items: T[], value: T): T[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

export function useRecordFilters() {
  const [categories, setCategories] = useState<BagCategory[]>([]);
  const [contexts, setContexts] = useState<DevotionalContext[]>([]);
  return {
    categories, contexts,
    toggleCategory: (value: BagCategory) => setCategories((current) => toggle(current, value)),
    toggleContext: (value: DevotionalContext) => setContexts((current) => toggle(current, value)),
    matches: (item: Pick<DevotionalItem, "name" | "source" | "bagCategories" | "contexts">, moduleId: DevotionalModuleId) =>
      (!categories.length || categories.some((category) => matchesBagCategory(item, category, moduleId))) &&
      (!contexts.length || contexts.some((context) => item.contexts.includes(context))),
  };
}
