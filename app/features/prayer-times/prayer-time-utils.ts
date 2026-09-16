import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
export interface StoredCoordinates { latitude: number; longitude: number }
export interface NextPrayer { key: PrayerKey; at: Date }

const prayerKeys: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function getNextPrayer(position: StoredCoordinates, now: Date): NextPrayer {
  const coordinates = new Coordinates(position.latitude, position.longitude);
  const params = CalculationMethod.Turkey();
  const today = new PrayerTimes(coordinates, now, params);
  for (const key of prayerKeys) {
    const at = today[key];
    if (at.getTime() > now.getTime()) return { key, at };
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { key: "fajr", at: new PrayerTimes(coordinates, tomorrow, params).fajr };
}

export function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}
