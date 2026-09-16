"use client";

import { AppShell } from "../../AppShell";
import { StorageLoading } from "../../components/StorageLoading";
import { t } from "../../core/i18n";
import { DailySelectionSection } from "./DailySelectionSection";
import { useDailySelection } from "./useDailySelection";
import { useDailyCompletions } from "./useDailyCompletions";
import { useExpandableItems } from "../../hooks/useExpandableItems";

export function HomeScreen() {
  const { ready, selection, refresh } = useDailySelection();
  const completions = useDailyCompletions();
  const expansion = useExpandableItems();
  const hasContent = Boolean(selection && (selection.dhikr.length || selection.prayer || selection.surah || selection.poem));
  return (
    <AppShell activeModule={null} activeSpace={null} pinnedNavigation>
      <section className="daily-home" aria-labelledby="home-title">
        <header className="daily-home-header">
          <div><p className="eyebrow">{t("home.eyebrow")}</p><h1 id="home-title">{t("home.title")}</h1></div>
          <button type="button" className="daily-refresh" onClick={refresh} aria-label={t("home.refresh")} title={t("home.refresh")} disabled={!ready}>
            <span aria-hidden="true">↻</span>
          </button>
        </header>
        {!ready || !completions.ready ? <StorageLoading label={t("home.loading")} /> : hasContent && selection ? (
          <div className="daily-selection">
            <DailySelectionSection title={t("home.dhikr")} items={selection.dhikr} kind="dhikr" moduleId="dhikr" completeIds={completions.completeIds.dhikr} expandedIds={expansion.expandedIds} onToggleComplete={completions.toggleComplete} onToggleExpanded={expansion.toggleExpanded} />
            <DailySelectionSection title={t("home.prayer")} items={selection.prayer ? [selection.prayer] : []} kind="prayer" moduleId="prayers" completeIds={completions.completeIds.prayers} expandedIds={expansion.expandedIds} onToggleComplete={completions.toggleComplete} onToggleExpanded={expansion.toggleExpanded} />
            <DailySelectionSection title={t("home.surah")} items={selection.surah ? [selection.surah] : []} kind="surah" moduleId="memorization" completeIds={completions.completeIds.memorization} expandedIds={expansion.expandedIds} onToggleComplete={completions.toggleComplete} onToggleExpanded={expansion.toggleExpanded} />
            <DailySelectionSection title={t("home.poem")} items={selection.poem ? [selection.poem] : []} kind="poem" moduleId="poetry" completeIds={completions.completeIds.poetry} expandedIds={expansion.expandedIds} onToggleComplete={completions.toggleComplete} onToggleExpanded={expansion.toggleExpanded} />
          </div>
        ) : <p className="daily-empty">{t("home.empty")}</p>}
      </section>
    </AppShell>
  );
}
