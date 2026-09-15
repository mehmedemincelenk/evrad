"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_CLOSE_MS = 4000;

export function useTransientMenu() {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current === null) return;
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const closeMenu = useCallback(() => {
    clearTimer();
    openRef.current = false;
    setOpen(false);
  }, [clearTimer]);

  const registerActivity = useCallback(() => {
    if (!openRef.current) return;
    clearTimer();
    timeoutRef.current = window.setTimeout(closeMenu, AUTO_CLOSE_MS);
  }, [clearTimer, closeMenu]);

  const openMenu = useCallback(() => {
    openRef.current = true;
    setOpen(true);
    registerActivity();
  }, [registerActivity]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, open]);

  useEffect(() => clearTimer, [clearTimer]);

  return { open, openMenu, closeMenu, registerActivity };
}
