"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { appSections, type AppSection } from "../core/module-registry";

const MIN_SWIPE_DISTANCE = 50;
const MAX_VERTICAL_DEVIATION = 45;
const MAX_SWIPE_TIME_MS = 600;

export function useSwipeNavigation(section: AppSection | "settings", enabled = true) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const isSectionRoot = appSections.some((item) => item.route === pathname);
    if (!isSectionRoot) return;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        touchStartRef.current = null;
        return;
      }
      if (
        document.body.classList.contains("is-sorting") ||
        (event.target as HTMLElement | null)?.closest("input, textarea, select, [role='dialog'], .collection-choice-overlay, .bottom-navigation")
      ) {
        touchStartRef.current = null;
        return;
      }
      touchStartRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        time: Date.now(),
      };
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!touchStartRef.current) return;
      if (document.body.classList.contains("is-sorting")) {
        touchStartRef.current = null;
        return;
      }
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const duration = Date.now() - touchStartRef.current.time;
      touchStartRef.current = null;

      if (duration > MAX_SWIPE_TIME_MS) return;
      if (Math.abs(deltaY) > Math.abs(deltaX) * 0.8 || Math.abs(deltaY) > MAX_VERTICAL_DEVIATION) return;
      if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE) return;

      const currentIndex = appSections.findIndex((item) => item.id === section);
      if (currentIndex === -1) return;

      if (deltaX < 0 && currentIndex < appSections.length - 1) {
        router.push(appSections[currentIndex + 1].route);
      } else if (deltaX > 0 && currentIndex > 0) {
        router.push(appSections[currentIndex - 1].route);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, pathname, router, section]);
}

