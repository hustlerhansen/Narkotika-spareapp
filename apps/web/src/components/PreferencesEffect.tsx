"use client";

import { useEffect } from "react";
import { useAppState } from "@/lib/store";

/** Applies display preferences (theme, contrast, motion, text size) to <html>. */
export function PreferencesEffect() {
  const { preferences } = useAppState();
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === "system") delete root.dataset.theme;
    else root.dataset.theme = preferences.theme;
    if (preferences.highContrast) root.dataset.contrast = "high";
    else delete root.dataset.contrast;
    if (preferences.motion === "system") delete root.dataset.motion;
    else root.dataset.motion = preferences.motion;
    root.style.setProperty("--text-scale", String(preferences.textScale));
  }, [preferences]);
  return null;
}
