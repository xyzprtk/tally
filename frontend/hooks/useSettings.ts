"use client";

import { useState, useEffect, useCallback } from "react";
import type { Settings, Provider } from "@/lib/types";
import { getSettings, setSettings, clearSettings } from "@/lib/store";

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSettingsState(getSettings());
  }, []);

  const save = useCallback((s: Settings) => {
    setSettings(s);
    setSettingsState(s);
    setIsOpen(false);
  }, []);

  const clear = useCallback(() => {
    clearSettings();
    setSettingsState(null);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { settings, isOpen, save, clear, open, close };
}
