"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollDirection({
  threshold = 12,
  minScroll = 30,
}: {
  threshold?: number;
  minScroll?: number;
} = {}) {
  const [scrollDown, setScrollDown] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollY.current = window.scrollY;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= minScroll) {
        setScrollDown(false);
        lastScrollY.current = currentScrollY;
        ticking.current = false;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) >= threshold) {
        setScrollDown(diff > 0);
        lastScrollY.current = currentScrollY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [minScroll, threshold]);

  return scrollDown;
}

