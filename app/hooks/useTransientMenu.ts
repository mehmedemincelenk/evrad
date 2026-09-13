"use client";

import { useCallback, useState } from "react";

export function useTransientMenu() {
  const [open, setOpen] = useState(false);
  const [activityKey, setActivityKey] = useState(0);
  const registerActivity = useCallback(() => setActivityKey((value) => value + 1), []);
  const openMenu = useCallback(() => {
    setOpen(true);
    registerActivity();
  }, [registerActivity]);
  const closeMenu = useCallback(() => setOpen(false), []);

  return { open, activityKey, openMenu, closeMenu, registerActivity };
}
