"use client";

import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { t } from "../core/i18n";
import { appSections, createRecordRoute, type AppSection } from "../core/module-registry";
import { NavigationGlyph } from "./NavigationGlyph";

export function BottomNavigation({
  section,
  onSelectSection,
  onOpenQuickAdd,
  isScrolledHidden = false,
}: {
  section: AppSection | "settings" | "create";
  onSelectSection?: (section: AppSection | "settings" | "create") => void;
  onOpenQuickAdd?: () => void;
  isScrolledHidden?: boolean;
}) {
  return (
    <nav className={`bottom-navigation${isScrolledHidden ? " is-scrolled-hidden" : ""}`} aria-label={t("menu.label")}>
      <div className="bottom-base-row">
        <div className="bottom-space-segment bottom-primary-segment">
          {appSections.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              className={`bottom-space-option${section === item.id ? " is-selected" : ""}`}
              aria-label={t(item.label)}
              aria-current={section === item.id ? "page" : undefined}
              title={t(item.label)}
              onClick={
                onSelectSection
                  ? (event) => {
                      event.preventDefault();
                      onSelectSection(item.id);
                    }
                  : undefined
              }
            >
              <NavigationGlyph name={item.icon} />
            </Link>
          ))}
        </div>
        <Link
          className={`bottom-nav-button bottom-add${section === "create" ? " is-selected" : ""}`}
          href={createRecordRoute}
          aria-label={t("menu.addBag")}
          title={t("menu.addBag")}
          aria-current={section === "create" ? "page" : undefined}
          onClick={
            onOpenQuickAdd
              ? (event) => {
                  event.preventDefault();
                  onOpenQuickAdd();
                }
              : undefined
          }
        >
          <Plus className="navigation-glyph" aria-hidden="true" strokeWidth={1.8} />
        </Link>
        <Link
          className={`bottom-nav-button bottom-settings${section === "settings" ? " is-selected" : ""}`}
          href="/ayarlar"
          aria-label={t("menu.settings")}
          title={t("menu.settings")}
          aria-current={section === "settings" ? "page" : undefined}
          onClick={
            onSelectSection
              ? (event) => {
                  event.preventDefault();
                  onSelectSection("settings");
                }
              : undefined
          }
        >
          <Settings className="navigation-glyph" aria-hidden="true" strokeWidth={1.8} />
        </Link>
      </div>
    </nav>
  );
}
