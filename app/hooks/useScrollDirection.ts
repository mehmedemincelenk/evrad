"use client";

import { useEffect, useState } from "react";

export function useScrollDirection({ threshold = 12, minScroll = 30 }: { threshold?: number; minScroll?: number } = {}) {
  const [scrollDown, setScrollDown] = useState(false);
  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (y <= minScroll || Math.abs(y - previousY) >= threshold) {
        setScrollDown(y > minScroll && y > previousY);
        previousY = y;
      }
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); };
  }, [minScroll, threshold]);
  return scrollDown;
}
