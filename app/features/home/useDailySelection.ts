"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalDay } from "../../hooks/useLocalDay";
import { devotionalRepositories } from "../../data/repositories";
import type { DailyLibraries, DailySelection, StoredDailySelection } from "./daily-selection";
import { createDailySelection, restoreSelection, serializeSelection } from "./daily-selection";

const STORAGE_KEY = "zikirlerim.daily-selection.v1";

export function useDailySelection() {
  const date = useLocalDay();
  const librariesRef = useRef<DailyLibraries | null>(null);
  const storedRef = useRef<StoredDailySelection | null>(null);
  const [selection, setSelection] = useState<DailySelection | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      devotionalRepositories.dhikr.load(),
      devotionalRepositories.prayers.load(),
      devotionalRepositories.memorization.load(),
      devotionalRepositories.poetry.load(),
    ]).then(([dhikr, prayers, memorization, poetry]) => {
      if (!active) return;
      const libraries = {
        dhikr: dhikr.filter((item) => item.inVirds),
        prayers: prayers.filter((item) => item.inVirds),
        memorization: memorization.filter((item) => item.inVirds),
        poetry: poetry.filter((item) => item.inVirds),
      };
      librariesRef.current = libraries;
      const stored = readStoredSelection();
      const restored = stored?.date === date ? restoreSelection(stored, libraries) : null;
      const next = restored ?? createDailySelection(libraries, stored?.signature);
      const serialized = serializeSelection(date, next);
      storedRef.current = serialized;
      writeStoredSelection(serialized);
      setSelection(next);
      setReady(true);
    }).catch(() => setReady(true));
    return () => { active = false; };
  }, [date]);

  const refresh = useCallback(() => {
    const libraries = librariesRef.current;
    if (!libraries) return;
    const next = createDailySelection(libraries, storedRef.current?.signature);
    const serialized = serializeSelection(date, next);
    storedRef.current = serialized;
    writeStoredSelection(serialized);
    setSelection(next);
  }, [date]);

  return { ready, selection, refresh };
}

function readStoredSelection(): StoredDailySelection | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as StoredDailySelection : null;
  } catch {
    return null;
  }
}

function writeStoredSelection(selection: StoredDailySelection) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // Günün sayfası depolama kapalıyken de bu oturumda çalışır.
  }
}
