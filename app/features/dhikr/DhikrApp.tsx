"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppShell } from "../../AppShell";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";
import { formatLongDate, getLocalDateKey } from "../../core/date";
import { t } from "../../core/i18n";
import { normalizeOrder } from "../../core/sort";
import type { Dhikr, DhikrDraft, ModuleId } from "../../core/types";
import {
  deleteDhikr,
  loadCompletionIds,
  loadDhikrs,
  saveDhikr,
  saveDhikrOrder,
  seedDhikrs,
  setCompletion,
} from "../../data/db";
import { useLongPressSort } from "../../hooks/useLongPressSort";
import { DhikrCard, getDisplayTitle } from "./DhikrCard";
import { DhikrEditor } from "./DhikrEditor";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `dhikr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function DhikrApp() {
  const [dhikrs, setDhikrs] = useState<Dhikr[]>(() => seedDhikrs.map((item) => ({ ...item })));
  const [completeIds, setCompleteIds] = useState<Set<string>>(() => new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [currentDate, setCurrentDate] = useState(() => getLocalDateKey());
  const [today, setToday] = useState<Date | null>(null);
  const [editor, setEditor] = useState<"new" | Dhikr | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Dhikr | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuActivity, setMenuActivity] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [updateReady, setUpdateReady] = useState(false);
  const itemsRef = useRef(dhikrs);
  const serviceWorkerRef = useRef<ServiceWorkerRegistration | null>(null);

  const showStorageError = useCallback(() => setToast(t("toast.storageError")), []);

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
      })
      .catch(showStorageError);
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
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => registrations.forEach((registration) => registration.unregister()));
      return;
    }
    let disposed = false;

    navigator.serviceWorker.register("/sw.js").then(async (registration) => {
      if (disposed) return;
      serviceWorkerRef.current = registration;
      if (registration.waiting) setUpdateReady(true);
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
        });
      });

      const ready = await navigator.serviceWorker.ready;
      const resourceUrls = performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => url.startsWith(window.location.origin));
      ready.active?.postMessage({
        type: "CACHE_URLS",
        urls: [
          "/",
          "/zikirler",
          "/manifest.webmanifest",
          "/icon-192.png",
          "/icon-512.png",
          "/fonts/NotoNaskhArabic-Regular.ttf",
          "/fonts/NotoNaskhArabic-Bold.ttf",
          ...resourceUrls,
        ],
      });
    }).catch(() => undefined);

    const onControllerChange = () => window.location.reload();
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => {
      disposed = true;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const completeCount = dhikrs.reduce((total, dhikr) => total + (completeIds.has(dhikr.id) ? 1 : 0), 0);

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
    setEditor(null);
    setToast(t("toast.saved"));
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
    setToast(t("toast.deleted"));
  };

  const handleModule = (id: ModuleId, enabled: boolean) => {
    setMenuActivity((value) => value + 1);
    if (!enabled) {
      const key = `menu.${id}` as "menu.prayers" | "menu.books" | "menu.memorization" | "menu.games";
      setToast(t("toast.comingSoon", { module: t(key) }));
      return;
    }
    if (id === "dhikr") setMenuOpen(false);
  };

  const activateUpdate = () => serviceWorkerRef.current?.waiting?.postMessage({ type: "SKIP_WAITING" });

  return (
    <AppShell
      menuOpen={menuOpen}
      menuActivity={menuActivity}
      activeModule="dhikr"
      onOpenMenu={() => { setMenuOpen(true); setMenuActivity((value) => value + 1); }}
      onCloseMenu={() => setMenuOpen(false)}
      onMenuActivity={() => setMenuActivity((value) => value + 1)}
      onModule={handleModule}
      onAdd={() => { setMenuOpen(false); setEditor("new"); }}
    >
      <section className="dhikr-screen" aria-labelledby="page-title">
        <header className="screen-heading">
          <p className="eyebrow">{t("app.eyebrow")}</p>
          <div>
            <h1 id="page-title">{t("app.name")}</h1>
            <p className="date-line">{today ? formatLongDate(today) : "\u00a0"}</p>
            <p className="dayline">{t("app.tagline")}</p>
          </div>
          <div
            className={`progress-orb${dhikrs.length > 0 && completeCount === dhikrs.length ? " is-complete" : ""}`}
            aria-label={dhikrs.length ? t("progress.label", { total: dhikrs.length, complete: completeCount }) : t("progress.empty")}
          >
            <span>{completeCount}</span>
            <small>/ {dhikrs.length}</small>
          </div>
        </header>

        {dhikrs.length ? (
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
                onEdit={() => setEditor(dhikr)}
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
            <button className="primary-button" type="button" onClick={() => setEditor("new")}>{t("action.addFirst")}</button>
          </div>
        )}

        <p className="quiet-note">{t("app.lightNote")}</p>
      </section>

      <p className="sr-only" aria-live="polite">{reorderAnnouncement}</p>

      {toast ? <div className="toast" role="status">{toast}</div> : null}
      {updateReady ? (
        <div className="update-banner" role="status">
          <span>{t("toast.updateReady")}</span>
          <button type="button" onClick={activateUpdate}>{t("toast.reload")}</button>
        </div>
      ) : null}

      {editor ? (
        <DhikrEditor
          key={editor === "new" ? "new" : editor.id}
          dhikr={editor === "new" ? null : editor}
          onClose={() => setEditor(null)}
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
    </AppShell>
  );
}
