"use client";

import { useEffect, useState } from "react";
import { getLocalDateKey } from "../core/date";

export function useLocalDay() {
  const [dateKey, setDateKey] = useState(() => getLocalDateKey());
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const checkDate = () => {
      const nextDate = new Date();
      setToday(nextDate);
      setDateKey(getLocalDateKey(nextDate));
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
  }, []);

  return { dateKey, today };
}
