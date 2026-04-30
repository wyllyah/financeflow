import { useSettings } from "../contexts/useSettings";

export function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}) {
  const { getAccentClasses, isCompact } = useSettings();
  const accent = getAccentClasses();
  const variants = {
    primary: `${accent.button} disabled:bg-slate-700 disabled:text-slate-400`,
    secondary:
      "border border-slate-700 bg-slate-900/70 text-slate-200 shadow-sm shadow-black/30 hover:border-cyan-400/40 hover:bg-slate-800/80 hover:text-cyan-100 focus-visible:ring-cyan-400 disabled:text-slate-500",
    danger:
      "bg-rose-500 text-white shadow-sm shadow-rose-950/30 hover:bg-rose-400 focus-visible:ring-rose-400 disabled:bg-rose-950 disabled:text-rose-300",
    ghost:
      "text-slate-400 hover:bg-slate-800/70 hover:text-cyan-100 focus-visible:ring-cyan-400 disabled:text-slate-600",
  };

  const sizes = {
    sm: isCompact ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-xs",
    md: isCompact ? "h-10 px-3.5 text-sm" : "h-11 px-4 text-sm",
    lg: isCompact ? "h-11 px-4 text-sm" : "h-12 px-5 text-sm",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
