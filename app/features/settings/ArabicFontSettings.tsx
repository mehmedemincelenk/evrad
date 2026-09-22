"use client";

import { useAppRuntime } from "../../core/AppRuntimeContext";
import {
  ARABIC_FONTS,
  ARABIC_FONT_SAMPLE,
  formatArabicDiacritics,
  type ArabicFontDefinition,
} from "../../core/arabic-fonts";
import { t } from "../../core/i18n";
import { isFontAvailable, useArabicFont, useArabicFontPreviews } from "../../hooks/useArabicFont";
import { triggerHaptic } from "../../components/TrackerPrimitives";

export function ArabicFontSettings() {
  const {
    showToast,
    showDiacritics,
    setShowDiacritics,
    showTranslations,
    setShowTranslations,
    hapticEnabled,
    setHapticEnabled,
    dayResetTime,
    setDayResetTime,
    fontSizeScale,
    setFontSizeScale,
    lineHeight,
    setLineHeight,
  } = useAppRuntime();

  const { activeFontId, loadingFontId, selectFont } = useArabicFont(showToast);
  const previewsReady = useArabicFontPreviews();
  const sampleText = formatArabicDiacritics(ARABIC_FONT_SAMPLE, showDiacritics);

  const handleToggleHaptic = () => {
    setHapticEnabled((prev) => {
      const next = !prev;
      if (next) triggerHaptic(true, 25);
      return next;
    });
  };

  return (
    <div className="settings-stack">
      {/* Flat ayarlar listesi - doğrudan arka plan (bg) */}
      <div className="settings-flat-group" role="region" aria-label="Temel Ayarlar">
        {/* 1. Yazı Boyutu (Sayı Doğrusu) */}
        <div className="settings-flat-row">
          <label htmlFor="settings-font-size-slider" className="settings-flat-label">
            {t("settings.fontSizeTitle")}
          </label>
          <div className="settings-slider-wrap">
            <input
              id="settings-font-size-slider"
              type="range"
              min="80"
              max="135"
              step="1"
              value={fontSizeScale}
              onChange={(e) => setFontSizeScale(Number(e.target.value))}
              className="settings-slider"
              aria-label={t("settings.fontSizeTitle")}
            />
          </div>
        </div>

        {/* 2. Arapça Satır Aralığı (Sayı Doğrusu) */}
        <div className="settings-flat-row">
          <label htmlFor="settings-line-height-slider" className="settings-flat-label">
            {t("settings.lineHeightTitle")}
          </label>
          <div className="settings-slider-wrap">
            <input
              id="settings-line-height-slider"
              type="range"
              min="1.3"
              max="2.4"
              step="0.05"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="settings-slider"
              aria-label={t("settings.lineHeightTitle")}
            />
          </div>
        </div>

        {/* 3. Türkçe Anlamları Göster */}
        <div className="settings-flat-row">
          <span className="settings-flat-label">{t("settings.translationsTitle")}</span>
          <button
            type="button"
            role="switch"
            aria-checked={showTranslations}
            className={`settings-toggle-switch${showTranslations ? " is-active" : ""}`}
            onClick={() => {
              triggerHaptic(hapticEnabled, 15);
              setShowTranslations((prev) => !prev);
            }}
            aria-label={t("settings.translationsTitle")}
          >
            <span className="toggle-thumb" aria-hidden="true" />
          </button>
        </div>

        {/* 4. Arapça Harekeler */}
        <div className="settings-flat-row">
          <span className="settings-flat-label">{t("settings.diacriticsSection")}</span>
          <button
            type="button"
            role="switch"
            aria-checked={showDiacritics}
            className={`settings-toggle-switch${showDiacritics ? " is-active" : ""}`}
            onClick={() => {
              triggerHaptic(hapticEnabled, 15);
              setShowDiacritics((prev) => !prev);
            }}
            aria-label={t(showDiacritics ? "settings.diacriticsOn" : "settings.diacriticsOff")}
          >
            <span className="toggle-thumb" aria-hidden="true" />
          </button>
        </div>

        {/* 5. Dokunma & Hissiyat */}
        <div className="settings-flat-row">
          <span className="settings-flat-label">{t("settings.hapticSection")}</span>
          <button
            type="button"
            role="switch"
            aria-checked={hapticEnabled}
            className={`settings-toggle-switch${hapticEnabled ? " is-active" : ""}`}
            onClick={handleToggleHaptic}
            aria-label={t("settings.hapticSection")}
          >
            <span className="toggle-thumb" aria-hidden="true" />
          </button>
        </div>

        {/* 6. Günlük Tertip (Sıfırlama Saati) */}
        <div className="settings-flat-row">
          <label htmlFor="settings-day-reset-time" className="settings-flat-label">
            {t("settings.routineSection")}
          </label>
          <div className="settings-time-wrap">
            <input
              id="settings-day-reset-time"
              type="time"
              className="settings-time-input"
              value={dayResetTime}
              onChange={(e) => {
                triggerHaptic(hapticEnabled, 15);
                setDayResetTime(e.target.value || "00:00");
              }}
              aria-label={t("settings.routineSection")}
            />
          </div>
        </div>
      </div>

      {/* 7. Arapça Yazı Tipi */}
      <section className="settings-fonts-section" aria-labelledby="arabic-font-title">
        <div className="settings-section-header">
          <h2 id="arabic-font-title" className="settings-section-title">
            {t("settings.arabicFontSection")}
          </h2>
        </div>

        <div className="font-row-list" role="radiogroup" aria-labelledby="arabic-font-title">
          {ARABIC_FONTS.map((font) => (
            <FontOptionRow
              key={font.id}
              font={font}
              sampleText={sampleText}
              isSelected={activeFontId === font.id}
              isLoading={loadingFontId === font.id}
              isFontPreviewReady={!font.googleFontFamily || previewsReady || isFontAvailable(font)}
              onSelect={() => {
                triggerHaptic(hapticEnabled, 15);
                selectFont(font.id);
              }}
            />
          ))}
        </div>
      </section>

      {/* 8. İletişim & Geri Bildirim */}
      <footer className="settings-contact-footer">
        <a href="mailto:mehmedcelenk@gmail.com" className="settings-contact-link">
          mehmedcelenk@gmail.com
        </a>
      </footer>
    </div>
  );
}

function FontOptionRow({
  font,
  sampleText,
  isSelected,
  isLoading,
  isFontPreviewReady,
  onSelect,
}: {
  font: ArabicFontDefinition;
  sampleText: string;
  isSelected: boolean;
  isLoading: boolean;
  isFontPreviewReady: boolean;
  onSelect: () => void;
}) {
  const sampleFontFamily = `"${font.fontFamily}", "Noto Naskh Arabic", Arial, sans-serif`;

  return (
    <button
      type="button"
      className={`font-row-item${isSelected ? " is-selected" : ""}${isLoading ? " is-loading" : ""}`}
      onClick={onSelect}
      disabled={isLoading}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${font.name} · ${font.styleCategory}`}
    >
      <div className="font-row-info">
        <span className="font-row-name">{font.name}</span>
        <span className="font-row-style">{font.styleCategory}</span>
      </div>

      <div className="font-row-end">
        <span
          className={`font-row-sample${isFontPreviewReady ? "" : " is-preview-loading"}`}
          lang="ar"
          dir="rtl"
          style={{ fontFamily: sampleFontFamily }}
        >
          {sampleText}
        </span>
        <div className="font-row-checkbox" aria-hidden="true">
          {isLoading ? (
            <span className="font-loading-spinner" />
          ) : (
            <span className={`font-checkbox-box${isSelected ? " is-checked" : ""}`} />
          )}
        </div>
      </div>
    </button>
  );
}
