/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEYS,
  SettingsContext,
  accentStyles,
} from "./settings";

function getStoredValue(key, fallback) {
  const value = localStorage.getItem(key) || fallback;

  if (key === SETTINGS_KEYS.theme && value === "dark") {
    return "blue-dark";
  }

  return value;
}

function getStoredConfirmDelete() {
  return localStorage.getItem(SETTINGS_KEYS.confirmDelete) !== "false";
}

function applyThemePreference(theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const effectiveTheme =
    theme === "system" ? (prefersDark ? "blue-dark" : "light") : theme;
  const shouldUseDark = effectiveTheme !== "light";

  root.classList.toggle("dark", shouldUseDark);
  root.classList.toggle("theme-light", !shouldUseDark);
  root.classList.toggle("theme-dark", shouldUseDark);
  root.dataset.theme = effectiveTheme;
}

function applyDocumentPreference(name, value) {
  document.documentElement.dataset[name] = value;
}

export function SettingsProvider({ children }) {
  const [theme, updateTheme] = useState(() =>
    getStoredValue(SETTINGS_KEYS.theme, DEFAULT_SETTINGS.theme)
  );
  const [accent, updateAccent] = useState(() =>
    getStoredValue(SETTINGS_KEYS.accent, DEFAULT_SETTINGS.accent)
  );
  const [density, updateDensity] = useState(() =>
    getStoredValue(SETTINGS_KEYS.density, DEFAULT_SETTINGS.density)
  );
  const [currency, updateCurrency] = useState(() =>
    getStoredValue(SETTINGS_KEYS.currency, DEFAULT_SETTINGS.currency)
  );
  const [confirmDelete, updateConfirmDelete] = useState(getStoredConfirmDelete);

  useEffect(() => {
    applyThemePreference(theme);

    if (theme !== "system") {
      return undefined;
    }

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");

    if (!media) {
      return undefined;
    }

    function handleSystemThemeChange() {
      applyThemePreference("system");
    }

    media.addEventListener("change", handleSystemThemeChange);

    return () => {
      media.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  useEffect(() => {
    applyDocumentPreference("accent", accent);
  }, [accent]);

  useEffect(() => {
    applyDocumentPreference("density", density);
  }, [density]);

  const setTheme = useCallback((value) => {
    const normalizedValue = value === "dark" ? "blue-dark" : value;
    localStorage.setItem(SETTINGS_KEYS.theme, normalizedValue);
    updateTheme(normalizedValue);
  }, []);

  const setAccent = useCallback((value) => {
    localStorage.setItem(SETTINGS_KEYS.accent, value);
    updateAccent(value);
  }, []);

  const setDensity = useCallback((value) => {
    localStorage.setItem(SETTINGS_KEYS.density, value);
    updateDensity(value);
  }, []);

  const setCurrency = useCallback((value) => {
    localStorage.setItem(SETTINGS_KEYS.currency, value);
    updateCurrency(value);
    window.dispatchEvent(new Event("financeflow:currency-change"));
  }, []);

  const setConfirmDelete = useCallback((value) => {
    const normalizedValue = Boolean(value);
    localStorage.setItem(SETTINGS_KEYS.confirmDelete, String(normalizedValue));
    updateConfirmDelete(normalizedValue);
  }, []);

  const resetSettings = useCallback(() => {
    Object.values(SETTINGS_KEYS).forEach((key) => localStorage.removeItem(key));

    updateTheme(DEFAULT_SETTINGS.theme);
    updateAccent(DEFAULT_SETTINGS.accent);
    updateDensity(DEFAULT_SETTINGS.density);
    updateCurrency(DEFAULT_SETTINGS.currency);
    updateConfirmDelete(DEFAULT_SETTINGS.confirmDelete);
    window.dispatchEvent(new Event("financeflow:currency-change"));
  }, []);

  const getAccentClasses = useCallback(
    () => accentStyles[accent] || accentStyles.cyan,
    [accent]
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      accent,
      setAccent,
      density,
      setDensity,
      currency,
      setCurrency,
      confirmDelete,
      setConfirmDelete,
      resetSettings,
      getAccentClasses,
      isCompact: density === "compact",
    }),
    [
      theme,
      setTheme,
      accent,
      setAccent,
      density,
      setDensity,
      currency,
      setCurrency,
      confirmDelete,
      setConfirmDelete,
      resetSettings,
      getAccentClasses,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export { useSettings } from "./useSettings";
