"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { t } from "../core/i18n";
import { appSections, createRecordRoute, type AppSection } from "../core/module-registry";
import { NavigationGlyph } from "./NavigationGlyph";

export function BottomNavigation({ section }: { section: AppSection }) {
  return (
    <nav className="bottom-navigation" aria-label={t("menu.label")}>
      <div className="bottom-base-row">
        <div className="bottom-space-segment bottom-primary-segment">
          {appSections.map((item) => (
            <Link key={item.id} href={item.route}
              className={`bottom-space-option${section === item.id ? " is-selected" : ""}`}
              aria-label={t(item.label)} aria-current={section === item.id ? "page" : undefined}
              title={t(item.label)}>
              <NavigationGlyph name={item.icon} />
            </Link>
          ))}
        </div>
        <Link className="bottom-nav-button bottom-add" href={createRecordRoute} aria-label={t("menu.addBag")} title={t("menu.addBag")}>
          <Plus className="navigation-glyph" aria-hidden="true" strokeWidth={1.8} />
        </Link>
      </div>
    </nav>
  );
}
