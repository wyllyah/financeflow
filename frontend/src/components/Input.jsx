import { forwardRef } from "react";
import { useSettings } from "../contexts/useSettings";

export const Input = forwardRef(function Input(
  { id, label, error, className = "", icon: Icon, rightElement, ...props },
  ref
) {
  const { isCompact } = useSettings();

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/70"
          />
        )}
        <input
          id={id}
          ref={ref}
          className={`${isCompact ? "h-10" : "h-11"} w-full rounded-lg border border-slate-800 bg-slate-950/65 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-500 ${Icon ? "pl-10" : ""} ${rightElement ? "pr-11" : ""} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  );
});
