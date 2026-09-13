"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../AppShell";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";
import { StorageLoading } from "../../components/StorageLoading";
import { useAppRuntime } from "../../core/AppRuntimeContext";
import { formatLongDate, getLocalDateKey } from "../../core/date";
import { t } from "../../core/i18n";
import { normalizeOrder } from "../../core/sort";
import type { Dhikr, DhikrDraft } from "../../core/types";
import {
  deleteDhikr,
  loadCompletionIds,
  loadDhikrs,
  saveDhikr,
  saveDhikrOrder,
  setCompletion,
} from "../../data/db";
import { useLongPressSort } from "../../hooks/useLongPressSort";
import { DhikrCard, getDisplayTitle } from "./DhikrCard";
import { DhikrEditor } from "./DhikrEditor";
import { getMissingRecommendedDhikrs } from "./recommended-dhikrs";

export type DhikrEditorMode = { type: "new" } | { type: "edit"; id: string } | null;

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `dhikr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function DhikrApp({ editorMode = null }: { editorMode?: DhikrEditorMode }) {
  const router = useRouter();
  return (
    <AppShell activeModule="dhikr" onAdd={() => router.push("/zikirler/yeni")}>
      <DhikrScreen editorMode={editorMode} />
    </AppShell>
  );
}

function DhikrScreen({ editorMode }: { editorMode: DhikrEditorMode }) {
  const router = useRouter();
  const { showToast } = useAppRuntime();
  const [dhikrs, setDhikrs] = useState<Dhikr[]>([]);
  const [completeIds, setCompleteIds] = useState<Set<string>>(() => new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [currentDate, setCurrentDate] = useState(() => getLocalDateKey());
  const [today, setToday] = useState<Date | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Dhikr | null>(null);
  const [recommendedConfirmOpen, setRecommendedConfirmOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const itemsRef = useRef(dhikrs);
  const editor = editorMode?.type === "new"
    ? "new"
    : editorMode?.type === "edit"
      ? dhikrs.find((item) => item.id === editorMode.id) ?? null
      : null;

  const showStorageError = useCallback(() => showToast(t("toast.storageError")), [showToast]);

  const replaceItems = useCallback((items: Dhikr[]) => {
    itemsRef.current = items;
    setDhikrs(items);
  }, []);

  const {
    draggingId,
    dragOffsetY,
    announcement: reorderAnnouncement,
    handleProps: sortHandleProps,
  } = useLongPressSort({
    items: dhikrs,
    onChange: replaceItems,
    onPersist: saveDhikrOrder,
    getAnnouncement: (item, position) => t("card.reordered", { title: getDisplayTitle(item).text, position }),
    onError: showStorageError,
  });

  useEffect(() => {
    let active = true;
    Promise.all([loadDhikrs(), loadCompletionIds(currentDate)])
      .then(([storedDhikrs, storedCompletions]) => {
        if (!active) return;
        replaceItems(storedDhikrs);
        setCompleteIds(storedCompletions);
        setStorageReady(true);
      })
      .catch(() => {
        setStorageReady(true);
        showStorageError();
      });
    return () => { active = false; };
  }, [currentDate, replaceItems, showStorageError]);

  useEffect(() => {
    const checkDate = () => {
      const nextDate = new Date();
      const nextKey = getLocalDateKey(nextDate);
      setToday(nextDate);
      if (nextKey !== currentDate) setCurrentDate(nextKey);
    };
    checkDate();
    const interval = window.setInterval(checkDate, 60_000);
    const onVisibility = () => document.visibilityState === "visible" && checkDate();
    window.addEventListener("focus", checkDate);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", checkDate);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [currentDate]);

  useEffect(() => {
    if (!storageReady || editorMode?.type !== "edit" || editor) return;
    showToast(t("editor.notFound"));
    router.replace("/zikirler");
  }, [editor, editorMode, router, showToast, storageReady]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleComplete = (id: string) => {
    const complete = !completeIds.has(id);
    setCompleteIds((current) => {
      const next = new Set(current);
      if (complete) next.add(id);
      else next.delete(id);
      return next;
    });
    setCompletion("dhikr", id, currentDate, complete).catch(showStorageError);
  };

  const changeFont = (dhikr: Dhikr, direction: -1 | 1) => {
    const expandedArabicSize = Math.max(0, Math.min(4, dhikr.expandedArabicSize + direction)) as 0 | 1 | 2 | 3 | 4;
    if (expandedArabicSize === dhikr.expandedArabicSize) return;
    const updated = { ...dhikr, expandedArabicSize, updatedAt: new Date().toISOString() };
    replaceItems(itemsRef.current.map((item) => item.id === updated.id ? updated : item));
    saveDhikr(updated).catch(showStorageError);
  };

  const saveDraft = (draft: DhikrDraft) => {
    const now = new Date().toISOString();
    const existing = editor === "new" ? null : editor;
    const dhikr: Dhikr = {
      id: existing?.id ?? createId(),
      name: draft.name || null,
      arabic: draft.arabic || null,
      translation: draft.translation || null,
      details: draft.details || null,
      targetCount: draft.targetCount ? Number(draft.targetCount) : null,
      targetUnit: draft.targetUnit,
      targetUnitLabel: draft.targetUnit === "custom" ? draft.targetUnitLabel : null,
      listDisplay: draft.listDisplay,
      expandedArabicSize: existing?.expandedArabicSize ?? 1,
      sortOrder: existing?.sortOrder ?? itemsRef.current.length,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    const next = existing
      ? itemsRef.current.map((item) => item.id === dhikr.id ? dhikr : item)
      : [...itemsRef.current, dhikr];
    replaceItems(normalizeOrder(next));
    saveDhikr(dhikr).catch(showStorageError);
    router.replace("/zikirler");
    showToast(t("toast.saved"));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    replaceItems(normalizeOrder(itemsRef.current.filter((item) => item.id !== id)));
    setExpandedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    setCompleteIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    deleteDhikr(id).then(() => saveDhikrOrder(itemsRef.current)).catch(showStorageError);
    setDeleteTarget(null);
    showToast(t("toast.deleted"));
  };

  const addRecommended = () => {
    const missing = getMissingRecommendedDhikrs(itemsRef.current);
    setRecommendedConfirmOpen(false);
    if (!missing.length) {
      showToast(t("recommended.alreadyAdded"));
      return;
    }
    const now = new Date().toISOString();
    const additions = missing.map((item, index): Dhikr => ({
      ...item,
      sortOrder: itemsRef.current.length + index,
      createdAt: now,
      updatedAt: now,
    }));
    const next = normalizeOrder([...itemsRef.current, ...additions]);
    replaceItems(next);
    saveDhikrOrder(next).catch(showStorageError);
    showToast(t("recommended.added", { count: additions.length }));
  };

  return (
    <>
      <section className="dhikr-screen" aria-labelledby="page-title">
        <header className="screen-heading">
          <p className="eyebrow">{t("app.eyebrow")}</p>
          <div>
            <h1 id="page-title">{t("app.name")}</h1>
            <p className="date-line">{today ? formatLongDate(today) : "\u00a0"}</p>
            <p className="dayline">{t("app.tagline")}</p>
          </div>
        </header>

        {!storageReady ? <StorageLoading /> : dhikrs.length ? (
          <div className="dhikr-list">
            {dhikrs.map((dhikr, index) => (
              <DhikrCard
                key={dhikr.id}
                dhikr={dhikr}
                complete={completeIds.has(dhikr.id)}
                expanded={expandedIds.has(dhikr.id)}
                dragging={draggingId === dhikr.id}
                dragOffsetY={draggingId === dhikr.id ? dragOffsetY : 0}
                position={index + 1}
                onToggleExpanded={() => toggleExpanded(dhikr.id)}
                onToggleComplete={() => toggleComplete(dhikr.id)}
                onChangeFont={(direction) => changeFont(dhikr, direction)}
                onEdit={() => router.push(`/zikirler/${encodeURIComponent(dhikr.id)}/duzenle`)}
                onDelete={() => setDeleteTarget(dhikr)}
                sortHandleProps={sortHandleProps}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-light" aria-hidden="true" />
            <h2>{t("empty.title")}</h2>
            <p>{t("empty.body")}</p>
            <button className="primary-button" type="button" onClick={() => router.push("/zikirler/yeni")}>{t("action.addFirst")}</button>
          </div>
        )}

        <p className="quiet-note">{t("app.lightNote")}</p>
        {storageReady ? (
          <button className="recommended-trigger" type="button" onClick={() => setRecommendedConfirmOpen(true)}>
            <span aria-hidden="true">✦</span>
            {t("recommended.trigger")}
          </button>
        ) : null}
      </section>

      <p className="sr-only" aria-live="polite">{reorderAnnouncement}</p>
      {draggingId ? <div className="sort-status" role="status">{t("card.sorting")}</div> : null}

      {editor ? (
        <DhikrEditor
          key={editor === "new" ? "new" : editor.id}
          dhikr={editor === "new" ? null : editor}
          onClose={() => router.replace("/zikirler")}
          onSave={saveDraft}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmation
          title={getDisplayTitle(deleteTarget).text}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      {recommendedConfirmOpen ? (
        <ConfirmationModal
          title={t("recommended.confirmTitle")}
          body={<p>{t("recommended.confirmBody")}</p>}
          cancelLabel={t("action.cancel")}
          confirmLabel={t("recommended.confirm")}
          onCancel={() => setRecommendedConfirmOpen(false)}
          onConfirm={addRecommended}
        />
      ) : null}
    </>
  );
}
