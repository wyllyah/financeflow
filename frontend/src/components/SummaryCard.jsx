import { Card } from "./Card";

const colorStyles = {
  slate: {
    icon: "bg-cyan-400/10 text-cyan-300",
    value: "text-white",
  },
  emerald: {
    icon: "bg-emerald-400/10 text-emerald-300",
    value: "text-emerald-300",
  },
  rose: {
    icon: "bg-rose-400/10 text-rose-300",
    value: "text-rose-300",
  },
  amber: {
    icon: "bg-amber-400/10 text-amber-300",
    value: "text-amber-300",
  },
};

export function SummaryCard({ title, value, icon: Icon, color = "slate" }) {
  const styles = colorStyles[color] || colorStyles.slate;

  return (
    <Card className="group relative overflow-hidden transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.12)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/80 to-cyan-400/0" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {title}
          </p>
          <p className={`mt-3 text-2xl font-semibold tracking-tight ${styles.value}`}>
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 ring-slate-700 transition group-hover:scale-105 ${styles.icon}`}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>
      </div>
    </Card>
  );
}
