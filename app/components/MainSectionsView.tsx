"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "../AppShell";
import { getSectionRoute, type AppSection } from "../core/module-registry";
import type { DevotionalItem } from "../core/types";
import { CollectionScreen } from "../features/collections/CollectionApp";
import { RecordCreateScreen } from "../features/collections/RecordCreateApp";
import { DiscoveryScreen } from "../features/discovery/DiscoveryApp";
import { SettingsScreen } from "../features/settings/SettingsScreen";

export type MainSectionTarget = "create" | AppSection | "settings";

const navigationTargets: readonly (AppSection | "settings")[] = [
  "virds",
  "favorites",
  "discover",
  "settings",
];

export function MainSectionsView({ initialSection }: { initialSection: MainSectionTarget }) {
  const initialActive = initialSection === "create" ? "virds" : initialSection;
  const [activeSection, setActiveSection] = useState<AppSection | "settings">(initialActive);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(initialSection === "create");
  const [isCreateClosing, setIsCreateClosing] = useState(false);
  const [createInitialItem, setCreateInitialItem] = useState<DevotionalItem | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScroll = useRef(false);
  const previousSectionRef = useRef<AppSection | "settings">(initialActive);

  const getSectionIndex = useCallback((sec: AppSection | "settings") => {
    const idx = navigationTargets.indexOf(sec);
    return idx >= 0 ? idx : 0;
  }, []);

  const scrollToSection = useCallback(
    (targetSection: AppSection | "settings", smooth = true) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const index = getSectionIndex(targetSection);
      const targetLeft = index * viewport.clientWidth;
      isProgrammaticScroll.current = true;
      viewport.scrollTo({
        left: targetLeft,
        behavior: smooth ? "smooth" : "instant",
      });
      setActiveSection((prev) => {
        if (prev !== targetSection && prev !== "settings") {
          previousSectionRef.current = prev;
        }
        return targetSection;
      });
      if (typeof window !== "undefined") {
        const route = getSectionRoute(targetSection);
        if (window.location.pathname !== route) {
          window.history.replaceState(null, "", route);
        }
      }
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, smooth ? 400 : 50);
    },
    [getSectionIndex],
  );

  const rafId = useRef<number | null>(null);

  const updateVisualEffects = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || viewport.clientWidth === 0) return;
    const width = viewport.clientWidth;
    const scrollLeft = viewport.scrollLeft;
    const pages = viewport.querySelectorAll<HTMLElement>(".main-swipe-page");
    for (let i = 0; i < pages.length; i++) {
      const distance = Math.abs(scrollLeft - i * width);
      const ratio = Math.min(1, distance / width);
      pages[i].style.setProperty("--page-dist", ratio.toFixed(3));
    }
  }, []);

  useEffect(() => {
    const initialIndex = getSectionIndex(initialActive);
    const viewport = viewportRef.current;
    if (!viewport) return;

    const setPosition = () => {
      const width = viewport.clientWidth;
      if (width > 0) {
        viewport.scrollLeft = initialIndex * width;
        updateVisualEffects();
      }
    };

    setPosition();
    const raf = requestAnimationFrame(setPosition);
    const timer = window.setTimeout(setPosition, 60);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [getSectionIndex, initialActive, updateVisualEffects]);

  const handleScroll = useCallback(() => {
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(() => {
        updateVisualEffects();
        rafId.current = null;
      });
    }

    if (isProgrammaticScroll.current) return;
    const viewport = viewportRef.current;
    if (!viewport || viewport.clientWidth === 0) return;
    const currentIndex = Math.round(viewport.scrollLeft / viewport.clientWidth);
    const resolvedSection = navigationTargets[currentIndex];
    if (resolvedSection && resolvedSection !== activeSection) {
      setActiveSection((prev) => {
        if (prev !== resolvedSection && prev !== "settings") {
          previousSectionRef.current = prev;
        }
        return resolvedSection;
      });
      if (typeof window !== "undefined") {
        const route = getSectionRoute(resolvedSection);
        if (window.location.pathname !== route) {
          window.history.replaceState(null, "", route);
        }
      }
    }
  }, [activeSection, updateVisualEffects]);

  useEffect(() => {
    const onResize = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const index = getSectionIndex(activeSection);
      viewport.scrollLeft = index * viewport.clientWidth;
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [activeSection, getSectionIndex]);

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      const target = navigationTargets.find((t) => getSectionRoute(t) === path);
      if (target) {
        scrollToSection(target, true);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [scrollToSection]);

  const handleReturnFromCreate = useCallback(() => {
    setIsCreateClosing(true);
    window.setTimeout(() => {
      setIsCreateOpen(false);
      setIsCreateClosing(false);
      setCreateInitialItem(null);
    }, 280);
  }, []);

  const handleOpenDetailed = useCallback(
    (item: DevotionalItem | null) => {
      setCreateInitialItem(item);
      setIsCreateOpen(true);
      setIsCreateClosing(false);
    },
    [],
  );

  return (
    <AppShell
      section={isCreateOpen ? "create" : activeSection}
      onSelectSection={(sec) => {
        if (isCreateOpen) {
          handleReturnFromCreate();
        }
        if (sec !== "create") {
          scrollToSection(sec, true);
        }
      }}
      onOpenDetailed={handleOpenDetailed}
    >
      <div
        ref={viewportRef}
        className="main-swipe-viewport"
        onScroll={handleScroll}
        aria-live="polite"
      >
        <div className="main-swipe-page" data-section="virds" data-active={activeSection === "virds"}>
          <CollectionScreen collection="virds" />
        </div>
        <div className="main-swipe-page" data-section="favorites" data-active={activeSection === "favorites"}>
          <CollectionScreen collection="favorites" />
        </div>
        <div className="main-swipe-page" data-section="discover" data-active={activeSection === "discover"}>
          <DiscoveryScreen />
        </div>
        <div className="main-swipe-page" data-section="settings" data-active={activeSection === "settings"}>
          <SettingsScreen />
        </div>
      </div>

      {isCreateOpen ? (
        <div className={`create-slide-container ${isCreateClosing ? "is-closing" : "is-open"}`}>
          <RecordCreateScreen
            initialItem={createInitialItem}
            onClose={handleReturnFromCreate}
            onSaved={handleReturnFromCreate}
          />
        </div>
      ) : null}
    </AppShell>
  );
}
