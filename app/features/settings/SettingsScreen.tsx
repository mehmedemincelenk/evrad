"use client";

import { t } from "../../core/i18n";
import { ArabicFontSettings } from "./ArabicFontSettings";

export function SettingsScreen() {
  return (
    <div className="settings-screen">
      <header className="screen-heading">
        <p className="eyebrow">{t("settings.eyebrow")}</p>
        <div className="screen-heading-main">
          <h1 id="page-title">{t("settings.title")}</h1>
        </div>
      </header>

      <ArabicFontSettings />
    </div>
  );
}
