"use client";

import { t } from "../../core/i18n";
import { formatCountdown } from "./prayer-time-utils";
import { usePrayerCountdown } from "./usePrayerCountdown";

export function PrayerCountdown() {
  const state = usePrayerCountdown();
  return (
    <section className="prayer-countdown" aria-labelledby="prayer-countdown-title">
      <div className="prayer-countdown-copy">
        <p id="prayer-countdown-title">{state.prayer ? t(`prayer.${state.prayer.key}`) : t("prayer.title")}</p>
        {state.prayer ? (
          <strong aria-live="off">{formatCountdown(state.prayer.at.getTime() - state.now.getTime())}</strong>
        ) : (
          <span>{state.requesting ? t("prayer.loading") : state.denied ? t("prayer.locationDenied") : t("prayer.askLocation")}</span>
        )}
      </div>
      <button type="button" onClick={state.requestLocation} disabled={state.requesting}>
        {t(state.hasPosition ? "prayer.updateLocation" : "prayer.useLocation")}
      </button>
      {state.prayer ? <small>{t("prayer.approximate")}</small> : null}
    </section>
  );
}
