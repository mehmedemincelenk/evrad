"use client";

import { useEffect, useState } from "react";
import { getDayResetTime, getLocalDateKey } from "../core/date";

export function useLocalDay(resetTime = getDayResetTime()) {
  const [dateKey, setDateKey] = useState(() => getLocalDateKey(new Date(), resetTime));

  useEffect(() => {
    const checkDate = () => {
      const nextDate = new Date();
      setDateKey(getLocalDateKey(nextDate, resetTime));
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
  }, [resetTime]);

  return dateKey;
}
