"use client";

import { useRouter } from "next/navigation";
import { useIsHydrated } from "../../hooks/useIsHydrated";
import { draftFromText } from "../../core/devotional-draft";
import { t } from "../../core/i18n";
import { getSectionRoute } from "../../core/module-registry";
import type { BagCategory } from "../../core/record-categories";
import type { DevotionalDraft } from "../../core/types";
import { DevotionalEditor } from "../devotional/DevotionalEditor";
import { useCreateRecord } from "./useCreateRecord";

export function RecordCreateScreen({ category = "dhikr", initialDraft, onClose }: {
  category?: BagCategory;
  initialDraft?: DevotionalDraft;
  onClose?: () => void;
}) {
  const router = useRouter();
  const save = useCreateRecord();
  const hydrated = useIsHydrated();
  const initialText = hydrated ? new URLSearchParams(window.location.search).get("initial") ?? "" : "";
  return <DevotionalEditor key={initialText} item={null} initialDraft={initialDraft ?? (initialText ? draftFromText(initialText, category) : undefined)}
    itemLabel={t("bag.record")} defaultCategory={category}
    onClose={onClose ?? (() => router.replace(getSectionRoute("virds")))} onSave={save} />;
}
