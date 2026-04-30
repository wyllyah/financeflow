import { Check } from "lucide-react";

export function SettingsOption({
  active,
  description,
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
        active
          ? "border-cyan-400 bg-cyan-400/10 text-white"
          : "border-slate-800 bg-slate-950/45 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70"
      }`}
    >
      {Icon && (
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            active ? "bg-cyan-400/15 text-cyan-300" : "bg-slate-900 text-slate-400"
          }`}
        >
          <Icon size={18} />
        </div>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {description && (
          <span className="mt-1 block text-xs leading-5 text-slate-400">
            {description}
          </span>
        )}
      </span>
      {active && <Check className="mt-1 shrink-0 text-cyan-300" size={18} />}
    </button>
  );
}
