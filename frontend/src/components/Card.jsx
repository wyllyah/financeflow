import { useSettings } from "../contexts/useSettings";

export function Card({ children, className = "" }) {
  const { isCompact } = useSettings();

  return (
    <section
      className={`rounded-xl border border-slate-800/80 bg-slate-900/45 ${isCompact ? "p-4" : "p-5"} shadow-[0_18px_60px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}
