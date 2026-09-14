"use client";

import { useState } from "react";
import { getModuleRoute, modules } from "../../core/module-registry";
import { t } from "../../core/i18n";
import type { ContentSpace } from "../../core/types";
import Link from "next/link";

export function HomeScreen() {
  const [space, setSpace] = useState<ContentSpace>("library");
  return (
    <section className="future-home" aria-labelledby="home-title">
      <header>
        <p className="eyebrow">ZİKİRLERİM</p>
        <h1 id="home-title">{t("home.title")}</h1>
        <p>{t("home.subtitle")}</p>
      </header>
      <div className="home-space-toggle" role="group" aria-label={t("menu.spaceLabel")}>
        {(["library", "discover"] as const).map((value) => (
          <button type="button" key={value} className={space === value ? "is-selected" : ""} aria-pressed={space === value} onClick={() => setSpace(value)}>
            {t(value === "library" ? "menu.library" : "menu.discover")}
          </button>
        ))}
      </div>
      <div className="home-modules">
        {modules.map((module) => (
          <Link href={getModuleRoute(module.id, space)} key={module.id}>{t(module.translationKey)}<span aria-hidden="true">→</span></Link>
        ))}
      </div>
    </section>
  );
}
