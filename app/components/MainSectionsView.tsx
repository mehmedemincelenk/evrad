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

const navigationTargets: readonly MainSectionTarget[] = [
  "create",
  "virds",
  "favorites",
  "discover",
  "settings",
];

export function MainSectionsView({ initialSection }: { initialSection: MainSectionTarget }) {
  const [activeSection, setActiveSection] = useState<MainSectionTarget>(initialSection);
  const [isCreateMounted, setIsCreateMounted] = useState<boolean>(initialSection === "create");
  const [createInitialItem, setCreateInitialItem] = useState<DevotionalItem | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScroll = useRef(false);
  const previousSectionRef = useRef<MainSectionTarget>(
    initialSection === "create" || initialSection === "settings" ? "virds" : initialSection,
  );

  const getSectionIndex = useCallback((sec: MainSectionTarget) => {
    const idx = navigationTargets.indexOf(sec);
    return idx >= 0 ? idx : 1;
  }, []);

  const scrollToSection = useCallback(
    (targetSection: MainSectionTarget, smooth = true) => {
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
        if (prev !== targetSection && prev !== "create" && prev !== "settings") {
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

  useEffect(() => {
    const initialIndex = getSectionIndex(initialSection);
    const viewport = viewportRef.current;
    if (!viewport) return;

    const setPosition = () => {
      const width = viewport.clientWidth;
      if (width > 0) {
        viewport.scrollLeft = initialIndex * width;
      }
    };

    setPosition();
    const raf = requestAnimationFrame(setPosition);
    const timer = window.setTimeout(setPosition, 60);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [getSectionIndex, initialSection]);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    const viewport = viewportRef.current;
    if (!viewport || viewport.clientWidth === 0) return;
    const currentIndex = Math.round(viewport.scrollLeft / viewport.clientWidth);
    const resolvedSection = navigationTargets[currentIndex];
    if (resolvedSection && resolvedSection !== activeSection) {
      setActiveSection((prev) => {
        if (prev !== resolvedSection && prev !== "create" && prev !== "settings") {
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
  }, [activeSection]);

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
    const target = previousSectionRef.current || "virds";
    scrollToSection(target, true);
    window.setTimeout(() => {
      setIsCreateMounted(false);
      setCreateInitialItem(null);
    }, 450);
  }, [scrollToSection]);

  const handleOpenDetailed = useCallback(
    (item: DevotionalItem | null) => {
      setIsCreateMounted(true);
      setCreateInitialItem(item);
      requestAnimationFrame(() => {
        scrollToSection("create", true);
      });
    },
    [scrollToSection],
  );

  return (
    <AppShell
      section={activeSection}
      onSelectSection={(sec) => scrollToSection(sec, true)}
      onOpenDetailed={handleOpenDetailed}
    >
      <div
        ref={viewportRef}
        className="main-swipe-viewport"
        onScroll={handleScroll}
        aria-live="polite"
      >
        <div className="main-swipe-page" data-section="create" data-active={activeSection === "create"}>
          {isCreateMounted ? (
            <RecordCreateScreen
              initialItem={createInitialItem}
              onClose={handleReturnFromCreate}
              onSaved={handleReturnFromCreate}
            />
          ) : null}
        </div>
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
    </AppShell>
  );
}
