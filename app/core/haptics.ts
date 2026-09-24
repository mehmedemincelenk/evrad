export function triggerHaptic(enabled: boolean, durationMs = 15): void {
  if (!enabled || typeof navigator === "undefined" || !navigator.vibrate) return;
  try { navigator.vibrate(durationMs); } catch { /* Unsupported by some browsers. */ }
}
