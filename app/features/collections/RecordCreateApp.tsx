"use client";

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

function RecordCreateScreen({ category }: { category: BagCategory }) {
  const router = useRouter();
  const { showToast } = useAppRuntime();
  const close = () => router.replace(getSectionRoute("virds"));
  const save = async (draft: DevotionalDraft) => {
    // New records have one storage identity; categories are independent labels.
    const item = { ...devotionalFromDraft("dhikr", draft, null, Date.now()), inVirds: true, liked: false };
    try {
      await collectionRepository.create(item);
      close();
    } catch (error) {
      showToast(t("toast.storageError"));
      throw error;
    }
  };
  return <DevotionalEditor item={null} itemLabel={t("bag.record")} defaultCategory={category} onClose={close} onSave={save} />;
}
