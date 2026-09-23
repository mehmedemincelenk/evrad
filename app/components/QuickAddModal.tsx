"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Sparkles, SlidersHorizontal, X } from "lucide-react";
import { t } from "../core/i18n";
import { collectionRepository } from "../data/collection-repository";
import { devotionalFromDraft } from "../core/devotional";
import { useAppRuntime } from "../core/AppRuntimeContext";
import { DevotionalEditor } from "../features/devotional/DevotionalEditor";

import type { DevotionalItem } from "../core/types";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
  onOpenDetailed?: (initialItem: DevotionalItem | null) => void;
}

export function QuickAddModal({ open, onClose, onOpenDetailed }: QuickAddModalProps) {
  if (!open) return null;
  return <QuickAddModalContent onClose={onClose} onOpenDetailed={onOpenDetailed} />;
}

function QuickAddModalContent({
  onClose,
  onOpenDetailed,
}: {
  onClose: () => void;
  onOpenDetailed?: (initialItem: DevotionalItem | null) => void;
}) {
  const { showToast } = useAppRuntime();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDetailed, setIsDetailed] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.body.classList.add("editor-open");
    return () => {
      document.body.classList.remove("editor-open");
    };
  }, []);

  useEffect(() => {
    if (isDetailed) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [isDetailed]);

  useEffect(() => {
    if (isDetailed) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailed, onClose]);

  const trimmed = text.trim();
  const hasText = trimmed.length > 0;
  const isArabic = /[\u0600-\u06ff]/u.test(trimmed);

  const handleQuickSave = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!hasText || saving) return;

    setSaving(true);
    try {
      const item = {
        ...devotionalFromDraft(
          "dhikr",
          {
            name: isArabic ? "" : trimmed,
            arabic: isArabic ? trimmed : "",
            translation: "",
            details: "",
            source: "",
            targetCount: "",
            targetUnit: "count",
            targetUnitLabel: "",
            listDisplay: isArabic ? "arabic" : "name",
            contexts: ["general"],
            bagCategories: ["dhikr"],
          },
          null,
          Date.now(),
        ),
        inVirds: true,
        liked: false,
      };

      await collectionRepository.create(item);
      showToast(t("quickAdd.savedToast"));
      onClose();
    } catch {
      showToast(t("toast.storageError"));
    } finally {
      setSaving(false);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleQuickSave();
    }
  };

  const initialItem = trimmed
    ? {
        id: "",
        name: isArabic ? null : trimmed,
        arabic: isArabic ? trimmed : null,
        translation: null,
        details: null,
        source: null,
        targetCount: null,
        targetUnit: "count" as const,
        targetUnitLabel: null,
        listDisplay: isArabic ? ("arabic" as const) : ("name" as const),
        contexts: ["general" as const],
        bagCategories: ["dhikr" as const],
        moduleId: "dhikr" as const,
        sortOrder: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    : null;

  return (
    <div
      className={`quick-add-backdrop${isDetailed ? " is-detailed" : ""}`}
      onClick={(e) => {
        if (!isDetailed && e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      {isDetailed ? (
        <DevotionalEditor
          item={initialItem}
          itemLabel={t("bag.record")}
          defaultCategory="dhikr"
          onClose={onClose}
          onSave={async (draft) => {
            const item = { ...devotionalFromDraft("dhikr", draft, null, Date.now()), inVirds: true, liked: false };
            try {
              await collectionRepository.create(item);
              showToast(t("quickAdd.savedToast"));
              onClose();
            } catch (error) {
              showToast(t("toast.storageError"));
              throw error;
            }
          }}
        />
      ) : (
      <div
        className="quick-add-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
      >
        <div className="quick-add-header">
          <div className="quick-add-title-wrap">
            <Sparkles className="quick-add-sparkle" aria-hidden="true" />
            <h2 id="quick-add-title" className="quick-add-title">
              {t("quickAdd.title")}
            </h2>
          </div>
          <button
            type="button"
            className="quick-add-close"
            onClick={onClose}
            aria-label={t("action.cancel")}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleQuickSave} className="quick-add-body">
          <input
            ref={inputRef}
            type="text"
            className={`quick-add-input${isArabic ? " is-arabic" : ""}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t("quickAdd.placeholder")}
            dir={isArabic ? "rtl" : "ltr"}
            autoComplete="off"
          />

          <div className="quick-add-actions">
            <button
              type="button"
              className="quick-add-detail-btn"
              onClick={() => {
                if (onOpenDetailed) {
                  onClose();
                  onOpenDetailed(initialItem);
                } else {
                  setIsDetailed(true);
                }
              }}
            >
              <SlidersHorizontal className="quick-add-btn-icon" aria-hidden="true" />
              <span>{t("quickAdd.detail")}</span>
            </button>

            <button
              type="submit"
              className="quick-add-save-btn"
              disabled={!hasText || saving}
            >
              {saving ? "..." : t("quickAdd.save")}
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
}
