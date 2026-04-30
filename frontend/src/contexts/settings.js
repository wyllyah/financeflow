import { createContext } from "react";

export const SETTINGS_KEYS = {
  theme: "@financeflow:theme",
  accent: "@financeflow:accent",
  density: "@financeflow:density",
  currency: "@financeflow:currency",
  confirmDelete: "@financeflow:confirmDelete",
};

export const DEFAULT_SETTINGS = {
  theme: "system",
  accent: "cyan",
  density: "comfortable",
  currency: "BRL",
  confirmDelete: true,
};

export const accentStyles = {
  blue: {
    name: "Azul",
    dot: "bg-blue-400",
    text: "text-blue-300",
    border: "border-blue-400/35",
    soft: "bg-blue-400/10",
    active: "border-blue-400 bg-blue-400/10 text-blue-200",
    button:
      "bg-blue-400 text-slate-950 shadow-[0_0_24px_rgba(96,165,250,0.22)] hover:bg-blue-300 focus-visible:ring-blue-400",
  },
  cyan: {
    name: "Ciano",
    dot: "bg-cyan-400",
    text: "text-cyan-300",
    border: "border-cyan-400/35",
    soft: "bg-cyan-400/10",
    active: "border-cyan-400 bg-cyan-400/10 text-cyan-200",
    button:
      "bg-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)] hover:bg-cyan-300 focus-visible:ring-cyan-400",
  },
  emerald: {
    name: "Verde",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    border: "border-emerald-400/35",
    soft: "bg-emerald-400/10",
    active: "border-emerald-400 bg-emerald-400/10 text-emerald-200",
    button:
      "bg-emerald-400 text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.22)] hover:bg-emerald-300 focus-visible:ring-emerald-400",
  },
  violet: {
    name: "Roxo",
    dot: "bg-violet-400",
    text: "text-violet-300",
    border: "border-violet-400/35",
    soft: "bg-violet-400/10",
    active: "border-violet-400 bg-violet-400/10 text-violet-200",
    button:
      "bg-violet-400 text-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.22)] hover:bg-violet-300 focus-visible:ring-violet-400",
  },
};

export const SettingsContext = createContext(null);
