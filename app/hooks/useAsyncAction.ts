"use client";

import { useCallback, useRef, useState } from "react";

// The ref closes the gap before React renders a disabled submit button.
export function useAsyncAction() {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const run = useCallback(async (action: () => void | Promise<void>) => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    try { await action(); }
    finally { busy.current = false; setPending(false); }
  }, []);
  return { pending, run };
}
