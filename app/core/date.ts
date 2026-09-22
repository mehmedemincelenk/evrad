export const DAY_RESET_TIME_STORAGE_KEY = "evrad_day_reset_time";

export function getDayResetTime(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(DAY_RESET_TIME_STORAGE_KEY) ?? "00:00";
  }
  return "00:00";
}

export function getLocalDateKey(date = new Date(), resetTime = "00:00"): string {
  const parts = resetTime.split(":").map(Number);
  const resetHour = parts[0] || 0;
  const resetMinute = parts[1] || 0;

  const adjusted = new Date(date.getTime());

  if (resetHour > 0 || resetMinute > 0) {
    const currentMinutes = date.getHours() * 60 + date.getMinutes();
    const resetMinutes = resetHour * 60 + resetMinute;
    if (currentMinutes < resetMinutes) {
      adjusted.setDate(adjusted.getDate() - 1);
    }
  }

  const year = adjusted.getFullYear();
  const month = String(adjusted.getMonth() + 1).padStart(2, "0");
  const day = String(adjusted.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
