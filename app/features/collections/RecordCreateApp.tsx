"use client";

import { AppShell } from "../../AppShell";
import type { BagCategory } from "../../core/record-categories";
import { RecordCreateScreen } from "./RecordCreateScreen";

export function RecordCreateApp({ category = "dhikr" }: { category?: BagCategory }) {
  return <AppShell section="create"><RecordCreateScreen category={category} /></AppShell>;
}
