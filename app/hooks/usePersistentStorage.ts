"use client";

import { useEffect } from "react";

export function usePersistentStorage() {
  useEffect(() => {
    navigator.storage?.persist?.().catch(() => undefined);
  }, []);
}
