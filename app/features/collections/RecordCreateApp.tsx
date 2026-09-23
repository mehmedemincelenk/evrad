"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../AppShell";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { t } from "../../core/i18n";
import { getSectionRoute } from "../../core/module-registry";
import type { BagCategory } from "../../core/record-categories";
import type { DevotionalDraft } from "../../core/types";
import { collectionRepository } from "../../data/collection-repository";
import { DevotionalEditor } from "../devotional/DevotionalEditor";
import { devotionalFromDraft } from "../../core/devotional";

export function RecordCreateApp({ category = "dhikr" }: { category?: BagCategory }) {
  return <AppShell section="virds"><RecordCreateScreen category={category} /></AppShell>;
}

export function RecordCreateScreen({
  category = "dhikr",
  initialItem: customInitialItem,
  onClose,
  onSaved,
}: {
  category?: BagCategory;
  initialItem?: DevotionalItem | null;
  onClose?: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const { showToast } = useAppRuntime();
  const [initialText] = useState(() =>
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("initial") ?? "" : "",
  );

  const isArabic = /[\u0600-\u06ff]/u.test(initialText);
  const derivedInitialItem = customInitialItem !== undefined
    ? customInitialItem
    : initialText
    ? {
        id: "",
        name: isArabic ? null : initialText,
        arabic: isArabic ? initialText : null,
        translation: null,
        details: null,
        source: null,
        targetCount: null,
        targetUnit: "count" as const,
        targetUnitLabel: null,
        listDisplay: isArabic ? ("arabic" as const) : ("name" as const),
        contexts: [],
        bagCategories: [category],
        moduleId: "dhikr" as const,
        sortOrder: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    : null;

  const close = () => {
    if (onClose) {
      onClose();
    } else {
      router.replace(getSectionRoute("virds"));
    }
  };

  const save = async (draft: DevotionalDraft) => {
    // New records have one storage identity; categories are independent labels.
    const item = { ...devotionalFromDraft("dhikr", draft, null, Date.now()), inVirds: true, liked: false };
    try {
      await collectionRepository.create(item);
      showToast(t("quickAdd.savedToast"));
      if (onSaved) {
        onSaved();
      } else {
        close();
      }
    } catch (error) {
      showToast(t("toast.storageError"));
      throw error;
    }
  };

  return (
    <DevotionalEditor
      key={derivedInitialItem?.name ?? derivedInitialItem?.arabic ?? "new"}
      item={derivedInitialItem}
      itemLabel={t("bag.record")}
      defaultCategory={category}
      onClose={close}
      onSave={save}
    />
  );
}
