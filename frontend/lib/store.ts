import type { Settings } from "./types";

const SETTINGS_KEY = "ai-analyst-settings";

export function getSettings(): Settings | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearSettings(): void {
  localStorage.removeItem(SETTINGS_KEY);
}
