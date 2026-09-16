"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../AppShell";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { t } from "../../core/i18n";
import type { DevotionalDraft } from "../../core/types";
import { devotionalRepositories } from "../../data/repositories";
import { DevotionalEditor } from "../devotional/DevotionalEditor";
import { devotionalFromDraft } from "../devotional/devotional-utils";
import { BagCategoryChips } from "./BagCategoryChips";
import { bagCategoryModule, type BagCategory } from "./bag-categories";

export function BagCreateApp() {
  return <AppShell activeModule="bag" activeSpace="library"><BagCreateScreen /></AppShell>;
}

function BagCreateScreen() {
  const [category, setCategory] = useState<BagCategory>("prayers");
  const router = useRouter();
  const { showToast } = useAppRuntime();
  const save = async (draft: DevotionalDraft) => {
    const moduleId = bagCategoryModule(category);
    const repository = devotionalRepositories[moduleId];
    try {
      const items = await repository.load();
      await repository.save(devotionalFromDraft(moduleId, draft, null, items.length));
      router.replace("/canta");
    } catch (error) {
      showToast(t("toast.storageError"));
      throw error;
    }
  };
  return <DevotionalEditor item={null} itemLabel={t(`bag.${category}`)} onClose={() => router.replace("/canta")} onSave={save} beforeFields={<section className="field-group"><span>{t("bag.categories")}</span><BagCategoryChips active={category} onChange={setCategory} /></section>} />;
}
